import { CardAction } from '@/src/components/ui/CardAction';
import { IconCircle } from '@/src/components/ui/IconCircle';
import { useTheme } from '@/src/theme/useTheme';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { Screen } from '../../src/components/layout/Screen';
import { AppText } from '../../src/components/ui/AppText';

export default function HomeScreen() {
  const t = useTheme();
  const router = useRouter();
  return (
    <Screen>
      <View>
        <AppText variant="title">Ações</AppText>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 12, paddingHorizontal: 12, borderRadius: 8 }}>
          <CardAction style={{ width: 120, height: 120, gap: 12 }} onPress={() => router.push('/(farms)')}>
            <IconCircle name="fish-outline" color={t.colors.accent} />
            <AppText variant="body">Fazendas</AppText>
          </CardAction>

          <CardAction style={{ width: 120, height: 120, gap: 12 }} onPress={() => { }}>
            <IconCircle name="leaf-outline" color={t.colors.accent} />
            <AppText variant="body">Lotes</AppText>
          </CardAction>

          <CardAction style={{ width: 120, height: 120, gap: 12 }} onPress={() => { }}>
            <IconCircle name="calendar-outline" color={t.colors.accent} />
            <AppText variant="body">Eventos</AppText>
          </CardAction>
        </ScrollView>
      </View>
    </Screen>
  );
}
