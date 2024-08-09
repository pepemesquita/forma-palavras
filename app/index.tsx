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
    // Navegar para outra tela chamada 'NextScreen'
    navigation.navigate('FaseUm');
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
  }
});

export default HomeScreen;
