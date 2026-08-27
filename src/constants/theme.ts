import { TextStyle } from 'react-native';

export const COLORS = {
  primary: '#0F766E',
  secondary: '#F59E0B',
  background: '#F0FDFA',
  surface: '#FFFFFF',
  text: '#134E4A',
  textLight: '#5F7A77',
  border: '#CCFBF1',
  error: '#DC2626',
  success: '#16A34A',
};

// Dark Mode: nền #042F2E, card #0B4F4A, chữ #F0FDFA — KHÔNG đổi primary
export const DARK_COLORS: typeof COLORS = {
  ...COLORS,
  background: '#042F2E',
  surface: '#0B4F4A',
  text: '#F0FDFA',
  textLight: '#A7CFCA',
  border: '#115E59',
};

export const SIZES = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  radius: 12,
  radiusPill: 999,
};

export const FONTS = {
  h1: { fontSize: 26, fontWeight: '800' as const },
  h2: { fontSize: 18, fontWeight: '700' as const },
  body: { fontSize: 14, fontWeight: '400' as const },
  caption: { fontSize: 12, fontWeight: '400' as const },
  price: { fontSize: 16, fontWeight: '700' as const },
} satisfies Record<string, TextStyle>;
