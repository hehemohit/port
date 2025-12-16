'use client';

import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import Terminal from './Terminal';
import React from 'react';

interface MacWindowProps {
  isOpen: boolean;
  isMinimized: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize?: () => void;
   onStart?: () => void;
  onFocus?: () => void;
  isActive?: boolean;
  initialPosition?: { x: number; y: number };
  children?: React.ReactNode;
  title?: string;
  username?: string;
  hostname?: string;
  shell?: string;
}

export default function MacWindow({
  isOpen,
  isMinimized,
  onClose,
  onMinimize,
  onMaximize,
  onStart,
  onFocus,
  isActive = false,
  initialPosition = { x: 100, y: 100 },
  title = 'Terminal',
  username = 'mohit',
  hostname = 'MohitPortfolioConsole',
  shell = 'zsh',
  children,
}: MacWindowProps) {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const windowRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(initialPosition.x);
  const y = useMotionValue(initialPosition.y);

  // Detect mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Calculate center position on mount - responsive
  useEffect(() => {
    if (isOpen && !isMinimized) {
      const windowWidth = isMobile ? window.innerWidth * 0.95 : 800;
      const windowHeight = isMobile ? window.innerHeight * 0.9 : 600;
      
      // Center the window on screen
      const centerX = (window.innerWidth - windowWidth) / 2;
      const centerY = isMobile ? 20 : (window.innerHeight - windowHeight) / 2 + 20; // Offset for menu bar
      x.set(centerX);
      y.set(centerY);
      setPosition({ x: centerX, y: centerY });
    }
  }, [isOpen, isMinimized, isMobile, x, y]);

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setPosition({ x: position.x + info.offset.x, y: position.y + info.offset.y });
    x.set(position.x + info.offset.x);
    y.set(position.y + info.offset.y);
    setIsDragging(false);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      ref={windowRef}
      onMouseDown={() => {
        if (onFocus) onFocus();
      }}
      drag={!isMobile} // Only allow dragging on desktop
      dragMomentum={false}
      dragElastic={0}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      style={{
        x,
        y,
        zIndex: isDragging ? 1000 : isActive ? 900 : 800,
      }}
      initial={{ scale: 0.3, opacity: 0, y: window.innerHeight - 100 }}
      animate={
        isMinimized
          ? { scale: 0, opacity: 0, y: window.innerHeight - 100 }
          : { scale: 1, opacity: 1, y: position.y }
      }
      exit={{ scale: 0.3, opacity: 0, y: window.innerHeight - 100 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 25,
        mass: 0.8,
      }}
      className="fixed top-0 left-0 w-full h-full sm:w-[800px] sm:max-w-[90vw] sm:h-[600px] sm:max-h-[85vh]"
    >
      <div className="w-full h-full flex flex-col bg-white/10 backdrop-blur-xl rounded-2xl border border-white/30 shadow-2xl overflow-hidden">
        {/* Title Bar */}
        <div
          className="flex items-center justify-between px-2 sm:px-4 h-8 sm:h-10 bg-white/20 backdrop-blur-md border-b border-white/20 cursor-move"
          onMouseDown={(e) => e.preventDefault()}
        >
          {/* Traffic Lights */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={onClose}
              className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ff5f57] hover:bg-[#ff3b30] transition-colors flex items-center justify-center group"
              aria-label="Close"
            >
              <span className="text-[7px] sm:text-[8px] text-[#8d1f18] opacity-0 group-hover:opacity-100 transition-opacity">
                ×
              </span>
            </button>
            <button
              onClick={onMinimize}
              className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ffbd2e] hover:bg-[#ff9500] transition-colors flex items-center justify-center group"
              aria-label="Minimize"
            >
              <span className="text-[7px] sm:text-[8px] text-[#8d6a00] opacity-0 group-hover:opacity-100 transition-opacity">
                −
              </span>
            </button>
            {onMaximize && (
              <button
                onClick={onMaximize}
                className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#28ca42] hover:bg-[#20d148] transition-colors flex items-center justify-center group hidden sm:flex"
                aria-label="Maximize"
              >
                <span className="text-[7px] sm:text-[8px] text-[#1a5f24] opacity-0 group-hover:opacity-100 transition-opacity">
                  +
                </span>
              </button>
            )}
          </div>

          {/* Window Title */}
          <div className="flex-1 text-center px-1 sm:px-0">
            <span className="text-xs sm:text-sm font-medium text-white/90 truncate block">{title}</span>
          </div>

          {/* Spacer for symmetry */}
          <div className="w-8 sm:w-16" />
        </div>

        {/* Window Content */}
        <div className="flex-1 overflow-hidden bg-transparent">
          <div className="w-full h-full mac-window-terminal">
            {children ? (
              children
            ) : (
              <Terminal
                username={username}
                hostname={hostname}
                shell={shell}
                hideTitlebar
                onStart={onStart}
                onNavigate={(section) => {
                  const element = document.getElementById(section);
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
              />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

