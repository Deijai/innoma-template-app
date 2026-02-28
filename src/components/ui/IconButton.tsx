import React from 'react';
import { Pressable, View, type PressableProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/useTheme';

type Props = PressableProps & {
  icon: keyof typeof Ionicons.glyphMap;
  size?: number;
  background?: 'soft' | 'none';
};

export function IconButton({ icon, size = 20, background = 'soft', style, ...rest }: Props) {
  const t = useTheme();
  const bg = background === 'soft' ? t.colors.card : 'transparent';

  return (
    <Pressable {...rest} style={({ pressed }) => [
      {
        opacity: pressed ? 0.75 : 1,
        transform: [{ scale: pressed ? 0.98 : 1 }],
      },
      style as any,
    ]}>
      <View
        style={{
          height: 40,
          width: 40,
          borderRadius: 20,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: bg,
        }}
      >
        <Ionicons name={icon} size={size} color={t.colors.textMuted} />
      </View>
    </Pressable>
  );
}
