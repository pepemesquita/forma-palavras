import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, ImageBackground, StatusBar, TouchableOpacity, Image, Modal, PanResponder, Animated, findNodeHandle } from 'react-native';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import { Audio } from 'expo-av';
import SettingsScreen from './settings';
import { useSound } from './SoundContext';
import { figures, letterImages, letterArray, LetterType, BlankSpaceType } from '../utils/mockData';
import ButtonContainer from '../components/ButtonContainer';
import SettingsButton from '../components/SettingsButton';

const FaseUm = () => {
  const [fontsLoaded] = useFonts({
    'Fonte': require('@/src/assets/fonts/Digitalt.ttf'),
  });

  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const { isMuted, toggleMute } = useSound();
  const router = useRouter();
  const soundRef = useRef<Audio.Sound | null>(null);

  const blankSpaceRefs = useRef<(View | null)[]>([]); 
  const [blankSpacePositions, setBlankSpacePositions] = useState<{ fx: number, fy: number, width: number, height: number, x: number, y: number }[]>([]);
  const [blankSpaces, setBlankSpaces] = useState<(BlankSpaceType | null)[]>(Array(16).fill(null));
  const [highlightedBlankSpaceIndex, setHighlightedBlankSpaceIndex] = useState<number | null>(null);

  useEffect(() => {
    const loadSound = async () => {
      const { sound } = await Audio.Sound.createAsync(
        require('@/src/assets/sounds/background.mp3'),
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
    const positions: { fx: number, fy: number, width: number, height: number, x: number, y: number }[] = [];

    blankSpaceRefs.current.forEach((ref, index) => {
      if (ref) {
        const handle = findNodeHandle(ref); // Usa findNodeHandle para garantir referência correta
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

  const handleHomePress = () => {
    router.push('/');
  };

  const handleSettingsPress = () => {
    setIsSettingsVisible(true);
  };

  const handleCloseSettings = () => {
    setIsSettingsVisible(false);
  };

  const [letters, setLetters] = useState<LetterType[]>(letterArray.map(char => ({ char, position: null })));
  const pan = useRef(letters.map(() => new Animated.ValueXY())).current;
  
 const panResponders = letters.map((_, index) => {
  return PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gesture) => {pan[index].setValue({ x: gesture.dx, y: gesture.dy });},
    onPanResponderRelease: (_, gesture) => {
      const finalPosition = { x: gesture.moveX, y: gesture.moveY };
      const droppedSpaceIndex = findNearestBlankSpace(finalPosition);

      if (droppedSpaceIndex !== null) {
        const updatedBlankSpaces = [...blankSpaces];
        const updatedLetters = [...letters];

        updatedBlankSpaces[droppedSpaceIndex] = { char: updatedLetters[index].char, letterIndex: index };
        updatedLetters[index] = { ...updatedLetters[index], position: droppedSpaceIndex };

        setBlankSpaces(updatedBlankSpaces);
        setLetters(updatedLetters);

        // Reseta a posição da animação
        pan[index].setValue({ x: 0, y: 0 });
      } else {
        // Anima de volta para a posição original
        Animated.spring(pan[index], {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      }
    },
  });
});

  const findNearestBlankSpace = (letterPosition: { x: number; y: number }): number | null => {
    const blankSpacesIndexes = blankSpaces.map((space, index) => space === null ? index : null).filter(index => index !== null);

    let shortestDistance = Infinity;
    let nearestSpaceIndex = null;

    blankSpacesIndexes.forEach(spaceIndex => {
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

    return nearestSpaceIndex;
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
                style={[
                  styles.blankSpace,
                ]}
                ref={el => (blankSpaceRefs.current[spaceIndex] = el)}
              >
                {letterInSpace ? (
                  <Image source={letterImages[letterInSpace.char]} style={styles.letterImage} />
                ) : (
                  <Image source={require('@/src/assets/images/blank_rectangle.png')} style={styles.blankSpaceImage} />
                )}
              </Animated.View>
            );
          })}
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
          transform: [
            { translateX: pan[index].x },
            { translateY: pan[index].y },
          ],
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
        <View style={styles.figuresSection}>
          {renderFigures()}
        </View>
        <View style={styles.lettersSection}>
          {renderLetters()}
        </View>
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
  gameContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: '5%',
  },
  figuresSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginRight: '5%',
  },
  lettersSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginLeft: '5%',
  },
  figureContainer: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  figureImage: {
    width: 60,
    height: 60,
    marginRight: 10,
  },
  spacesContainer: {
    flexDirection: 'row',
  },
  blankSpaceImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  blankSpace: {
    width: 40,
    height: 40,
    marginRight: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  highlightedBlankSpace: {
    width: 40,
    height: 40,
    marginRight: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'yellow',
    borderWidth: 2,
  },
  lettersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  letterTile: {
    width: 40,
    height: 40,
    margin: 5,
    zIndex: 1,
  },
  letterImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

export default FaseUm;
