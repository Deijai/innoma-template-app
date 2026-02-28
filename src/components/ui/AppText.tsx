import React from 'react';
import { Text, type TextProps, type TextStyle } from 'react-native';

import { useTheme } from '../../theme/useTheme';

export type TextVariant =
  | 'title'
  | 'subtitle'
  | 'body'
  | 'caption'
  | 'label';

type Props = TextProps & {
  variant?: TextVariant;
  color?: 'text' | 'muted' | 'accent';
  style?: TextStyle | TextStyle[];
};

export function AppText({ variant = 'body', color = 'text', style, ...rest }: Props) {
  const t = useTheme();

  const base: TextStyle = {
    color: color === 'accent' ? t.colors.accent : color === 'muted' ? t.colors.textMuted : t.colors.text,
  };

  const variants: Record<TextVariant, TextStyle> = {
    title: { fontSize: 20, fontWeight: '600' },
    subtitle: { fontSize: 16, fontWeight: '600' },
    body: { fontSize: 14, fontWeight: '400' },
    label: { fontSize: 13, fontWeight: '500' },
    caption: { fontSize: 12, fontWeight: '400' },
  };

  return <Text {...rest} style={[base, variants[variant], style]} />;
}
