import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, View } from 'react-native';

import { useTheme } from '../../theme/useTheme';
import { AppText } from './AppText';

type Props = {
  titulo: string;
  descricao?: string | undefined | null;
  icone?: keyof typeof Ionicons.glyphMap;
  direita?: React.ReactNode;
  onPress?: () => void;
};

export function ListItem({ titulo, descricao, icone, direita, onPress }: Props) {
  const t = useTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => ({
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          paddingVertical: 12,
        }}
      >
        {!!icone && (
          <View
            style={{
              height: 36,
              width: 36,
              borderRadius: 18,
              backgroundColor: t.colors.cardSubtle,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: t.colors.border,
            }}
          >
            <Ionicons name={icone as any} size={18} color={t.colors.textMuted} />
          </View>
        )}

        <View style={{ flex: 1, gap: 2 }}>
          <AppText variant="subtitle">{titulo}</AppText>
          {!!descricao && (
            <AppText variant="caption" color="muted">
              {descricao}
            </AppText>
          )}
        </View>

        {direita ? (
          direita
        ) : onPress ? (
          <Ionicons name="chevron-forward" size={18} color={t.colors.textMuted} />
        ) : null}
      </View>
    </Pressable>
  );
}
