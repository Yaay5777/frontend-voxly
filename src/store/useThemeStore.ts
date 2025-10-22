import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Theme } from '../types';

type ThemeMode = 'light' | 'dark' | 'vibes';

interface ThemeState {
  theme: Theme;
  mode: ThemeMode;
  isDark: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  setTheme: (theme: Partial<Theme>) => void;
  initializeTheme: () => void;
}

const lightTheme: Theme = {
  mode: 'light',
  primary: '#3b82f6',
  secondary: '#8b5cf6',
  accent: '#d946ef',
  background: '#ffffff',
  surface: '#f8fafc',
  text: '#1f2937',
};

const darkTheme: Theme = {
  mode: 'dark',
  primary: '#a78bfa',
  secondary: '#c084fc',
  accent: '#e879f9',
  background: '#581c87',
  surface: '#6b21a8',
  text: '#faf5ff',
};

const vibesTheme: Theme = {
  mode: 'vibes',
  primary: '#ec4899',
  secondary: '#a78bfa',
  accent: '#06b6d4',
  background: '#0a0a0a',
  surface: '#1a1a1a',
  text: '#ffffff',
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: lightTheme,
      mode: 'light',
      isDark: false,

      setThemeMode: (mode: ThemeMode) => {
        let newTheme: Theme;
        
        switch(mode) {
          case 'light':
            newTheme = lightTheme;
            break;
          case 'dark':
            newTheme = darkTheme;
            break;
          case 'vibes':
            newTheme = vibesTheme;
            break;
        }
        
        set({
          theme: newTheme,
          mode,
          isDark: mode === 'dark' || mode === 'vibes',
        });

        // Update document classes
        document.documentElement.classList.remove('light', 'dark', 'vibes');
        document.documentElement.classList.add(mode);
        
        if (mode === 'dark' || mode === 'vibes') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },

      setTheme: (themeData: Partial<Theme>) => {
        const currentTheme = get().theme;
        set({
          theme: { ...currentTheme, ...themeData },
        });
      },

      initializeTheme: () => {
        const { mode } = get();
        // Apply theme class to document on initialization
        document.documentElement.classList.add(mode);
        if (mode === 'dark' || mode === 'vibes') {
          document.documentElement.classList.add('dark');
        }
      },
    }),
    {
      name: 'voxly-theme',
      onRehydrateStorage: () => (state) => {
        // Apply theme on hydration
        if (state?.mode) {
          document.documentElement.classList.add(state.mode);
          if (state.mode === 'dark' || state.mode === 'vibes') {
            document.documentElement.classList.add('dark');
          }
        }
      },
    }
  )
);
