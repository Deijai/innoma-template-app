import React from 'react';
import { Pressable, View, type PressableProps } from 'react-native';
import { AppText } from './AppText';
import { useTheme } from '../../theme/useTheme';

type Props = PressableProps & {
  title: string;
  variant?: 'primary' | 'ghost';
  leftIcon?: React.ReactNode;
};

export function Button({ title, variant = 'primary', leftIcon, style, ...rest }: Props) {
  const t = useTheme();
  const isPrimary = variant === 'primary';
  return (
    <Pressable
      {...rest}
      style={({ pressed }) => [
        {
          backgroundColor: isPrimary ? t.colors.accent : 'transparent',
          borderRadius: 999,
          paddingHorizontal: 14,
          paddingVertical: 10,
          borderWidth: isPrimary ? 0 : 1,
          borderColor: t.colors.border,
          opacity: pressed ? 0.85 : 1,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          alignSelf: 'flex-start',
        },
        typeof style === 'function' ? style({ pressed, hovered: false, focused: false }) : (style as any),
      ]}
    >
      {leftIcon}
      <AppText variant="label" color={isPrimary ? 'text' : 'text'} style={{ color: isPrimary ? '#fff' : t.colors.text }}>
        {title}
      </AppText>
    </Pressable>
  );
}
