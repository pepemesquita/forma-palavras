import React from 'react';
import { StyleSheet, View, ImageBackground, StatusBar } from 'react-native';
import { useFonts } from 'expo-font';

export const config = {
  headerShown: false,
}

const FaseUm = () => {

  const [fontsLoaded] = useFonts({
    'Fonte': require('../assets/fonts/Digitalt.ttf'),
  });

  return (
    <ImageBackground
      source={require("../assets/images/bg.png")}
      style={styles.background}
    >
      <StatusBar hidden={true} />
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
});

export default FaseUm;
