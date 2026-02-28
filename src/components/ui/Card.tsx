import React from 'react';
import { View, type ViewProps } from 'react-native';
import { useTheme } from '../../theme/useTheme';

type Props = ViewProps & {
  padding?: number;
};

export function Card({ style, padding = 16, ...rest }: Props) {
  const t = useTheme();
  return (
    <View
      {...rest}
      style={[
        {
          backgroundColor: t.colors.card,
          borderRadius: t.radii.xl,
          padding,
          shadowColor: t.colors.shadow,
          shadowOpacity: t.mode === 'light' ? 0.10 : 0.25,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 8 },
          elevation: 4,
          marginHorizontal: 5,
        },
        style,
      ]}
    />
  );
}
