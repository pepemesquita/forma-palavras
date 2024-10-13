import React, {useState, useRef, useEffect} from "react";
import {
    StyleSheet,
    View,
    Image,
    ImageBackground,
    StatusBar,
    TouchableOpacity,
    Text,
    Modal,
} from "react-native";
import SettingsScreen from "./SettingsScreen";
import {Audio} from "expo-av";
import {useFonts} from "expo-font";
import {useRouter} from "expo-router";

const HomeScreen = () => {
    const [isSettingsVisible, setIsSettingsVisible] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [buttonPressed, setButtonPressed] = useState(false);
    const soundRef = useRef<Audio.Sound | null>(null);
    const router = useRouter();

    const [fontsLoaded] = useFonts({
        Fonte: require("@/src/assets/fonts/Digitalt.ttf"),
    });

    useEffect(() => {
        const loadSound = async () => {
            if (!soundRef.current) {
                const {sound} = await Audio.Sound.createAsync(
                    require("@/src/assets/sounds/background.mp3"),
                    {shouldPlay: true, isLooping: true}
                );
                soundRef.current = sound;
            }
        };

        loadSound();

        return () => {
            if (soundRef.current) {
                soundRef.current.unloadAsync();
                soundRef.current = null;
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
        router.push("/GameScreen");
    };

    return (
        <ImageBackground source={require("@/src/assets/images/bg.png")} style={styles.background}>
            <StatusBar hidden={true}/>
            <View style={styles.container}>
                <Image
                    source={require("@/src/assets/images/logo.png")}
                    style={styles.logo}
                    resizeMode="cover"
                />

                <TouchableOpacity
                    style={[styles.botaoJogar, buttonPressed && styles.botaoJogarPressed]}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    onPress={handlePress}
                >
                    <Text style={styles.textoBotao}>JOGAR</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.botaoSettings} onPress={handleSettingsPress}>
                    <Image
                        source={require("@/src/assets/images/settings_icon.png")}
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
        width: "100%", // Ensure the background covers the full width
        height: "100%", // Ensure the background covers the full height
        resizeMode: "cover", // Ensure the image covers the whole background
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
    },
    logo: {
        resizeMode: "contain", // Ensures logo is not cropped
        marginBottom: 20,
    },
    botaoJogar: {
        paddingVertical: 15,
        paddingHorizontal: 30,
        backgroundColor: "#4EC307",
        borderRadius: 22,
        borderColor: "white",
        borderWidth: 3,
        marginBottom: 20,
    },
    botaoJogarPressed: {
        backgroundColor: "#3a9c03",
    },
    textoBotao: {
        color: "white",
        fontSize: 24,
        fontFamily: "Fonte",
        textAlign: "center",
    },
    botaoSettings: {
        position: "absolute",
        top: 30,
        right: 20,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        borderRadius: 50,
        padding: 10,
    },
    botaoSettingsIcon: {
        width: 25,
        height: 25,
        resizeMode: "contain",
    },
});

export default HomeScreen;
