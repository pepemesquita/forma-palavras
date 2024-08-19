import React from 'react';
import { StyleSheet, View, Image, ImageBackground, StatusBar, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { useFonts } from 'expo-font';

const HomeScreen = () => {

  let [fontsLoaded] = useFonts({
    'Fonte': require('../assets/fonts/Digitalt.ttf'), // Caminho para o arquivo da fonte
  });

  const navigation = useNavigation();

  const handlePress = () => {
    // Navegar para outra tela chamada 'FaseUm'
    navigation.navigate('FaseUm');
  };

  // Função para lidar com o botão de "Settings"
  const handleSettingsPress = () => {
    navigation.navigate('Settings'); // Navega para a tela de Configurações (que ainda será criada)
  };
  
  useFocusEffect(
    React.useCallback(() => {
      navigation.setOptions({ headerShown: false });
    }, [navigation])
  );

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
          <Text style={styles.textoBotao}>
            JOGAR
          </Text>
        </TouchableOpacity>

        {/* Botão de Settings */}
        <TouchableOpacity style={styles.botaoSettings} onPress={handleSettingsPress}>
          <Text style={styles.textoBotaoSettings}>⚙️</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover", // Ou 'stretch', dependendo do efeito desejado
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: "55%",
    height: "50%",
    marginTop: "2%"
  },
  botaoJogar: {
    marginTop: "6%",
    marginBottom:"5%",
    paddingVertical: "3%",
    paddingHorizontal: "7%",
    backgroundColor: "#4EC307",
    borderRadius: 22,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3
  },
  textoBotao: {
    color: "white",
    fontSize: 33,
    fontFamily: "Fonte",
    justifyContent: "center"
  },
  botaoSettings: {
    position: 'absolute',
    top: 50, // Ajuste a posição conforme necessário
    right: 20, // Ajuste a posição conforme necessário
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
