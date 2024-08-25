import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Image, ImageBackground, StatusBar, TouchableOpacity, Text, Modal } from 'react-native';
import SettingsScreen from './settings';
import { Audio } from 'expo-av';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router'; // Importar useRouter

const HomeScreen = () => {
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [buttonPressed, setButtonPressed] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);
  const router = useRouter(); // Inicializar o useRouter

  const [fontsLoaded] = useFonts({
    'Fonte': require('../assets/fonts/Digitalt.ttf'),
  });

  useEffect(() => {
    const loadSound = async () => {
      if (!soundRef.current) {
        const { sound } = await Audio.Sound.createAsync(
          require('../assets/sounds/background.mp3'),
          { shouldPlay: true, isLooping: true }
        );
        soundRef.current = sound;
      }
    };

    loadSound();

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
        soundRef.current = null; // Limpar referência após descarregar
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

  const handlePressIn = () => {
    setButtonPressed(true);
  };

  const handlePressOut = () => {
    setButtonPressed(false);
  };

  const handlePress = () => {
    router.push('/fase1'); // Navegar para a rota /fase1
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

        <TouchableOpacity
          style={[styles.botaoJogar, buttonPressed && styles.botaoJogarPressed]}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={handlePress}
        >
          <Text style={styles.textoBotao}>JOGAR</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.botaoSettings} 
          onPress={handleSettingsPress}
        >
          <Image
            source={require('../assets/images/settings_icon.png')}
            style={styles.botaoSettingsIcon}
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
            onToggleMute={handleToggleMute} // Certifique-se de que isso esteja corretamente definido
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
    marginLeft: "2%",
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
  botaoJogarPressed: {
    backgroundColor: "#3a9c03", // Cor quando pressionado
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
    padding: 10, // Adicionar padding para o ícone
  },
  botaoSettingsIcon: {
    width: 30, // Ajuste do tamanho do ícone do botão de configurações
    height: 30,
    resizeMode: 'contain',
  },
});

export default HomeScreen;
