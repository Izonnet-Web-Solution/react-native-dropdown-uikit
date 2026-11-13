export interface ThemeTokens {
  primary: string;
  primaryLight: string;
  background: string;
  surface: string;
  card: string;
  text: string;
  textSecondary: string;
  textPlaceholder: string;
  border: string;
  borderFocus: string;
  error: string;
  errorLight: string;
  success: string;
  backdrop: string;
  divider: string;
  chipBackground: string;
  chipText: string;
  fontSizeSm: number;
  fontSizeMd: number;
  fontSizeLg: number;
  borderRadiusSm: number;
  borderRadiusMd: number;
  borderRadiusLg: number;
  itemHeight: number;
}

export type ThemeMode = 'auto' | 'light' | 'dark';

export type CustomTheme = Partial<ThemeTokens>;

