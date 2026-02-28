import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

import { LoadingOverlay } from '../src/components/ui/LoadingOverlay';
import { ToastHost } from '../src/components/ui/ToastHost';
import { ThemeProvider } from '../src/theme/ThemeProvider';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>

      {/* Globais (funcionam em todo o app) */}
      <LoadingOverlay />
      <ToastHost />
    </ThemeProvider>
  );
}
