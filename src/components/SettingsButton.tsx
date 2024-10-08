import React from 'react';
import {TouchableOpacity, Image, StyleSheet} from 'react-native';

const SettingsButton = ({onPress}: { onPress: () => void }) => (
    <TouchableOpacity style={styles.botaoSettings} onPress={onPress}>
        <Image
            source={require('@/src/assets/images/settings_icon.png')}
            style={styles.botaoSettingsImage}
            resizeMode="contain"
        />
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    botaoSettings: {
        position: 'absolute',
        top: 10,
        right: '4%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 50,
        padding: 10,
    },
    botaoSettingsImage: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
    },
});

export default SettingsButton;