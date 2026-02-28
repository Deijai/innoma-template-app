import { Stack } from 'expo-router'
import React from 'react'

export default function FarmsLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false, presentation: 'modal' }} />
        </Stack>
    )
}
