import React from 'react';
import { StyleSheet, View, ImageBackground, StatusBar, TouchableOpacity, Image, Text } from 'react-native';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';

export const config = {
  headerShown: false,
}

const FaseUm = () => {
  const [fontsLoaded] = useFonts({
    'Fonte': require('../assets/fonts/Digitalt.ttf'),
  });

  const router = useRouter();

  const handleHomePress = () => {
    router.push('/'); // Navegar para a tela inicial
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
    width: '100%', 
    height: '100%',
    resizeMode: 'contain',
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
});

export default FaseUm;
