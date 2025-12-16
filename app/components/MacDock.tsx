'use client';

import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import {
  FaFolder,
  FaSafari,
  FaCode,
  FaEnvelope,
  FaGithub,
  FaTerminal,
} from 'react-icons/fa';

interface DockItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  isActive?: boolean;
}

interface MacDockProps {
  items: DockItem[];
  onPortfolioClick: () => void;
}

export default function MacDock({ items, onPortfolioClick }: MacDockProps) {
  const mouseX = useMotionValue<number>(Infinity);
  const dockRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const baseSize = isMobile ? 48 : 64;
  const maxSize = isMobile ? 64 : 96;
  const distance = isMobile ? 100 : 150;

  return (
    <motion.div
      ref={dockRef}
      onMouseMove={(e) => {
        if (dockRef.current) {
          const rect = dockRef.current.getBoundingClientRect();
          mouseX.set(e.clientX - rect.left);
        }
      }}
      onMouseLeave={() => {
        mouseX.set(Infinity);
        setHoveredIndex(null);
      }}
      className="fixed bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-50"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="flex items-end gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 rounded-2xl sm:rounded-3xl bg-white/20 backdrop-blur-2xl border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        {items.map((item, index) => (
          <DockIcon
            key={item.id}
            item={item}
            index={index}
            mouseX={mouseX}
            baseSize={baseSize}
            maxSize={maxSize}
            distance={distance}
            isHovered={hoveredIndex === index}
            onHover={() => setHoveredIndex(index)}
            onLeave={() => setHoveredIndex(null)}
          />
        ))}
        {/* Divider */}
        <div className="w-px h-8 sm:h-12 bg-white/20 mx-0.5 sm:mx-1" />
        {/* Portfolio.exe app - colorful icon */}
        <DockIcon
          item={{
            id: 'portfolio',
            label: 'portfolio.exe',
            icon: (
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-pink-500 via-amber-300 to-sky-400 flex items-center justify-center shadow-md">
                <FaTerminal className="w-3 h-3 sm:w-4 sm:h-4 text-black" />
              </div>
            ),
            onClick: onPortfolioClick,
            isActive: false,
          }}
          index={items.length}
          mouseX={mouseX}
          baseSize={baseSize}
          maxSize={maxSize}
          distance={distance}
          isHovered={hoveredIndex === items.length}
          onHover={() => setHoveredIndex(items.length)}
          onLeave={() => setHoveredIndex(null)}
        />
      </div>
    </motion.div>
  );
}

interface DockIconProps {
  item: DockItem;
  index: number;
  mouseX: any;
  baseSize: number;
  maxSize: number;
  distance: number;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}

function DockIcon({
  item,
  index,
  mouseX,
  baseSize,
  maxSize,
  distance,
  isHovered,
  onHover,
  onLeave,
}: DockIconProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [showLabel, setShowLabel] = useState(false);

  const distanceFromMouse = useTransform(mouseX, (val: number) => {
    if (!ref.current) return Infinity;
    const rect = ref.current.getBoundingClientRect();
    const iconCenterX = rect.left + rect.width / 2;
    return Math.abs(val - iconCenterX);
  });

  const size = useSpring(
    useTransform(distanceFromMouse, [0, distance], [maxSize, baseSize]),
    { stiffness: 300, damping: 30 }
  );

  const scale = useTransform(size, (s) => s / baseSize);

  useEffect(() => {
    if (isHovered) {
      const timer = setTimeout(() => setShowLabel(true), 200);
      return () => clearTimeout(timer);
    } else {
      setShowLabel(false);
    }
  }, [isHovered]);

  return (
    <div className="relative flex flex-col items-center">
      <motion.div
        ref={ref}
        style={{ width: size, height: size }}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
        onClick={item.onClick}
        className="flex items-center justify-center cursor-pointer relative"
        whileHover={{ scale: 1.08, y: -6 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <motion.div
          style={{ scale }}
          className="w-full h-full flex items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg transition-all duration-200 hover:bg-white/20 hover:shadow-xl"
        >
          <div className="flex items-center justify-center">{item.icon}</div>
        </motion.div>
        {item.isActive && (
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white" />
        )}
      </motion.div>
      <AnimatePresence>
        {showLabel && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute -top-10 px-2 py-1 rounded bg-black/80 text-white text-xs whitespace-nowrap pointer-events-none"
          >
            {item.label}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

