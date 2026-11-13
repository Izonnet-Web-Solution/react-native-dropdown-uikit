import { ThemeTokens, CustomTheme } from '../types/theme';

export function mergeTheme(base: ThemeTokens, custom?: CustomTheme): ThemeTokens {
  if (!custom) {
    return base;
  }
  return {
    ...base,
    ...custom,
  };
}

