import React from 'react';
import { ActivityIndicator, View } from 'react-native';

import { useAppLoadingStore } from '../../stores/useAppLoadingStore';
import { useTheme } from '../../theme/useTheme';
import { AppText } from './AppText';

export function LoadingOverlay() {
  const t = useTheme();
  const visível = useAppLoadingStore((s) => s.visível);
  const mensagem = useAppLoadingStore((s) => s.mensagem);

  if (!visível) return null;

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: t.mode === 'light' ? 'rgba(17,24,39,0.12)' : 'rgba(0,0,0,0.55)',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 998,
      }}
    >
      <View
        style={{
          backgroundColor: t.colors.card,
          borderRadius: t.radii.xl,
          paddingHorizontal: 18,
          paddingVertical: 16,
          borderWidth: 1,
          borderColor: t.colors.border,
          alignItems: 'center',
          gap: 10,
          minWidth: 180,
        }}
      >
        <ActivityIndicator />
        {!!mensagem && (
          <AppText variant="caption" color="muted" style={{ textAlign: 'center' }}>
            {mensagem}
          </AppText>
        )}
      </View>
    </View>
  );
}
