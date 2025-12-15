'use client';

import { useState, useEffect, useRef } from 'react';
import './Terminal.css';
import { useTheme } from './ThemeProvider';

interface Command {
  input: string;
  output: string;
  timestamp: Date;
}

interface TerminalProps {
  initialCommands?: Command[];
  onCommand?: (command: string) => string | Promise<string>;
  onNavigate?: (section: string) => void;
  onStart?: () => void;
  username?: string;
  hostname?: string;
  shell?: string;
}

export default function Terminal({
  initialCommands = [],
  onCommand,
  onNavigate,
  onStart,
  username = 'jumpcloud',
  hostname = 'JumpCloud',
  shell = 'zsh'
}: TerminalProps) {
  const [commands, setCommands] = useState<Command[]>(initialCommands);
  const [currentInput, setCurrentInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme, toggleTheme } = useTheme();
  const [lastLogin] = useState(() => {
    const now = new Date();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[now.getDay()]} ${months[now.getMonth()]} ${now.getDate()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
  });

  // Auto-scroll to bottom when new commands are added
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commands]);

  // Focus input when terminal is clicked
  const handleTerminalClick = () => {
    inputRef.current?.focus();
    setIsFocused(true);
  };

  // Handle command execution
  const executeCommand = async (command: string) => {
    if (!command.trim()) {
      return;
    }

    // Handle clear command specially
    if (command.trim().toLowerCase() === 'clear') {
      setCommands([]);
      const newHistory = [...commandHistory, command];
      setCommandHistory(newHistory);
      setHistoryIndex(-1);
      return;
    }

    // Add to history
    const newHistory = [...commandHistory, command];
    setCommandHistory(newHistory);
    setHistoryIndex(-1);

    // Execute command
    let output = '';
    if (onCommand) {
      try {
        output = await onCommand(command);
      } catch (error) {
        output = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      }
    } else {
      // Default command handling
      output = handleDefaultCommand(command);
    }

    // Add command + any output to history
    setCommands(prev => [...prev, {
      input: command,
      output,
      timestamp: new Date()
    }]);
  };

  // Default command handlers (extensible)
  const handleDefaultCommand = (command: string): string => {
    const raw = command.trim();
    const cmd = raw.toLowerCase();

    // Theme controls
    if (cmd === 'theme' || cmd === 'theme status') {
      return `Current theme: ${theme}`;
    }

    if (cmd === 'theme dark' || cmd === 'dark') {
      setTheme('dark');
      return 'Switched to dark mode.';
    }

    if (cmd === 'theme light' || cmd === 'light') {
      setTheme('light');
      return 'Switched to light mode.';
    }

    if (cmd === 'theme toggle' || cmd === 'toggle theme') {
      const next = theme === 'light' ? 'dark' : 'light';
      toggleTheme();
      return `Toggled theme to ${next}.`;
    }
    
    // Special start command to reveal the page
    if (cmd === 'start') {
      if (onStart) {
        onStart();
        return 'Starting portfolio...';
      }
      return 'Start command not available.';
    }

    // Navigation commands
    const navigationCommands: { [key: string]: string } = {
      'home': 'home',
      'about': 'about',
      'experience': 'experience',
      'projects': 'projects',
      'education': 'education',
      'skills': 'skills',
      'leadership': 'leadership-section',
      'contact': 'contact',
      'cd home': 'home',
      'cd about': 'about',
      'cd experience': 'experience',
      'cd projects': 'projects',
      'cd education': 'education',
      'cd skills': 'skills',
      'cd leadership': 'leadership-section',
      'cd contact': 'contact',
    };

    if (navigationCommands[cmd]) {
      if (onNavigate) {
        onNavigate(navigationCommands[cmd]);
        return `Navigating to ${navigationCommands[cmd]}...`;
      }
      return `Navigation not available.`;
    }
    
    switch (cmd) {
      case 'help':
        return `Available commands:
  help              - Show this help message
  clear             - Clear the terminal
  whoami            - Display current user
  date              - Show current date and time
  echo <text>       - Echo back the input
  ls                - List available sections
  pwd               - Print working directory
  start             - Reveal the portfolio page
  theme             - Show current theme (light/dark)
  theme dark        - Switch to dark mode
  theme light       - Switch to light mode
  theme toggle      - Toggle between light and dark
  
Navigation commands:
  home              - Navigate to home section
  about             - Navigate to about section
  experience        - Navigate to experience section
  projects          - Navigate to projects section
  education         - Navigate to education section
  skills            - Navigate to skills section
  leadership        - Navigate to leadership section
  contact           - Navigate to contact section
  cd <section>      - Navigate to a section (alternative syntax)
  
Examples:
  about             - Go to About section
  cd projects       - Go to Projects section
  theme dark        - Enable dark mode
  theme toggle      - Toggle current theme
  echo Hello        - Echo "Hello"`;
      
      case 'whoami':
        return username;
      
      case 'date':
        return new Date().toString();
      
      case 'pwd':
        return '~';
      
      case 'ls':
        return 'home  about  experience  projects  education  skills  leadership  contact';
      
      default:
        if (cmd.startsWith('echo ')) {
          return command.substring(5);
        }
        if (cmd.startsWith('cd ')) {
          const section = cmd.substring(3).trim();
          if (onNavigate) {
            // Try to find the section
            const sectionMap: { [key: string]: string } = {
              'home': 'home',
              'about': 'about',
              'experience': 'experience',
              'projects': 'projects',
              'education': 'education',
              'skills': 'skills',
              'leadership': 'leadership-section',
              'contact': 'contact',
            };
            const targetSection = sectionMap[section];
            if (targetSection) {
              onNavigate(targetSection);
              return `Navigating to ${section}...`;
            }
            return `Section '${section}' not found. Type 'ls' to see available sections.`;
          }
          return `Navigation not available.`;
        }
        return `Command not found: ${command}. Type 'help' for available commands.`;
    }
  };

  // Handle input submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentInput.trim()) {
      executeCommand(currentInput);
      setCurrentInput('');
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 
          ? commandHistory.length - 1 
          : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex >= 0) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setCurrentInput('');
        } else {
          setHistoryIndex(newIndex);
          setCurrentInput(commandHistory[newIndex]);
        }
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Tab completion can be added here
    }
  };

  const prompt = `${username}@${hostname} ~ % `;

  return (
    <div className="terminal-container" onClick={handleTerminalClick}>
      {/* Window Title Bar */}
      <div className="terminal-titlebar">
        <div className="terminal-traffic-lights">
          <div className="traffic-light traffic-light-close"></div>
          <div className="traffic-light traffic-light-minimize"></div>
          <div className="traffic-light traffic-light-maximize"></div>
        </div>
        <div className="terminal-title">
          <span className="terminal-title-icon">🏠</span>
          {username} — -{shell} — 80x24
        </div>
      </div>

      {/* Terminal Content */}
      <div className="terminal-content" ref={terminalRef}>
        {/* Last Login Message */}
        {commands.length === 0 && (
          <div className="terminal-line">
            <span className="terminal-text">Last login: {lastLogin} on console</span>
          </div>
        )}

        {/* Command History */}
        {commands.map((cmd, index) => (
          <div key={index} className="terminal-command-block">
            <div className="terminal-line">
              <span className="terminal-prompt">{prompt}</span>
              <span className="terminal-input">{cmd.input}</span>
            </div>
            {cmd.output && (
              <div className="terminal-line">
                <span className="terminal-output">{cmd.output}</span>
              </div>
            )}
          </div>
        ))}

        {/* Current Input Line */}
        <form onSubmit={handleSubmit} className="terminal-input-line">
          <span className="terminal-prompt">{prompt}</span>
          <span className="terminal-input-wrapper">
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="terminal-input-field"
              autoComplete="off"
              spellCheck="false"
              style={{ width: `${Math.max(currentInput.length + 1, 1)}ch` }}
            />
            {isFocused && <span className="terminal-cursor">▊</span>}
          </span>
        </form>
      </div>
    </div>
  );
}

