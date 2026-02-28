import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { Pressable, View } from 'react-native';

import { useToastStore } from '../../stores/useToastStore';
import { useTheme } from '../../theme/useTheme';
import { AppText } from './AppText';

export function ToastHost() {
  const t = useTheme();
  const { visible, message, type, hide } = useToastStore();

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        hide();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, hide]);

  if (!visible) return null;

  const isError = type === 'error';
  const isSuccess = type === 'success';
  const icon = isError ? 'alert-circle' : isSuccess ? 'checkmark-circle' : 'information-circle';
  const bg = isError ? '#ea4848' : isSuccess ? '#15ad84' : t.colors.card;
  const border = isError ? '#c95353' : isSuccess ? '#358971' : t.colors.border;
  const fg = isError || isSuccess ? '#fff' : t.colors.text;

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        left: 16,
        right: 16,
        bottom: 94,
        zIndex: 999,
      }}
    >
      <Pressable
        onPress={hide}
        style={{
          backgroundColor: bg,
          borderColor: border,
          borderWidth: 1,
          borderRadius: t.radii.xl,
          padding: 12,
          shadowColor: t.colors.shadow,
          shadowOpacity: 0.25,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 8 },
          elevation: 6,
          flexDirection: 'row',
          gap: 10,
          alignItems: 'center',
        }}
      >
        <Ionicons name={icon as any} size={18} color={fg} />
        <View style={{ flex: 1 }}>
          <AppText variant="caption" style={{ color: fg, opacity: 0.95 }}>
            {message}
          </AppText>
        </View>
        <Ionicons name="close" size={16} color={fg} />
      </Pressable>
    </View>
  );
}
