'use client';

import { useState } from 'react';
import Terminal from '../components/Terminal';

export default function MacStartupPage() {
  const [showTerminal, setShowTerminal] = useState(false);

  return (
    <div
      className="min-h-screen text-white relative overflow-hidden"
      style={{
        backgroundImage:
          'linear-gradient(to bottom, #d7e9ff 0%, #78b7ff 35%, #0b63c5 70%, #013566 100%)',
      }}
    >
      {/* Soft wave overlay to mimic macOS wallpaper */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -bottom-40 left-[-10%] w-[140%] h-[55%] bg-white/70 rounded-[50%] blur-3xl" />
        <div className="absolute bottom-[-25%] right-[-10%] w-[120%] h-[60%] bg-sky-400/80 rounded-[50%] blur-3xl mix-blend-screen" />
      </div>

      {/* macOS-style menu bar */}
      <header className="relative z-10 h-9 px-4 flex items-center justify-between bg-white/15 backdrop-blur-md text-[13px]">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1 font-semibold">
            <span className="text-lg"></span>
            <span className="font-semibold">Finder</span>
          </div>
          <nav className="hidden md:flex items-center gap-4 text-xs">
            <span className="font-semibold">File</span>
            <span className="opacity-80">Edit</span>
            <span className="opacity-80">View</span>
            <span className="opacity-80">Go</span>
            <span className="opacity-80">Window</span>
            <span className="opacity-80">Help</span>
          </nav>
        </div>
        <div className="flex items-center gap-3 text-xs opacity-90">
          <span>🔊</span>
          <span>🔋 100%</span>
          <span>Tue 9:41 AM</span>
        </div>
      </header>

      {/* Empty desktop area */}
      <main className="relative z-10 flex flex-col items-center justify-center pt-10 pb-24" />

      {/* macOS Dock with functional Terminal icon */}
      <footer className="pointer-events-none absolute bottom-3 inset-x-0 flex justify-center z-10">
        <div className="pointer-events-auto flex items-end gap-3 px-4 py-3 rounded-[26px] bg-white/35 backdrop-blur-xl border border-white/60 shadow-[0_22px_45px_rgba(0,0,0,0.7)]">
          {/* Placeholder apps */}
          <DockIcon label="Finder" color="#3b82f6" />
          <DockIcon label="Safari" color="#10b981" />
          <DockIcon label="Mail" color="#ef4444" />

          {/* Terminal app - clickable */}
          <button
            type="button"
            onClick={() => setShowTerminal(true)}
            className="group flex flex-col items-center gap-1 focus:outline-none"
          >
            <div
              className="w-14 h-14 rounded-2xl border-[3px] border-black bg-gradient-to-br from-slate-900 via-slate-800 to-black flex items-center justify-center shadow-[0_10px_25px_rgba(0,0,0,0.7)] group-hover:-translate-y-1 transition-transform"
            >
              <span className="text-2xl font-mono">_</span>
            </div>
            <span className="text-[11px] text-white/80 group-hover:text-white">Terminal</span>
            <div className="h-1 w-1 rounded-full bg-white/80 mt-0.5" />
          </button>

          {/* More placeholders */}
          <DockIcon label="Photos" color="#f59e0b" />
          <DockIcon label="Settings" color="#8b5cf6" />
        </div>
      </footer>

      {/* Terminal window that opens from the dock */}
      {showTerminal && (
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="relative max-w-3xl w-[90%] shadow-[0_25px_60px_rgba(0,0,0,0.9)]">
            <Terminal
              username="mohit"
              hostname="MacBook-Pro"
              shell="zsh"
              onStart={() => setShowTerminal(false)}
            />
            {/* Close button overlay in corner */}
            <button
              type="button"
              onClick={() => setShowTerminal(false)}
              className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-black text-white text-xs flex items-center justify-center shadow-lg border border-white/40"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

interface DockIconProps {
  label: string;
  color: string;
}

function DockIcon({ label, color }: DockIconProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="w-12 h-12 rounded-2xl border border-black/40 flex items-center justify-center shadow-[0_10px_25px_rgba(0,0,0,0.6)] bg-white/90"
        style={{ backgroundColor: color }}
      >
        <span className="text-lg font-black text-black">☺</span>
      </div>
      <span className="text-[11px] text-white/80">{label}</span>
    </div>
  );
}


