import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

const SettingsScreen = () => {
  // Estado para controlar se o som está mudo ou não
  const [isMuted, setIsMuted] = useState(false);

  // Função para alternar o estado de mudo
  const toggleSound = () => {
    setIsMuted(previousState => !previousState);
    // Aqui você pode adicionar lógica para ativar/desativar o som do jogo
    // Por exemplo, você pode chamar uma função que controle o áudio
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configurações</Text>

      <View style={styles.settingRow}>
        <Text style={styles.settingText}>Som</Text>
        <Switch
          value={!isMuted} // O switch é ativado se o som não estiver mudo
          onValueChange={toggleSound}
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isMuted ? "#f4f3f4" : "#f5dd4b"}
        />
      </View>

      {/* Adicione outras configurações aqui, se necessário */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#282c34', 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  settingText: {
    fontSize: 18,
    color: 'white',
    marginRight: 10,
  },
});

export default SettingsScreen;
