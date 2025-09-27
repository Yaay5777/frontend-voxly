import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Theme } from '../types';

interface ThemeState {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
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
  primary: '#60a5fa',
  secondary: '#a78bfa',
  accent: '#f472b6',
  background: '#0f172a',
  surface: '#1e293b',
  text: '#f1f5f9',
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: lightTheme,
      isDark: false,

      toggleTheme: () => {
        const currentIsDark = get().isDark;
        const newTheme = currentIsDark ? lightTheme : darkTheme;
        
        set({
          theme: newTheme,
          isDark: !currentIsDark,
        });

        // Update document class for Tailwind dark mode
        if (!currentIsDark) {
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
        const { isDark } = get();
        // Apply theme class to document on initialization
        if (isDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },
    }),
    {
      name: 'voxly-theme',
      onRehydrateStorage: () => (state) => {
        // Apply theme on hydration
        if (state?.isDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },
    }
  )
);
