import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { COLORS, DARK_COLORS } from '@constants/theme';

type ThemeValue = {
  isDark: boolean;
  colors: typeof COLORS;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const toggleTheme = useCallback(() => setIsDark(v => !v), []);

  const value = useMemo(
    () => ({ isDark, colors: isDark ? DARK_COLORS : COLORS, toggleTheme }),
    [isDark, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme() phải được gọi bên trong <ThemeProvider>');
  }
  return ctx;
}
