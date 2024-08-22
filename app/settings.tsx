import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';

const SettingsScreen = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    const loadSound = async () => {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/sounds/background.mp3'), // pegar o caminho do som
        { shouldPlay: true, isLooping: true }       // Configurações do som
      );
      setSound(sound);
    };

    loadSound();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const handleToggleMute = async () => {
    if (sound) {
      await sound.setIsMutedAsync(!isMuted);
      setIsMuted(!isMuted);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.settingsContainer}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="settings-outline" size={32} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={handleToggleMute}>
          <Ionicons name={isMuted ? "volume-mute-outline" : "volume-high-outline"} size={32} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="information-circle-outline" size={32} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsContainer: {
    position: 'absolute',
    width: 49.09,  // Largura exata conforme especificado
    height: 219,   // Altura exata conforme especificado
    left: 1131,    // Posição horizontal exata conforme especificado
    top: 14,       // Posição vertical exata conforme especificado
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButton: {
    marginVertical: 10,
  }
});

export default SettingsScreen;
