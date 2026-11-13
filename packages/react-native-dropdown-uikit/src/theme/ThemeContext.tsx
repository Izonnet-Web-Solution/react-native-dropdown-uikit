import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { ThemeTokens, ThemeMode, CustomTheme } from '../types/theme';
import { lightTokens, darkTokens } from './tokens';
import { mergeTheme } from './mergeTheme';

interface ThemeContextValue {
  theme: ThemeTokens;
  isDark: boolean;
  mode: ThemeMode;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export interface ThemeProviderProps {
  children: ReactNode;
  mode?: ThemeMode;
  theme?: CustomTheme;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  mode = 'auto',
  theme: customTheme,
}) => {
  const systemColorScheme = useColorScheme();
  const isDark = mode === 'auto' ? systemColorScheme === 'dark' : mode === 'dark';

  const theme = useMemo(() => {
    const base = isDark ? darkTokens : lightTokens;
    return mergeTheme(base, customTheme);
  }, [isDark, customTheme]);

  const value = useMemo(
    () => ({
      theme,
      isDark,
      mode,
    }),
    [theme, isDark, mode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (overrideMode?: ThemeMode, overrideTheme?: CustomTheme): ThemeContextValue => {
  const context = useContext(ThemeContext);
  const systemColorScheme = useColorScheme();

  const effectiveMode = overrideMode || (context ? context.mode : 'auto');
  const isDark = effectiveMode === 'auto' ? systemColorScheme === 'dark' : effectiveMode === 'dark';

  return useMemo(() => {
    const base = isDark ? darkTokens : lightTokens;
    const merged = mergeTheme(base, { ...context?.theme, ...overrideTheme });
    return {
      theme: merged,
      isDark,
      mode: effectiveMode,
    };
  }, [effectiveMode, isDark, context?.theme, overrideTheme]);
};

