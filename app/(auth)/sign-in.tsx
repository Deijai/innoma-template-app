import { Link, useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import { useSignInVM } from '@/src/features/auth/vms/useSignInVM';
import { AppText } from '../../src/components/ui/AppText';
import { Button } from '../../src/components/ui/Button';
import { Card } from '../../src/components/ui/Card';
import { PasswordField, TextField } from '../../src/components/ui/TextField';
import { AuthScaffold } from '../../src/features/auth/components/AuthScaffold';
import { useTheme } from '../../src/theme/useTheme';

export default function SignInScreen() {
  const t = useTheme();
  const router = useRouter();
  const vm = useSignInVM();

  return (
    <AuthScaffold
      title="Entrar"
      subtitle="Bem-vindo de volta. Vamos manter o ritmo."
      showBack={false}
      footer={
        <View style={{ alignItems: 'center', gap: 10 }}>
          <AppText variant="caption" color="muted">
            Não tem conta?{' '}
            <Link href="/(auth)/sign-up" style={{ color: t.colors.accent, fontWeight: '600' }}>
              Criar conta
            </Link>
          </AppText>
        </View>
      }
    >
      <Card padding={16} style={{ gap: 14 }}>
        <TextField
          label="E-mail"
          placeholder="voce@email.com"
          autoCapitalize="none"
          keyboardType="email-address"
          value={vm.email}
          onChangeText={vm.setEmail}
          errorText={vm.errors.email ? 'Informe um e-mail válido.' : undefined}
          leftIcon="mail-outline"
        />

        <PasswordField
          label="Senha"
          placeholder="••••••••"
          value={vm.password}
          onChangeText={vm.setPassword}
          errorText={vm.errors.password ? 'A senha precisa ter pelo menos 6 caracteres.' : undefined}
          leftIcon="lock-closed-outline"
        />

        <View style={{ alignItems: 'flex-end' }}>
          <Link href="/(auth)/reset-password" style={{ color: t.colors.accent, fontWeight: '600' }}>
            Esqueci minha senha
          </Link>
        </View>

        <Button
          title={vm.loading ? 'Entrando...' : 'Entrar'}
          onPress={async () => {
            await vm.submit();
          }}
          style={{
            alignSelf: 'stretch',
            justifyContent: 'center',
            paddingVertical: 12,
          }}
        />
      </Card>

      <Card padding={14} style={{ gap: 8, backgroundColor: t.colors.accentSoft }}>
        <AppText variant="subtitle">Observação</AppText>
        <AppText variant="caption" color="muted">
          Este é um fluxo de template. Depois vamos trocar o login mockado por Firebase Auth.
        </AppText>
      </Card>
    </AuthScaffold>
  );
}
