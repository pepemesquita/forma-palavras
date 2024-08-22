import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Image, ImageBackground, StatusBar, TouchableOpacity, Text, Modal } from 'react-native';
import SettingsScreen from './settings';
import { Audio } from 'expo-av';

const HomeScreen = () => {
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);

  // Carregar o som apenas uma vez
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

  // Função para alternar o estado de mutar
  const handleToggleMute = async () => {
    if (soundRef.current) {
      const newMutedState = !isMuted;
      await soundRef.current.setIsMutedAsync(newMutedState);
      setIsMuted(newMutedState);
    }
  };

  const handlePress = () => {
    // Navega para a tela fase1
  };

  const handleSettingsPress = () => {
    setIsSettingsVisible(true); // Exibe o modal de configurações
  };

  const handleCloseSettings = () => {
    setIsSettingsVisible(false); // Fecha o modal de configurações
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
        
        <TouchableOpacity style={styles.botaoJogar} onPress={handlePress}>
          <Text style={styles.textoBotao}>JOGAR</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoSettings} onPress={handleSettingsPress}>
          <Text style={styles.textoBotaoSettings}>⚙️</Text>
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
    paddingHorizontal: "7%",
    backgroundColor: "#4EC307",
    borderRadius: 22,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
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
    top: 50,
    right: 20,
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 50,
  },
  textoBotaoSettings: {
    color: "white",
    fontSize: 24,
  },
});

export default HomeScreen;
