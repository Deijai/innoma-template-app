import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../theme/useTheme';

export function IconCircle({
  name,
  size = 18,
  color,
}: {
  name: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
}) {
  const t = useTheme();
  return (
    <View
      style={{
        width: 34,
        height: 34,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: t.colors.cardSubtle,
      }}
    >
      <Ionicons name={name as any} size={size} color={color || t.colors.accent} />
    </View>
  );
}
