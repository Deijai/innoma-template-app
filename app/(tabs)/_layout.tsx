import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

import { useTheme } from '../../src/theme/useTheme';

export default function TabsLayout() {
  const t = useTheme();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: t.colors.accent,
        tabBarInactiveTintColor: t.colors.tabInactive,
        tabBarStyle: {
          backgroundColor: t.colors.card,
          borderTopColor: t.colors.border,
          height: 86,
          paddingBottom: 18,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarIcon: ({ color, focused, size }) => {
          const s = size ?? 24;

          const name =
            route.name === 'home'
              ? focused
                ? 'home'
                : 'home-outline'
              : route.name === 'discover'
                ? focused
                  ? 'compass'
                  : 'compass-outline'
                : route.name === 'report'
                  ? focused
                    ? 'bar-chart'
                    : 'bar-chart-outline'
                  : route.name === 'components'
                    ? focused
                      ? 'grid'
                      : 'grid-outline'
                    : focused
                      ? 'settings'
                      : 'settings-outline';

          return <Ionicons name={name as any} size={s} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="home" options={{ title: 'Início' }} />
      <Tabs.Screen name="discover" options={{ title: 'Descobrir' }} />
      <Tabs.Screen name="report" options={{ title: 'Relatório' }} />
      <Tabs.Screen name="components" options={{ title: 'Componentes' }} />
      <Tabs.Screen name="profile" options={{ title: 'Perfil' }} />
      <Tabs.Screen name="(farms)" options={{ title: 'Fazendas', href: null }} />
    </Tabs>
  );
}
