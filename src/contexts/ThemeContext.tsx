import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'vibey';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Get saved theme from localStorage or default to 'dark'
    const saved = localStorage.getItem('voxly-theme') as Theme;
    return saved || 'dark';
  });

  useEffect(() => {
    // Apply theme to ALL elements
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('voxly-theme', theme);
    
    // Remove all theme classes first
    document.body.classList.remove('theme-light', 'theme-dark', 'theme-vibey');
    document.documentElement.classList.remove('theme-light', 'theme-dark', 'theme-vibey');
    
    // Add current theme class to both html and body
    document.body.classList.add(`theme-${theme}`);
    document.documentElement.classList.add(`theme-${theme}`);
    
    console.log(`🎨 Theme switched to: ${theme}`);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    const themes: Theme[] = ['light', 'dark', 'vibey'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {/* Vibey mode background */}
      {theme === 'vibey' && (
        <>
          <div className="vibey-bg" />
          <div className="particle particle-1" />
          <div className="particle particle-2" />
          <div className="particle particle-3" />
        </>
      )}
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
