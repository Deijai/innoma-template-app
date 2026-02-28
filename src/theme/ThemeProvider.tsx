import React, { createContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';

import { useThemeStore } from '../stores/useThemeStore';
import { getTokens, type ThemeTokens } from './tokens';

const ThemeContext = createContext<ThemeTokens | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const system = useColorScheme();
  const storedMode = useThemeStore((s) => s.mode);
  // Se a pessoa nunca mexer, o default já é 'light'.
  // Você pode trocar para seguir o sistema aqui, se preferir.
  const mode = storedMode ?? (system === 'dark' ? 'dark' : 'light');
  const value = useMemo(() => getTokens(mode), [mode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export { ThemeContext };
