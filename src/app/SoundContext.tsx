// SoundContext.tsx
import React, {createContext, useContext, useState, useEffect, ReactNode} from 'react';
import {Audio} from 'expo-av';

interface SoundContextType {
    isMuted: boolean;
    toggleMute: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [isMuted, setIsMuted] = useState(false);
    const soundRef = React.useRef<Audio.Sound | null>(null);

    useEffect(() => {
        const loadSound = async () => {
            const {sound} = await Audio.Sound.createAsync(
                require('@/src/assets/sounds/background.mp3'),
                {shouldPlay: true, isLooping: true}
            );
            soundRef.current = sound;
        };

        loadSound();

        return () => {
            if (soundRef.current) {
                soundRef.current.unloadAsync();
            }
        };
    }, []);

    const toggleMute = async () => {
        if (soundRef.current) {
            const newMutedState = !isMuted;
            await soundRef.current.setIsMutedAsync(newMutedState);
            setIsMuted(newMutedState);
        }
    };

    return (
        <SoundContext.Provider value={{isMuted, toggleMute}}>
            {children}
        </SoundContext.Provider>
    );
};

export const useSound = (): SoundContextType => {
    const context = useContext(SoundContext);
    if (!context) {
        throw new Error('useSound must be used within a SoundProvider');
    }
    return context;
};
