import React, {useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as XLSX from 'xlsx';
import { useLocalSearchParams, useRouter } from 'expo-router';

const FinalScreen = () => {
    const router = useRouter();
    const { sessionData, actionsData } = useLocalSearchParams();
    const parsedSessionData = JSON.parse(sessionData);
    const parsedActionsData = JSON.parse(actionsData);

    useEffect(() => {
        const generateAndShareFile = async () => {
            if (parsedSessionData && parsedActionsData) {
                await generateXLSXFile(parsedSessionData, parsedActionsData);
                router.push("/");  // Redireciona apenas depois da geração do arquivo
            }
        };

        generateAndShareFile();  // Chama a função dentro do useEffect
    }, [parsedSessionData, parsedActionsData]);

    const generateXLSXFile = async (sessionData, actionsData) => {
        const generalSheet = XLSX.utils.json_to_sheet([sessionData]);
        const actionsSheet = XLSX.utils.json_to_sheet(actionsData);

        const wbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wbook, generalSheet, "general");
        XLSX.utils.book_append_sheet(wbook, actionsSheet, "actions");

        const wbout = XLSX.write(wbook, { type: 'base64', bookType: 'xlsx' });
        const fileName = `${FileSystem.documentDirectory}game_session.xlsx`;

        try {
            if (Platform.OS === 'web') {
                const blob = new Blob([s2ab(atob(wbout))], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'game_session.xlsx');
                document.body.appendChild(link);
                link.click();
                link.remove();
                Alert.alert('Sucesso', 'Arquivo XLSX baixado com sucesso.');
            } else {
                await FileSystem.writeAsStringAsync(fileName, wbout, {
                    encoding: FileSystem.EncodingType.Base64
                });
                const isSharingAvailable = await Sharing.isAvailableAsync();
                if (isSharingAvailable) {
                    await Sharing.shareAsync(fileName, {
                        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                        dialogTitle: 'Baixar Arquivo XLSX',
                        UTI: 'com.microsoft.excel.xlsx'
                    });
                } else {
                    Alert.alert('Compartilhamento não disponível', 'Não é possível compartilhar o arquivo neste dispositivo.');
                }
            }
        } catch (error) {
            console.error('Erro ao gerar o arquivo XLSX:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao gerar o arquivo XLSX.');
        }
    };

    const s2ab = (s) => {
        const buf = new ArrayBuffer(s.length); // convert to ArrayBuffer
        const view = new Uint8Array(buf); // create a view for the buffer
        for (let i = 0; i !== s.length; ++i) {
            view[i] = s.charCodeAt(i) & 0xFF; // convert the string into binary data
        }
        return buf;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Final Screen</Text>
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
});

export default FinalScreen;
