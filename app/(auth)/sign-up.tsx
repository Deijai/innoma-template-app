import { Link } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import { AppText } from '../../src/components/ui/AppText';
import { Button } from '../../src/components/ui/Button';
import { Card } from '../../src/components/ui/Card';
import { SelectField } from '../../src/components/ui/SelectField';
import { PasswordField, TextField } from '../../src/components/ui/TextField';
import { AuthScaffold } from '../../src/features/auth/components/AuthScaffold';
import { useSignUpVM } from '../../src/features/auth/vms/useSignUpVM';
import { useTheme } from '../../src/theme/useTheme';

export default function SignUpScreen() {
  const t = useTheme();
  const vm = useSignUpVM();

  return (
    <AuthScaffold
      title="Criar conta"
      subtitle="Crie sua conta para acompanhar suas metas."
      footer={
        <View style={{ alignItems: 'center', gap: 10 }}>
          <AppText variant="caption" color="muted">
            Já tem conta?{' '}
            <Link href="/(auth)/sign-in" style={{ color: t.colors.accent, fontWeight: '600' }}>
              Entrar
            </Link>
          </AppText>
        </View>
      }
    >
      <Card padding={16} style={{ gap: 14 }}>
        <TextField
          label="Nome"
          placeholder="Seu nome"
          value={vm.name}
          onChangeText={vm.setName}
          errorText={vm.errors.name ? 'Informe seu nome.' : undefined}
          leftIcon="person-outline"
        />

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
          placeholder="Crie uma senha"
          value={vm.password}
          onChangeText={vm.setPassword}
          errorText={vm.errors.password ? 'A senha precisa ter pelo menos 6 caracteres.' : undefined}
          leftIcon="lock-closed-outline"
        />

        <PasswordField
          label="Confirmar senha"
          placeholder="Repita sua senha"
          value={vm.confirmPassword}
          onChangeText={vm.setConfirmPassword}
          errorText={vm.errors.confirm ? 'As senhas não conferem.' : undefined}
          leftIcon="lock-closed-outline"
        />

        <SelectField
          label="Perfil"
          placeholder="Selecione o perfil"
          valor={vm.role}
          opcoes={vm.roleOptions.map((option) => ({
            value: option,
            label: option === 'admin' ? 'Administrador' : 'Produtor',
          }))}
          onChange={vm.setRole}
          pesquisavel={false}
          errorText={vm.errors.role ? 'Selecione um perfil de acesso.' : undefined}
          helperText="Esse perfil define as permissões dentro do app."
        />

        <Button
          title={vm.loading ? 'Criando...' : 'Criar conta'}
          onPress={async () => {
            await vm.submit();
          }}
          style={{
            alignSelf: 'stretch',
            justifyContent: 'center',
            paddingVertical: 12,
          }}
        />

        <AppText variant="caption" color="muted" style={{ textAlign: 'center' }}>
          Ao continuar, você concorda com nossos Termos e Política de Privacidade.
        </AppText>
      </Card>
    </AuthScaffold>
  );
}
