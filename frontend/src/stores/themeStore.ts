import { create } from 'zustand';

type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: (localStorage.getItem('vas-theme') as Theme) || 'dark',
  setTheme: (theme) => {
    localStorage.setItem('vas-theme', theme);
    set({ theme });
    applyTheme(theme);
  },
}));

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  if (theme === 'system') {
    const sys = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    root.classList.add(sys);
  } else {
    root.classList.add(theme);
  }
}

// Initialize on load
applyTheme((localStorage.getItem('vas-theme') as Theme) || 'dark');
