import type { ThemeMode } from '../stores/useThemeStore';

export type ThemeTokens = {
  mode: ThemeMode;
  colors: {
    bg: string;
    card: string;
    cardSubtle: string;
    text: string;
    textMuted: string;
    border: string;
    accent: string;
    accentSoft: string;
    tabInactive: string;
    shadow: string;
  };
  radii: { lg: number; xl: number; pill: number };
  spacing: { xs: number; sm: number; md: number; lg: number; xl: number };
  typography: {
    title: { fontSize: number; fontWeight: '600' | '700' };
    subtitle: { fontSize: number; fontWeight: '600' };
    body: { fontSize: number; fontWeight: '400' | '500' };
    caption: { fontSize: number; fontWeight: '400' | '500' };
  };
};

export function getTokens(mode: ThemeMode): ThemeTokens {
  const light: ThemeTokens = {
    mode,
    colors: {
      bg: '#EEF0F4',
      card: '#FFFFFF',
      cardSubtle: '#F5F6F8',
      text: '#111827',
      textMuted: '#6B7280',
      border: '#E5E7EB',
      accent: '#10B981',
      accentSoft: '#D1FAE5',
      tabInactive: '#9CA3AF',
      shadow: 'rgba(0,0,0,0.10)',
    },
    radii: { lg: 16, xl: 20, pill: 999 },
    spacing: { xs: 6, sm: 10, md: 14, lg: 18, xl: 24 },
    typography: {
      title: { fontSize: 20, fontWeight: '600' },
      subtitle: { fontSize: 14, fontWeight: '600' },
      body: { fontSize: 14, fontWeight: '400' },
      caption: { fontSize: 12, fontWeight: '400' },
    },
  };

  const dark: ThemeTokens = {
    ...light,
    mode,
    colors: {
      bg: '#0B0F14',
      card: '#121826',
      cardSubtle: '#0F172A',
      text: '#E5E7EB',
      textMuted: '#9CA3AF',
      border: '#1F2937',
      accent: '#10B981',
      accentSoft: '#022C22',
      tabInactive: '#6B7280',
      shadow: 'rgba(0,0,0,0.50)',
    },
  };

  return mode === 'dark' ? dark : light;
}
