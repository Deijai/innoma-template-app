import { Redirect } from 'expo-router';
import React from 'react';
import { useAuthStore } from '../src/stores/useAuthStore';

export default function Index() {
  const isSignedIn = useAuthStore((s) => s.isSignedIn);
  console.log('isSignedIn:', isSignedIn);

  return <Redirect href={isSignedIn ? '/(tabs)/report' : '/(auth)/sign-in'} />;
}
