import { create } from 'zustand';

type Theme = 'light' | 'dark';

type UiState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.classList.toggle('dark', theme === 'dark');
  localStorage.setItem('xsporty-theme', theme);
}

const storedTheme = localStorage.getItem('xsporty-theme') === 'dark' ? 'dark' : 'light';
applyTheme(storedTheme);

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
