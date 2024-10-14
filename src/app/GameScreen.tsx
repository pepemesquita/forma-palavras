import React, {useCallback, useEffect, useRef, useState} from "react";
import {
  Animated,
  findNodeHandle,
  Image,
  ImageBackground,
  Modal,
  PanResponder,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import {useFonts} from "expo-font";
import {useRouter} from "expo-router";
import {useFocusEffect} from '@react-navigation/native';
import {Audio} from "expo-av";
import SettingsScreen from "./SettingsScreen";
import {useSound} from "../contexts/SoundContext";
import {
  BlankSpaceType,
  figures,
  getTargetLetter,
  letterArray,
  letterImages,
  LetterType,
  verifyWord,
} from "../utils/mockData";
import ButtonContainer from "../components/ButtonContainer";
import SettingsButton from "../components/SettingsButton";
import {MaterialIcons} from "@expo/vector-icons";
import {Simulate} from "react-dom/test-utils";
import play = Simulate.play;
import {number} from "prop-types";

const GameScreen = () => {
  const [fontsLoaded] = useFonts({
    Fonte: require("@/src/assets/fonts/Digitalt.ttf"),
  });

  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const { isMuted, toggleMute } = useSound();
  const router = useRouter();
  const soundRef = useRef<Audio.Sound | null>(null);

  const [letters, setLetters] = useState<LetterType[]>(letterArray.map((char) => ({ char, position: null })));
  const blankSpaceRefs = useRef<(View | null)[]>([]);
  const [blankSpacePositions, setBlankSpacePositions] = useState<{ fx: number; fy: number; width: number; height: number; x: number; y: number }[]>([]);
  const [blankSpaces, setBlankSpaces] = useState<(BlankSpaceType | null)[]>(Array(16).fill(null));
  const [verificationMarks, setVerificationMarks] = useState<(string | null)[]>(Array(4).fill(null));
  const gameCompleted = useRef(false);
  const gestureTime = useRef(0);
  const numberOfGestures = useRef(0);
  const localGestureStartTime = useRef(0);
  const sessionStartTime = useRef(0);
  const sessionEndTime = useRef(0);
  const sessionTotalTime = useRef(0);
  const [sessionStatistics, setSessionStatistics] = useState(null);
  const [letterActions, setLetterActions] = useState([]);
  const [playCount, setPlayCount] = useState({lettersSelected: 0, lettersPlacedCorrectly: 0, lettersPlacedIncorrectly: 0});

  const playCountRef = useRef(playCount);
  const letterActionsRef = useRef(letterActions);
  const sessionStatisticsRef = useRef(sessionStatistics);

  useEffect(() => {
    playCountRef.current = playCount;
    letterActionsRef.current = letterActions;
    sessionStatisticsRef.current = sessionStatistics;
  }, [playCount, letterActions]);

  useEffect(() => {
    const loadSound = async () => {
      const { sound } = await Audio.Sound.createAsync(
          require("@/src/assets/sounds/background.mp3"),
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
  }, [isMuted]);

  useEffect(() => {
    const positions: {
      fx: number;
      fy: number;
      width: number;
      height: number;
      x: number;
      y: number;
    }[] = [];

    blankSpaceRefs.current.forEach((ref, index) => {
      if (ref) {
        const handle = findNodeHandle(ref);
        if (handle) {
          ref.measure((fx, fy, width, height, px, py) => {
            positions[index] = { fx, fy, width, height, x: px, y: py };
            if (positions.length === blankSpaceRefs.current.length) {
              setBlankSpacePositions(positions);
            }
          });
        }
      }
    });
  }, [blankSpaces]);

  useEffect(() => {
    const figuresArray = Object.values(figures);

    let allWordsCorrect = true;

    figuresArray.forEach((_, figureIndex) => {
      const lineBlankSpaces = blankSpaces.slice(figureIndex * 4, figureIndex * 4 + 4);
      const allFilled = lineBlankSpaces.every((space) => space !== null);

      if (allFilled) {
        const isCorrect = verifyWord(lineBlankSpaces, figureIndex);

        setVerificationMarks((prevMarks) => {
          const updatedMarks = [...prevMarks];
          updatedMarks[figureIndex] = isCorrect ? "check-circle" : "cancel";
          return updatedMarks;
        });

        if (!isCorrect) {
          allWordsCorrect = false;
        }
      } else {
        setVerificationMarks((prevMarks) => {
          const updatedMarks = [...prevMarks];
          updatedMarks[figureIndex] = "invisible";
          return updatedMarks;
        });
        allWordsCorrect = false;
      }
    });

    //navega para a próxima fase apenas se todas as palavras estiverem corretas
    if (allWordsCorrect) {
        gameCompleted.current = true;
        handleGameEnding();
    }
  }, [blankSpaces]);

  const handleGameEnding = () => {
    sessionEndTime.current = Date.now();
    sessionTotalTime.current = sessionEndTime.current - sessionStartTime.current;

    console.log("SESSION TOTAL TIME ", sessionTotalTime.current)
    console.log("GESTURE TOTAL TIME ", gestureTime.current)
    const avgLetterElapsedTime = gestureTime.current / numberOfGestures.current;
    const idleElapsedTime = sessionTotalTime.current - gestureTime.current;
    const sessionStats = {
      horario_inicio: new Date(sessionStartTime.current).toISOString(),
      horario_fim: new Date(sessionEndTime.current).toISOString(),
      tempo_total: sessionTotalTime.current / 1000,
      tempo_medio_por_letra: avgLetterElapsedTime / 1000,
      tempo_em_ociosidade: idleElapsedTime / 1000,
      letras_selecionadas_total: playCountRef.current.lettersSelected,
      letras_posicionadas_corretamente: playCountRef.current.lettersPlacedCorrectly,
      letras_posicionadas_incorretamente: playCountRef.current.lettersPlacedIncorrectly,
      sessao_completada: gameCompleted.current
    };
    sessionStatisticsRef.current = sessionStats;

    router.push({
      pathname: "/FinalScreen",
      params: {
        sessionData: JSON.stringify(sessionStatisticsRef.current),
        actionsData: JSON.stringify(letterActionsRef.current)
      }
    })
  };

  useFocusEffect(
      useCallback(() => {
        sessionStartTime.current = Date.now();

        return () => {
          handleGameEnding();
        };
      }, [])
  );

  let gestureStartTime = 0;
  const pan = useRef(letters.map(() => new Animated.ValueXY())).current;
  const panResponders = letters.map((_, index) => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (event, gesture) => {
        localGestureStartTime.current = Date.now();
        gestureStartTime = Date.now();
        numberOfGestures.current += 1;
        setPlayCount((prevCounts) => ({
          ...prevCounts,
          lettersSelected: prevCounts.lettersSelected + 1,
        }));

        console.log(playCount.lettersSelected)
      },
      onPanResponderMove: (event, gesture) => {
        pan[index].setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (_, gesture) => {
        const finalPosition = { x: gesture.moveX, y: gesture.moveY };
        const droppedSpaceIndex = findNearestBlankSpace(finalPosition);

        const gestureEndTime = Date.now();
        let gestureTotalDuration = gestureEndTime - gestureStartTime;
        gestureTotalDuration =  gestureTotalDuration + gestureTime.current;
        gestureTime.current = gestureTotalDuration;

        let validPlacement;
        let targetPlacement;
        if (droppedSpaceIndex !== null) {
          const updatedBlankSpaces = [...blankSpaces];
          const updatedLetters = [...letters];

          validPlacement = true;
          targetPlacement = droppedSpaceIndex;

          // Se o espaço já está ocupado, a letra anterior retorna ao conjunto de letras
          const currentLetterInSpace = updatedBlankSpaces[droppedSpaceIndex];
          if (currentLetterInSpace) {
            updatedLetters[currentLetterInSpace.letterIndex].position = null;
          }

          // Atualiza a posição da letra solta
          updatedBlankSpaces[droppedSpaceIndex] = {
            char: updatedLetters[index].char,
            letterIndex: index,
          };
          updatedLetters[index].position = droppedSpaceIndex;

          setBlankSpaces(updatedBlankSpaces);
          setLetters(updatedLetters);

          // Reseta a posição visual da letra
          pan[index].setValue({ x: 0, y: 0 });
        } else {
          // valores xml
          validPlacement = false;
          targetPlacement = null;

          // Volta a letra para sua posição inicial se não for colocada em nenhum espaço
          Animated.spring(pan[index], {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        }

        const targetLetter = droppedSpaceIndex != null ? getTargetLetter(letters[index].char, droppedSpaceIndex) : null;
        const endTime = Date.now();
        const letterAction = {
          horario_inicio: new Date(localGestureStartTime.current).toISOString(),
          horario_fim: new Date(endTime).toISOString(),
          tempo_total: (endTime - localGestureStartTime.current) / 1000,
          letra_selecionada: letters[index].char,
          letra_esperada: targetLetter,
          jogada_correta: letters[index].char === targetLetter,
          jogada_valida: validPlacement,
        }
        setLetterActions(prevState => [...prevState, letterAction]);

        if (letters[index].char === targetLetter) {
          setPlayCount((prevCounts) => ({
            ...prevCounts,
            lettersPlacedCorrectly: prevCounts.lettersPlacedCorrectly + 1,
          }));
        } else {
          setPlayCount((prevCounts) => ({
            ...prevCounts,
            lettersPlacedIncorrectly: prevCounts.lettersPlacedIncorrectly + 1,
          }));
        }
      }
    });
  });

  const findNearestBlankSpace = (letterPosition: { x: number; y: number }): number | null => {
    const blankSpacesIndexes = blankSpaces
      .map((space, index) => (space === null ? index : null))
      .filter((index) => index !== null);

    let shortestDistance = Infinity;
    let nearestSpaceIndex = null;

    blankSpacesIndexes.forEach((spaceIndex) => {
      const spacePosition = blankSpacePositions[spaceIndex];
      const distance = Math.sqrt(
        Math.pow(letterPosition.x - (spacePosition.x + spacePosition.width / 2), 2) +
          Math.pow(letterPosition.y - (spacePosition.y + spacePosition.height / 2), 2)
      );

      if (distance < shortestDistance) {
        shortestDistance = distance;
        nearestSpaceIndex = spaceIndex;
      }
    });

    return shortestDistance < 50 ? nearestSpaceIndex : null;
  };

  const handleHomePress = () => {
    router.push("/");
  };

  const handleSettingsPress = () => {
    setIsSettingsVisible(true);
  };

  const handleCloseSettings = () => {
    setIsSettingsVisible(false);
  };

  const renderFigures = () => {
    const render_figures = Object.values(figures);
    return render_figures.map((figure, figureIndex) => (
      <View key={figureIndex} style={styles.figureContainer}>
        <Image source={figure} style={styles.figureImage} />
        <View style={styles.spacesContainer}>
          {[...Array(4)].map((_, spaceIdx) => {
            const spaceIndex = figureIndex * 4 + spaceIdx;
            const letterInSpace = blankSpaces[spaceIndex];
            return (
              <Animated.View
                key={spaceIdx}
                style={[styles.blankSpace]}
                ref={(el) => (blankSpaceRefs.current[spaceIndex] = el)}
              >
                {letterInSpace ? (
                  <Image source={letterImages[letterInSpace.char]} style={styles.letterImage} />
                ) : (
                  <Image
                    source={require("@/src/assets/images/blank_rectangle.png")}
                    style={styles.blankSpaceImage}
                  />
                )}
              </Animated.View>
            );
          })}
          {/* Renderiza o ícone de verificação ou um espaço invisível */}
          {verificationMarks[figureIndex] === "invisible" ? (
              <View style={styles.invisibleIcon} />
          ) : (
              <MaterialIcons
                  name={verificationMarks[figureIndex] || "help-outline"}
                  size={24}
                  color={verificationMarks[figureIndex] === "check-circle" ? "green" : "red"}
              />
          )}
        </View>
      </View>
    ));
  };

  const renderLetters = () => (
    <View style={styles.lettersContainer}>
      {letters.map((letter, index) => {
        if (letter.position !== null) return null;

        const { char } = letter;
        const panStyle = {
          transform: [{ translateX: pan[index].x }, { translateY: pan[index].y }],
        };

        return (
          <Animated.View
            key={index}
            style={[styles.letterTile, panStyle]}
            {...panResponders[index].panHandlers}
          >
            <Image source={letterImages[char]} style={styles.letterImage} />
          </Animated.View>
        );
      })}
    </View>
  );

  return (
    <ImageBackground source={require("@/src/assets/images/bg.png")} style={styles.background}>
      <StatusBar hidden={true} />
      <ButtonContainer onHomePress={handleHomePress} />
      <SettingsButton onPress={handleSettingsPress} />

      <View style={styles.gameContainer}>
        <View style={styles.figuresSection}>{renderFigures()}</View>
        <View style={styles.lettersSection}>{renderLetters()}</View>
      </View>

      <Modal
        visible={isSettingsVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCloseSettings}
      >
        <SettingsScreen
          onClose={handleCloseSettings}
          onToggleMute={async () => {
            await toggleMute();
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
    width: "100%", // Ensure the background covers the full width
    height: "100%", // Ensure the background covers the full height
    resizeMode: "cover", // Ensure the image covers the whole background
  },
  buttonContainer: {
    position: "absolute",
    width: 120,
    height: 50,
    left: 26,
    top: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconButton: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  iconImage: {
    width: 40, // Ajustado para garantir tamanho uniforme
    height: 40, // Ajustado para garantir tamanho uniforme
    resizeMode: "contain",
  },
  botaoSettings: {
    position: "absolute",
    top: 10,
    right: "4%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 50,
    padding: 10, // Adicionando padding para garantir que o ícone tenha espaço suficiente
  },
  botaoSettingsImage: {
    // Verifique se esta propriedade está presente e corretamente definida
    width: 30, // Ajuste do tamanho do ícone do botão de configurações
    height: 30,
    resizeMode: "contain",
  },
  gameContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: "5%",
  },
  figuresSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
    marginRight: "5%",
  },
  lettersSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    marginLeft: "5%",
  },
  figureContainer: {
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  figureImage: {
    width: 60,
    height: 60,
    marginRight: 10,
  },
  spacesContainer: {
    flexDirection: "row",
  },
  blankSpaceImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  blankSpace: {
    width: 40,
    height: 40,
    marginRight: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  highlightedBlankSpace: {
    width: 40,
    height: 40,
    marginRight: 5,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "yellow",
    borderWidth: 2,
  },
  lettersContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  letterTile: {
    width: 40,
    height: 40,
    margin: 5,
    zIndex: 1,
  },
  letterImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  verificationMark: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  verificationIcon: {
    marginLeft: 10,
  },
  icon: {
    marginLeft: 10,
  },
  invisibleIcon: {
    width: 20,
    height: 24,
    marginLeft: 4, //AJUSTAR AQUI O ELEMENTO INVISÍVEL QUE ALINHA QUANDO A PALAVRA NÃO ESTÁ COMPLETA
    backgroundColor: "transparent",
  },
});

export default GameScreen;
