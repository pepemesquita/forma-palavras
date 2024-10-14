import React from 'react';
import {View, TouchableOpacity, Image, StyleSheet} from 'react-native';

const ButtonContainer = ({onHomePress}: { onHomePress: () => void }) => {
    return (
        <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.iconButton} onPress={onHomePress}>
                <Image source={require('@/src/assets/images/iconex.png')} style={styles.closeIconImage}/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={onHomePress}>
                <Image source={require('@/src/assets/images/home.png')} style={styles.homeIconImage}/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => {}}>
                <Image source={require('@/src/assets/images/restart.png')} style={styles.restartIconImage}/>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        position: 'absolute',
        width: 120,
        height: 50,
        left: 29,
        top: 19,
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeIconImage: {
        width: 41,
        height: 41,
        resizeMode: 'contain',
        marginRight: 10,
    },
    homeIconImage: {
        width: 39,
        height: 39,
        resizeMode: 'contain',
        marginRight: 8,
    },
    restartIconImage: {
        width: 34,
        height: 34,
        resizeMode: 'contain',
        marginRight: 10,
    },
});

export default ButtonContainer;