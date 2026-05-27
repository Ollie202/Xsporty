import { create } from 'zustand';

type Theme = 'light' | 'dark';

type UiState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

function applyTheme(theme: Theme, animate = true) {
  const root = document.documentElement;
  if (animate) {
    root.classList.add('theme-switching');
    window.setTimeout(() => root.classList.remove('theme-switching'), 520);
  }
  root.dataset.theme = theme;
  root.classList.toggle('dark', theme === 'dark');
  localStorage.setItem('xsporty-theme', theme);
}

const storedTheme = localStorage.getItem('xsporty-theme') === 'dark' ? 'dark' : 'light';
applyTheme(storedTheme, false);

export const useUiStore = create<UiState>(set => ({
  theme: storedTheme,
  setTheme: theme => {
    applyTheme(theme);
    set({ theme });
  },
  toggleTheme: () =>
    set(state => {
      const theme = state.theme === 'dark' ? 'light' : 'dark';
      applyTheme(theme);
      return { theme };
    }),
}));
