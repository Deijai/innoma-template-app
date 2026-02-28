import React from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { useRouter } from 'expo-router';

import { Screen } from '../../../components/layout/Screen';
import { IconButton } from '../../../components/ui/IconButton';
import { AppText } from '../../../components/ui/AppText';
import { useTheme } from '../../../theme/useTheme';

type Props = {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function AuthScaffold({ title, subtitle, showBack = true, children, footer }: Props) {
  const t = useTheme();
  const router = useRouter();

  return (
    <Screen scroll contentContainerStyle={{ gap: 16, paddingTop: 10 }}>
      <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', android: undefined })} style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          {showBack ? (
            <IconButton icon="chevron-back" onPress={() => router.back()} />
          ) : (
            <View style={{ width: 40, height: 40 }} />
          )}

          <AppText variant="title" style={{ color: t.colors.text }}>
            {title}
          </AppText>

          <View style={{ width: 40, height: 40 }} />
        </View>

        {!!subtitle && (
          <AppText variant="body" color="muted" style={{ textAlign: 'center', marginTop: -6 }}>
            {subtitle}
          </AppText>
        )}

        <View style={{ gap: 14, marginTop: 6 }}>{children}</View>

        {!!footer && <View style={{ marginTop: 10 }}>{footer}</View>}
      </KeyboardAvoidingView>
    </Screen>
  );
}
