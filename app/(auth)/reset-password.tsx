import React from 'react';
import { View } from 'react-native';
import { Link } from 'expo-router';

import { Card } from '../../src/components/ui/Card';
import { AppText } from '../../src/components/ui/AppText';
import { Button } from '../../src/components/ui/Button';
import { TextField } from '../../src/components/ui/TextField';
import { AuthScaffold } from '../../src/features/auth/components/AuthScaffold';
import { useResetPasswordVM } from '../../src/features/auth/vms/useResetPasswordVM';
import { useTheme } from '../../src/theme/useTheme';

export default function ResetPasswordScreen() {
  const t = useTheme();
  const vm = useResetPasswordVM();

  return (
    <AuthScaffold
      title="Recuperar"
      subtitle="Vamos enviar um link de recuperação para o seu e-mail."
      footer={
        <View style={{ alignItems: 'center', marginTop: 6 }}>
          <AppText variant="caption" color="muted">
            Lembrou a senha?{' '}
            <Link href="/(auth)/sign-in" style={{ color: t.colors.accent, fontWeight: '600' }}>
              Entrar
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
          errorText={vm.error ? 'Informe um e-mail válido.' : undefined}
          leftIcon="mail-outline"
        />

        <Button
          title={vm.loading ? 'Enviando...' : vm.sent ? 'Link enviado ✅' : 'Enviar link'}
          onPress={vm.submit}
          disabled={!vm.canSubmit || vm.sent}
          style={{
            alignSelf: 'stretch',
            justifyContent: 'center',
            paddingVertical: 12,
          }}
        />

        {vm.sent ? (
          <Card padding={14} style={{ backgroundColor: t.colors.accentSoft }}>
            <AppText variant="subtitle">Verifique sua caixa de entrada</AppText>
            <AppText variant="caption" color="muted">
              Se o e-mail existir, você receberá um link em alguns minutos.
            </AppText>
          </Card>
        ) : null}
      </Card>
    </AuthScaffold>
  );
}
