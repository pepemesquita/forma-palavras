import React from 'react';
import {View, TouchableOpacity, Image, StyleSheet} from 'react-native';

const ButtonContainer = ({onHomePress}: { onHomePress: () => void }) => {
    return (
        <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.iconButton} onPress={onHomePress}>
                <Image source={require('@/src/assets/images/iconex.png')} style={styles.iconImage}/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={onHomePress}>
                <Image source={require('@/src/assets/images/home.png')} style={styles.iconImage}/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => {
            }}>
                <Image source={require('@/src/assets/images/restart.png')} style={styles.iconImage}/>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
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
        width: 40,
        height: 40,
        resizeMode: 'contain',
    },
});

export default ButtonContainer;