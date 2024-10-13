import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const FinalScreen = () => {
    const faseDados = {
        identificacao: {
            id: '12345',
            dispositivo: 'Dispositivo Android XYZ',
        },
        sessao: {
            dataHora: new Date().toISOString(),
            duracao: '15 minutos',
        },
        progresso: {
            faseJogada: 'Fase 1',
            tempoNaFase: '5 minutos',
            ordemLetrasColocadas: ['A', 'B', 'C', 'D'],
            palavrasFormadasCorretamente: ['ABCD'],
            palavrasFormadasIncorretamente: ['ABDC'],
        },
        erros: {
            errosPorFase: 2,
            tempoParaCorrigir: '2 minutos',
        },
    };

    const gerarXML = () => {
        const xmlData = `
    <dados>
      <identificacao>
        <id>${faseDados.identificacao.id}</id>
        <dispositivo>${faseDados.identificacao.dispositivo}</dispositivo>
      </identificacao>
      <sessao>
        <dataHora>${faseDados.sessao.dataHora}</dataHora>
        <duracao>${faseDados.sessao.duracao}</duracao>
      </sessao>
      <progresso>
        <faseJogada>${faseDados.progresso.faseJogada}</faseJogada>
        <tempoNaFase>${faseDados.progresso.tempoNaFase}</tempoNaFase>
        <ordemLetrasColocadas>${faseDados.progresso.ordemLetrasColocadas.join(', ')}</ordemLetrasColocadas>
        <palavrasFormadasCorretamente>${faseDados.progresso.palavrasFormadasCorretamente.join(', ')}</palavrasFormadasCorretamente>
        <palavrasFormadasIncorretamente>${faseDados.progresso.palavrasFormadasIncorretamente.join(', ')}</palavrasFormadasIncorretamente>
      </progresso>
      <erros>
        <errosPorFase>${faseDados.erros.errosPorFase}</errosPorFase>
        <tempoParaCorrigir>${faseDados.erros.tempoParaCorrigir}</tempoParaCorrigir>
      </erros>
    </dados>
    `;
        return xmlData;
    };

    const baixarArquivoXML = async () => {
        const xmlContent = gerarXML();
        const fileName = 'dados_jogo.xml';
        const filePath = `${FileSystem.documentDirectory}${fileName}`;

        try {
            if (Platform.OS === 'web') {
                //pra web, cria um link de download manualmente
                const blob = new Blob([xmlContent], { type: 'application/xml' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', fileName);
                document.body.appendChild(link);
                link.click();
                link.remove();
                Alert.alert('Sucesso', 'Arquivo XML baixado com sucesso.');
            } else {
                //pra plataformas nativas, usa expo-file-system e expo-sharing
                await FileSystem.writeAsStringAsync(filePath, xmlContent);
                const isSharingAvailable = await Sharing.isAvailableAsync();
                if (isSharingAvailable) {
                    await Sharing.shareAsync(filePath, {
                        mimeType: 'application/xml',
                        dialogTitle: 'Baixar XML',
                    });
                } else {
                    Alert.alert('Compartilhamento não disponível', 'Não é possível compartilhar o arquivo neste dispositivo.');
                }
            }
        } catch (error) {
            console.error('Erro ao gerar o arquivo XML:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao gerar o arquivo XML.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Fase Finalizada!</Text>
            <Text style={styles.description}>
                Parabéns por completar a fase. Agora você pode baixar os dados do seu progresso em um arquivo XML.
            </Text>
            <TouchableOpacity style={styles.button} onPress={baixarArquivoXML}>
                <Text style={styles.buttonText}>Baixar Arquivo XML</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default FinalScreen;
