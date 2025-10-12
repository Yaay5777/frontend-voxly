import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon, Sparkles } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="theme-toggle">
      <button
        className={`theme-option ${theme === 'light' ? 'active' : ''}`}
        onClick={() => setTheme('light')}
        title="Light Mode"
        style={{
          background: theme === 'light' ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' : 'transparent'
        }}
      >
        <Sun size={20} color={theme === 'light' ? '#fff' : '#fbbf24'} />
      </button>

      <button
        className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
        onClick={() => setTheme('dark')}
        title="Dark Mode"
        style={{
          background: theme === 'dark' ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' : 'transparent'
        }}
      >
        <Moon size={20} color={theme === 'dark' ? '#fff' : '#6366f1'} />
      </button>

      <button
        className={`theme-option ${theme === 'vibey' ? 'active neon-glow' : ''}`}
        onClick={() => setTheme('vibey')}
        title="Vibey Mode 🔥"
        style={{
          background: theme === 'vibey' 
            ? 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #3b82f6 100%)' 
            : 'transparent'
        }}
      >
        <Sparkles size={20} color={theme === 'vibey' ? '#fff' : '#ec4899'} />
      </button>
    </div>
  );
};
