import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SettingsScreenProps {
  onClose: () => void;
  onToggleMute: () => void;
  isMuted: boolean;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onClose, onToggleMute, isMuted }) => {

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Ionicons name="close" size={32} color="white" />
      </TouchableOpacity>
      <View style={styles.settingsContainer}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="settings-outline" size={32} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={onToggleMute}>
          <Ionicons name={isMuted ? "volume-mute-outline" : "volume-high-outline"} size={32} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="information-circle-outline" size={32} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo escuro semi-transparente
  },
  closeButton: {
    position: 'absolute',
    top: 30,
    right: 20,
    zIndex: 1,
  },
  settingsContainer: {
    width: 200,
    height: 300,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 50,
    right: 20,
  },
  iconButton: {
    marginVertical: 10,
  },
});

export default SettingsScreen;
