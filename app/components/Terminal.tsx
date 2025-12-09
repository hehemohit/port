'use client';

import { useState, useEffect, useRef } from 'react';
import './Terminal.css';

interface Command {
  input: string;
  output: string;
  timestamp: Date;
}

interface TerminalProps {
  initialCommands?: Command[];
  onCommand?: (command: string) => string | Promise<string>;
  username?: string;
  hostname?: string;
  shell?: string;
}

export default function Terminal({
  initialCommands = [],
  onCommand,
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

    // Add command to history
    setCommands(prev => [...prev, {
      input: command,
      output,
      timestamp: new Date()
    }]);
  };

  // Default command handlers (extensible)
  const handleDefaultCommand = (command: string): string => {
    const cmd = command.trim().toLowerCase();
    
    switch (cmd) {
      case 'help':
        return `Available commands:
  help     - Show this help message
  clear    - Clear the terminal
  whoami   - Display current user
  date     - Show current date and time
  echo     - Echo back the input
  ls       - List files (placeholder)
  pwd      - Print working directory`;
      
      case 'whoami':
        return username;
      
      case 'date':
        return new Date().toString();
      
      case 'pwd':
        return '~';
      
      case 'ls':
        return 'Documents  Downloads  Projects  Desktop';
      
      default:
        if (cmd.startsWith('echo ')) {
          return command.substring(5);
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

