import React from 'react';
import { StyleSheet, View, Text, Image, Button, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../AuthContext';

const Opciones = () => {
    const navigation = useNavigation();
    const { institucionN } = useAuth();
    const handleOptionPress = (option) => {
        navigation.navigate(option);
      };

    const onPressCerrarSesion = () => {
        navigation.navigate('Login');
    }

    const onPressCambiarContraseña = () => {
        navigation.navigate('CambiarContraseña');
    }

    return (
        <View style={styles.container}>
            <View style={styles.imagesContainer}>
                <Image
                    style={[styles.image, { marginTop: 0, marginLeft: -70 }]}
                    source={require('../../assets/imagenes/logoMenu-banco-alimentos.png')}
                />
                <TouchableOpacity
                    style={[styles.buttonCont, { marginTop: 0, marginLeft: 140 }]}
                    onPress={() => handleOptionPress('Home')}
                >
                    <Text style={styles.buttonText}>Regresar</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.title}>Opciones</Text>
            <Text style={styles.company}><Text>{institucionN}</Text></Text>
            {/*
            <View style={styles.buttonsContainer}>
                <Button title="Cambiar Contraseña" onPress={onPressCambiarContraseña} color="#890202" />
                <Text style={{ padding: 10 }} />
            </View>
            */}
            <Text style={{ padding: 25 }} />
            <View style={styles.buttonSesion}>
                <Button title="Cerrar Sesión" onPress={onPressCerrarSesion} color="#890202" />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
        paddingVertical: 30,
    },
    imagesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 50,
    },
    title: {
        fontSize: 24,
        textAlign: 'center',
        margin: 10,
    },
    name: {
        fontSize: 18,
        textAlign: 'center',
        margin: 10,
    },
    company: {
        fontSize: 16,
        textAlign: 'center',
        margin: 10,
    },
    buttonsContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    buttonSesion: {
        marginHorizontal: 20
    },
    buttonCont: {
        backgroundColor: '#890202',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
    },
});

export default Opciones;
