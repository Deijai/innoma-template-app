import { Stack } from 'expo-router';
import React from 'react';

export default function FarmsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false, presentation: 'modal' }} />
      <Stack.Screen name="filters" options={{ headerShown: false, presentation: 'modal' }} />
      <Stack.Screen name="form" options={{ headerShown: false, presentation: 'modal' }} />
      <Stack.Screen name="[id]" options={{ headerShown: false, presentation: 'modal' }} />
    </Stack>
  );
}
