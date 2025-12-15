'use client';

import { useTheme } from './ThemeProvider';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="fixed top-4 right-4 z-[60] flex items-center gap-2 px-3 py-1.5 rounded-full border-2 border-black bg-white/90 dark:bg-slate-900/90 text-xs font-semibold shadow-[0_4px_12px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(0,0,0,0.4)] transition-all"
    >
      <span className="inline-flex w-5 h-5 items-center justify-center rounded-full border border-black bg-yellow-300 dark:bg-slate-800 text-[11px]">
        {isDark ? '🌙' : '☀️'}
      </span>
      <span className="hidden sm:inline">
        {isDark ? 'Dark mode' : 'Light mode'}
      </span>
    </button>
  );
}


