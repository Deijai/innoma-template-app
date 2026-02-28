import { useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import { Screen } from '../../src/components/layout/Screen';
import { AppText } from '../../src/components/ui/AppText';
import { Button } from '../../src/components/ui/Button';
import { Card } from '../../src/components/ui/Card';
import { ListItem } from '../../src/components/ui/ListItem';
import { useToast } from '../../src/hooks/useToast';
import { useAuthStore } from '../../src/stores/useAuthStore';
import { useThemeStore } from '../../src/stores/useThemeStore';

export default function ProfileScreen() {
  const router = useRouter();
  const toast = useToast();

  const modo = useThemeStore((s) => s.mode);
  const setModo = useThemeStore((s) => s.setMode);
  const alternarTema = () => setModo(modo === 'dark' ? 'light' : 'dark');

  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);

  return (
    <Screen scroll contentContainerStyle={{ gap: 14 }}>
      <AppText variant="title">Configurações</AppText>

      <Card padding={16} style={{ gap: 2 }}>
        <ListItem
          titulo="Tema"
          descricao={modo === 'dark' ? 'Escuro' : 'Claro'}
          icone="moon-outline"
          onPress={alternarTema}
        />
        <View style={{ height: 1, backgroundColor: '#0000', marginVertical: 2 }} />
        <ListItem
          titulo="Notificações"
          descricao="Em breve"
          icone="notifications-outline"
          onPress={() => toast.info('Configurações de notificações ainda não implementadas.')}
        />
      </Card>

      <Card padding={16} style={{ gap: 2 }}>
        <ListItem
          titulo="Conta"
          descricao={user ? user.email : 'Não autenticado'}
          icone="person-outline"
          onPress={() => toast.info('Área de conta (template).')}
        />
        <View style={{ marginTop: 10, flexDirection: 'row', gap: 10 }}>
          {user ? (
            <Button
              title="Sair"
              variant="ghost"
              onPress={() => {
                signOut();
                toast.sucesso('Você saiu da sua conta.');
                router.replace('/(auth)/sign-in');
              }}
            />
          ) : (
            <Button title="Entrar" onPress={() => router.push('/(auth)/sign-in')} />
          )}
        </View>
      </Card>
    </Screen>
  );
}
