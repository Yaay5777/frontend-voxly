import React from 'react';
import { Sun, Moon, Sparkles } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';
import { motion, AnimatePresence } from 'framer-motion';
import { trackEvent } from '../services/analytics';

export const ThemeToggle: React.FC = () => {
  const { mode, setThemeMode } = useThemeStore();

  const cycleTheme = () => {
    const nextMode = mode === 'light' ? 'dark' : mode === 'dark' ? 'vibes' : 'light';
    setThemeMode(nextMode);
    trackEvent.themeChanged(nextMode);
  };

  const getIcon = () => {
    switch(mode) {
      case 'light': return <Sun className="w-5 h-5" />;
      case 'dark': return <Moon className="w-5 h-5" />;
      case 'vibes': return <Sparkles className="w-5 h-5" />;
    }
  };

  const getButtonStyle = () => {
    switch(mode) {
      case 'light':
        return 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-lg';
      case 'dark':
        return 'bg-gradient-to-br from-purple-600 via-violet-600 to-fuchsia-600 text-white shadow-lg shadow-purple-500/50';
      case 'vibes':
        return 'bg-gradient-to-r from-pink-500 via-purple-500 via-cyan-500 to-yellow-500 text-white shadow-lg shadow-pink-500/50 bg-[length:200%_100%] animate-gradient-x';
    }
  };

  return (
    <motion.button
      onClick={cycleTheme}
      className={`p-3 rounded-xl transition-all duration-300 backdrop-blur-sm ${getButtonStyle()}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={`Switch to ${mode === 'light' ? 'Dark' : mode === 'dark' ? 'Vibes' : 'Light'} Mode`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ rotate: -180, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 180, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {getIcon()}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
};
