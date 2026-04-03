import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type ThemeMode = 'light' | 'dark' | 'auto';

interface ThemeContextType {
  mode: ThemeMode;
  actualTheme: 'light' | 'dark';
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'silicon-self-theme';

function getTimeBasedTheme(): 'light' | 'dark' {
  const hour = new Date().getHours();
  // 6:00 - 18:00 为白天，使用亮色主题
  return hour >= 6 && hour < 18 ? 'light' : 'dark';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark' || saved === 'auto') {
      return saved;
    }
    return 'auto';
  });

  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>(() => {
    if (mode === 'auto') {
      return getTimeBasedTheme();
    }
    return mode;
  });

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    localStorage.setItem(STORAGE_KEY, newMode);
  };

  // 更新实际主题
  useEffect(() => {
    if (mode === 'auto') {
      setActualTheme(getTimeBasedTheme());

      // 每分钟检查一次时间，自动切换主题
      const interval = setInterval(() => {
        setActualTheme(getTimeBasedTheme());
      }, 60000);

      return () => clearInterval(interval);
    } else {
      setActualTheme(mode);
    }
  }, [mode]);

  // 应用主题到 document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', actualTheme);
  }, [actualTheme]);

  return (
    <ThemeContext.Provider value={{ mode, actualTheme, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
