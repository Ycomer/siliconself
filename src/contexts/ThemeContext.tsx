import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface ThemeContextType {
  actualTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function getTimeBasedTheme(): 'light' | 'dark' {
  const hour = new Date().getHours();
  // 6:00 - 18:00 为白天，使用亮色主题
  return hour >= 6 && hour < 18 ? 'light' : 'dark';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>(getTimeBasedTheme);

  // 自动根据时间切换主题
  useEffect(() => {
    setActualTheme(getTimeBasedTheme());

    // 每分钟检查一次时间，自动切换主题
    const interval = setInterval(() => {
      setActualTheme(getTimeBasedTheme());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // 应用主题到 document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', actualTheme);
  }, [actualTheme]);

  return (
    <ThemeContext.Provider value={{ actualTheme }}>
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
