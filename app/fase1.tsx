import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, ImageBackground, StatusBar, TouchableOpacity, Image, Modal } from 'react-native';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import { Audio } from 'expo-av';
import SettingsScreen from './settings';
import { useSound } from './SoundContext'; // Importa o useSound

export const config = {
  headerShown: false,
}

const FaseUm = () => {
  const [fontsLoaded] = useFonts({
    'Fonte': require('../assets/fonts/Digitalt.ttf'),
  });

  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const { isMuted, toggleMute } = useSound(); // Usa o contexto do som
  const router = useRouter();
  const soundRef = useRef<Audio.Sound | null>(null); // Define a referência do som

  useEffect(() => {
    const loadSound = async () => {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/sounds/background.mp3'),
        { shouldPlay: !isMuted, isLooping: true }
      );
      soundRef.current = sound;
    };

    loadSound();

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, [isMuted]); // Recarrega o som quando isMuted muda

  const handleHomePress = () => {
    router.push('/'); // Navegar para a tela inicial
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
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.iconButton} onPress={() => {}}>
          <Image source={require('../assets/images/iconex.png')} style={styles.iconImage} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={handleHomePress}>
          <Image source={require('../assets/images/home.png')} style={styles.iconImage} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={() => {}}>
          <Image source={require('../assets/images/restart.png')} style={styles.iconImage} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.botaoSettings} onPress={handleSettingsPress}>
        <Image
          source={require('../assets/images/settings_icon.png')}
          style={styles.botaoSettingsImage} // Certifique-se de que esta propriedade existe em styles
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
          onToggleMute={async () => {
            await toggleMute(); // Garante que a função retorna uma Promise
          }}
          isMuted={isMuted}
        />
      </Modal>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  buttonContainer: {
    position: 'absolute',
    width: 120,
    height: 50,
    left: 26,
    top: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconButton: {
    width: 50, 
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconImage: {
    width: 40, // Ajustado para garantir tamanho uniforme
    height: 40, // Ajustado para garantir tamanho uniforme
    resizeMode: 'contain',
  },
  botaoSettings: {
    position: 'absolute',
    top: 10,
    right: "4%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 50,
    padding: 10, // Adicionando padding para garantir que o ícone tenha espaço suficiente
  },
  botaoSettingsImage: { // Verifique se esta propriedade está presente e corretamente definida
    width: 30, // Ajuste do tamanho do ícone do botão de configurações
    height: 30,
    resizeMode: 'contain',
  },
});

export default FaseUm;
