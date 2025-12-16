"use client";

import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from 'framer-motion';
import MacDock from './MacDock';
import MacWindow from './MacWindow';
import FileExplorer from './FileExplorer';
import bg6052105 from '../assets/6052105.jpg';
import {
  FaFolder,
  FaSafari,
  FaCode,
  FaEnvelope,
  FaGithub,
} from 'react-icons/fa';

export default function Desktop() {
  const [isWindowOpen, setIsWindowOpen] = useState(false);
  const [isWindowMinimized, setIsWindowMinimized] = useState(false);
  const [showFinder, setShowFinder] = useState(false);
  const [appPrompt, setAppPrompt] = useState<null | 'safari' | 'vscode' | 'mail' | 'github'>(null);
  const [showFileMenu, setShowFileMenu] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ visible: boolean; x: number; y: number }>({
    visible: false,
    x: 0,
    y: 0,
  });
  const [currentTime, setCurrentTime] = useState('');
  const router = useRouter();
  const [showHint, setShowHint] = useState(true);
  const [activeWindow, setActiveWindow] = useState<'portfolio' | 'finder' | 'appPrompt' | null>(null);

  // Update time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
      setCurrentTime(timeString);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const dockItems = [
    {
      id: 'finder',
      label: 'Finder',
      icon: (
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-500 via-cyan-300 to-blue-600 flex items-center justify-center shadow-md">
          <FaFolder className="w-5 h-5 text-white" />
        </div>
      ),
      onClick: () => setShowFinder(true),
      isActive: false,
    },
    {
      id: 'safari',
      label: 'Safari',
      icon: <FaSafari className="w-8 h-8 text-white" />,
      onClick: () => {
        setAppPrompt('safari');
        setActiveWindow('appPrompt');
      },
      isActive: false,
    },
    {
      id: 'vscode',
      label: 'VS Code',
      icon: <FaCode className="w-8 h-8 text-white" />,
      onClick: () => {
        setAppPrompt('vscode');
        setActiveWindow('appPrompt');
      },
      isActive: false,
    },
    {
      id: 'mail',
      label: 'Mail',
      icon: <FaEnvelope className="w-8 h-8 text-white" />,
      onClick: () => {
        setAppPrompt('mail');
        setActiveWindow('appPrompt');
      },
      isActive: false,
    },
    {
      id: 'github',
      label: 'GitHub',
      icon: <FaGithub className="w-8 h-8 text-white" />,
      onClick: () => {
        setAppPrompt('github');
        setActiveWindow('appPrompt');
      },
      isActive: false,
    },
  ];

  const handlePortfolioClick = () => {
    if (isWindowMinimized) {
      setIsWindowMinimized(false);
    } else {
      setIsWindowOpen(true);
      setIsWindowMinimized(false);
    }
    setActiveWindow('portfolio');
  };

  const handleClose = () => {
    setIsWindowOpen(false);
    setIsWindowMinimized(false);
    setActiveWindow((prev) => (prev === 'portfolio' ? (showFinder ? 'finder' : appPrompt ? 'appPrompt' : null) : prev));
  };

  const handleMinimize = () => {
    setIsWindowMinimized(true);
  };

  const handleCloseFinder = () => {
    setShowFinder(false);
    setActiveWindow((prev) => (prev === 'finder' ? (isWindowOpen ? 'portfolio' : appPrompt ? 'appPrompt' : null) : prev));
  };

  const handleCloseAppPrompt = () => {
    setAppPrompt(null);
    setActiveWindow((prev) =>
      prev === 'appPrompt' ? (isWindowOpen ? 'portfolio' : showFinder ? 'finder' : null) : prev
    );
  };

  const handleStartInWindow = () => {
    // When user types "start" inside the terminal, navigate to portfolio page
    router.push("/portfolio");
    setShowHint(false);
  };

  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
    });
  };

  const closeContextMenu = () => {
    setContextMenu((prev) => ({ ...prev, visible: false }));
  };

  const handleDesktopClick = () => {
    if (contextMenu.visible) closeContextMenu();
    if (showFileMenu) setShowFileMenu(false);
  };

  return (
    <div
      className="relative w-full h-screen overflow-hidden"
      onContextMenu={handleContextMenu}
      onClick={handleDesktopClick}
    >
      {/* macOS Wallpaper Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${bg6052105.src})`,
        }}
      />

      {/* Menu Bar */}
      <header className="fixed top-0 left-0 right-0 z-40 h-8 sm:h-8 px-2 sm:px-4 flex items-center justify-between bg-white/10 backdrop-blur-xl border-b border-white/20 text-white text-[10px] sm:text-xs">
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-1 font-semibold text-xs sm:text-sm">
            <span className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-md bg-white text-black text-[10px] sm:text-xs font-bold leading-none">
              M
            </span>
            <span className="hidden sm:inline">Mohit Portfolio</span>
            <span className="sm:hidden">Portfolio</span>
          </div>
          <nav className="flex items-center gap-1 sm:gap-2 md:gap-4 relative">
            <button
              type="button"
              className="font-semibold hover:bg-white/10 px-1 sm:px-2 py-0.5 sm:py-1 rounded cursor-pointer text-[9px] sm:text-xs"
              onClick={(e) => {
                e.stopPropagation();
                setShowFileMenu((prev) => !prev);
                closeContextMenu();
              }}
            >
              <span className="hidden sm:inline">File</span>
              <span className="sm:hidden">F</span>
            </button>
            {showFileMenu && (
              <div className="absolute top-6 left-0 mt-1 w-40 sm:w-52 rounded-md bg-black/80 text-white text-[10px] sm:text-xs shadow-xl border border-white/20 z-50">
                <button
                  type="button"
                  className="w-full text-left px-2 sm:px-3 py-1 sm:py-1.5 hover:bg-white/10"
                  onClick={() => {
                    setShowFinder(true);
                    setShowFileMenu(false);
                  }}
                >
                  New Finder Window
                </button>
                <button
                  type="button"
                  className="w-full text-left px-2 sm:px-3 py-1 sm:py-1.5 hover:bg-white/10"
                  onClick={() => {
                    handlePortfolioClick();
                    setShowFileMenu(false);
                  }}
                >
                  Open portfolio.exe
                </button>
                <button
                  type="button"
                  className="w-full text-left px-2 sm:px-3 py-1 sm:py-1.5 hover:bg-white/10"
                  onClick={() => {
                    router.push("/portfolio");
                    setShowFileMenu(false);
                  }}
                >
                  Open Portfolio Page
                </button>
                <div className="h-px bg-white/10 my-1" />
                <button
                  type="button"
                  className="w-full text-left px-2 sm:px-3 py-1 sm:py-1.5 hover:bg-white/10"
                  onClick={() => {
                    setIsWindowOpen(false);
                    setIsWindowMinimized(false);
                    setShowFinder(false);
                    setShowFileMenu(false);
                  }}
                >
                  Close All Windows
                </button>
              </div>
            )}
            <span className="opacity-80 hover:bg-white/10 px-1 sm:px-2 py-0.5 sm:py-1 rounded cursor-pointer text-[9px] sm:text-xs hidden md:inline">
              Edit
            </span>
            <span className="opacity-80 hover:bg-white/10 px-1 sm:px-2 py-0.5 sm:py-1 rounded cursor-pointer text-[9px] sm:text-xs hidden lg:inline">
              View
            </span>
            <span className="opacity-80 hover:bg-white/10 px-1 sm:px-2 py-0.5 sm:py-1 rounded cursor-pointer text-[9px] sm:text-xs hidden lg:inline">
              Go
            </span>
            <span className="opacity-80 hover:bg-white/10 px-1 sm:px-2 py-0.5 sm:py-1 rounded cursor-pointer text-[9px] sm:text-xs hidden xl:inline">
              Window
            </span>
            <span className="opacity-80 hover:bg-white/10 px-1 sm:px-2 py-0.5 sm:py-1 rounded cursor-pointer text-[9px] sm:text-xs hidden xl:inline">
              Help
            </span>
          </nav>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-3 text-[10px] sm:text-xs">
          <span className="opacity-90 hidden sm:inline">📶</span>
          <span className="opacity-90 hidden sm:inline">🔋 100%</span>
          <span className="opacity-90 hidden sm:inline">🔊</span>
          <span className="opacity-90">{currentTime}</span>
        </div>
      </header>

      {/* Desktop Area */}
      <main className="relative w-full h-full pt-8 sm:pt-8 pb-20 sm:pb-24">
        {/* Onboarding hint bubble (stays until closed) */}
        <AnimatePresence>
          {showHint && (
            <motion.div
              className="fixed top-12 sm:top-16 right-4 sm:right-8 z-40 max-w-[calc(100%-2rem)] sm:max-w-sm md:max-w-md bg-white/15 text-white text-xs sm:text-sm rounded-2xl px-4 sm:px-5 py-3 sm:py-4 shadow-[0_18px_45px_rgba(0,0,0,0.7)] border border-white/30 backdrop-blur-2xl flex items-start gap-2 sm:gap-3"
              initial={{ opacity: 0, y: -24, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -24, scale: 0.9 }}
              transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
            >
              <div className="mt-0.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-pink-500 via-amber-300 to-sky-400 flex items-center justify-center text-[10px] sm:text-[11px] font-bold text-black shadow-md flex-shrink-0">
                i
              </div>
              <div className="flex-1 pr-1 sm:pr-2 min-w-0">
                <p className="text-[10px] sm:text-xs uppercase tracking-[0.18em] opacity-80 mb-1">
                  Quick tip
                </p>
                <p className="font-semibold mb-1 text-xs sm:text-sm">
                  Launch your portfolio from the dock
                </p>
                <p className="opacity-85 leading-snug text-[11px] sm:text-sm">
                  Click the colorful <span className="font-mono">portfolio.exe</span> icon in the dock to open the terminal,
                  then type <span className="font-mono">start</span> and press Enter to jump straight to your portfolio page.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowHint(false)}
                className="ml-1 text-xs opacity-70 hover:opacity-100 flex-shrink-0"
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Window */}
        <AnimatePresence>
          {isWindowOpen && (
            <MacWindow
              key="portfolio-window"
              isOpen={isWindowOpen}
              isMinimized={isWindowMinimized}
              onClose={handleClose}
              onMinimize={handleMinimize}
              onStart={handleStartInWindow}
              onFocus={() => setActiveWindow('portfolio')}
              isActive={activeWindow === 'portfolio'}
              title="portfolio.exe — Terminal"
              username="mohit"
              hostname="MohitPortfolioConsole"
              shell="zsh"
            />
          )}
          {showFinder && (
            <MacWindow
              key="finder-window"
              isOpen={showFinder}
              isMinimized={false}
              onClose={handleCloseFinder}
              onMinimize={handleCloseFinder}
              onFocus={() => setActiveWindow('finder')}
              isActive={activeWindow === 'finder'}
              title="Finder — Portfolio"
              username="mohit"
              hostname="MohitPortfolioConsole"
              shell="zsh"
            >
              <FileExplorer />
            </MacWindow>
          )}
          {appPrompt && (
            <MacWindow
              key="app-prompt-window"
              isOpen={true}
              isMinimized={false}
              onClose={handleCloseAppPrompt}
              onMinimize={handleCloseAppPrompt}
              onFocus={() => setActiveWindow('appPrompt')}
              isActive={activeWindow === 'appPrompt'}
              title="Open Portfolio"
              username="mohit"
              hostname="MohitPortfolioConsole"
              shell="zsh"
            >
              <div className="w-full h-full flex flex-col items-center justify-center bg-white/5 text-white px-6">
                <h2 className="text-lg md:text-xl font-semibold mb-3 text-center">
                  Access Mohit&apos;s portfolio
                </h2>
                <p className="text-sm md:text-base opacity-85 text-center max-w-md mb-4">
                  You opened <span className="font-mono">{appPrompt}</span>. You can explore the portfolio by
                  launching <span className="font-mono">portfolio.exe</span> and typing
                  <span className="font-mono"> start</span>, or jump straight to the portfolio page below.
                </p>
                <div className="flex flex-col md:flex-row gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      handlePortfolioClick();
                      setActiveWindow('portfolio');
                    }}
                    className="px-4 py-2 rounded-xl bg-white text-black text-sm font-semibold shadow-md hover:bg-gray-100"
                  >
                    Open terminal (portfolio.exe)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      router.push('/portfolio');
                      setShowHint(false);
                    }}
                    className="px-4 py-2 rounded-xl border border-white/60 text-sm font-semibold hover:bg-white/10"
                  >
                    Go to portfolio page
                  </button>
                </div>
              </div>
            </MacWindow>
          )}
        </AnimatePresence>
      </main>

      {/* Dock - responsive */}
      <MacDock items={dockItems} onPortfolioClick={handlePortfolioClick} />

      {/* Custom Desktop Context Menu */}
      {contextMenu.visible && (
        <div
          className="fixed z-50 w-52 rounded-md bg-black/85 text-white text-xs shadow-xl border border-white/20"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="w-full text-left px-3 py-1.5 hover:bg-white/10"
            onClick={() => {
              handlePortfolioClick();
              closeContextMenu();
            }}
          >
            Open portfolio.exe
          </button>
          <button
            type="button"
            className="w-full text-left px-3 py-1.5 hover:bg-white/10"
            onClick={() => {
              setShowFinder(true);
              closeContextMenu();
            }}
          >
            New Finder Window
          </button>
          <button
            type="button"
            className="w-full text-left px-3 py-1.5 hover:bg-white/10"
            onClick={() => {
              router.push("/portfolio");
              closeContextMenu();
            }}
          >
            Open Portfolio Page
          </button>
          <div className="h-px bg-white/10 my-1" />
          <button
            type="button"
            className="w-full text-left px-3 py-1.5 hover:bg-white/10"
            onClick={() => {
              setIsWindowOpen(false);
              setIsWindowMinimized(false);
              setShowFinder(false);
              closeContextMenu();
            }}
          >
            Close All Windows
          </button>
        </div>
      )}
    </div>
  );
}

