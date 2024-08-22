import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, View, Image, ImageBackground, StatusBar, TouchableOpacity, Text, Modal } from 'react-native';
import SettingsScreen from './settings';
import { Audio } from 'expo-av';
import { useFonts } from 'expo-font';
import { Link } from 'expo-router'; // Import Expo Router

const HomeScreen = () => {
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);

  const [fontsLoaded] = useFonts({
    'Fonte': require('../assets/fonts/Digitalt.ttf'), 
  });

  useEffect(() => {
    const loadSound = async () => {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/sounds/background.mp3'),
        { shouldPlay: true, isLooping: true }
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

  const handleToggleMute = async () => {
    if (soundRef.current) {
      const newMutedState = !isMuted;
      await soundRef.current.setIsMutedAsync(newMutedState);
      setIsMuted(newMutedState);
    }
  };

  const handleSettingsPress = () => {
    setIsSettingsVisible(true);
  };

  const handleCloseSettings = () => {
    setIsSettingsVisible(false);
  };

  return (
    <ImageBackground
      source={require("../assets/images/bg.png")}
      style={styles.background}
    >
      <StatusBar hidden={true} />
      <View style={styles.container}>
        <Image
          source={require('../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Usando Link para navegar */}
        <Link href="/fase1" style={styles.botaoJogar}>
          <Text style={styles.textoBotao}>JOGAR</Text>
        </Link>

        <TouchableOpacity style={styles.botaoSettings} onPress={handleSettingsPress}>
          <Image
            source={require('../assets/images/settings_icon.png')}
            style={styles.botaoSettings}
            
            resizeMode="contain"
          />
        </TouchableOpacity>
        
        <Modal
          visible={isSettingsVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={handleCloseSettings}
        >
          <SettingsScreen 
            onClose={handleCloseSettings} 
            onToggleMute={handleToggleMute}
            isMuted={isMuted}
          />
        </Modal>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: "55%",
    height: "50%",
    marginTop: "2%",
  },
  botaoJogar: {
    marginTop: "6%",
    marginBottom: "5%",
    paddingVertical: "3%",
    paddingHorizontal: "6%",
    backgroundColor: "#4EC307",
    borderRadius: 22,
    borderColor: "white",
    justifyContent: "center",
    borderWidth: 3,
  },
  textoBotao: {
    color: "white",
    fontSize: 33,
    fontFamily: "Fonte",
    justifyContent: "center",
  },
  botaoSettings: {
    position: 'absolute',
    top: 10,
    right: "4%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 50,
  },
});

export default HomeScreen;
