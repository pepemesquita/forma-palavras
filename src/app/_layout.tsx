import React from 'react';
import {Stack} from 'expo-router';
import {SoundProvider} from '../contexts/SoundContext';

export default function RootLayout() {
    return (
        <SoundProvider>
            <Stack>
                <Stack.Screen
                    name="index"
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="HomeScreen"
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="SettingsScreen"
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="GameScreen"
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="FinalScreen"
                    options={{headerShown: false}}
                />
            </Stack>
        </SoundProvider>
    );
}
