import React from 'react';
import {Stack} from 'expo-router';
import {SoundProvider} from './SoundContext'; // Ajuste o caminho conforme necessário

export default function RootLayout() {
    return (
        <SoundProvider>
            <Stack>
                <Stack.Screen
                    name="index"
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="settings"
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="fase1"
                    options={{headerShown: false}}
                />
            </Stack>
        </SoundProvider>
    );
}
