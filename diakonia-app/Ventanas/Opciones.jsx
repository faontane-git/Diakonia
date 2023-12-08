import React from 'react';
import { View, Text, StyleSheet, Image, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Opciones = () => {
    const navigation = useNavigation();

    const onPressCerrarSesion = () => {
        navigation.navigate('Login');
    }
    const onPressEditarPerfil = () => {
        navigation.navigate('EditarPerfil');
    }
    const onPressCambiarContraseña = () => {
        navigation.navigate('CambiarContraseña');
    }

    return (
        <View style={styles.container}>
            <View style={styles.imagesContainer}>
                <Image
                    style={[styles.image, { marginTop: 0, marginLeft: -70 }]}
                    source={require('../assets/imagenes/logoMenu-banco-alimentos.png')}
                />
            </View>
            <Text style={styles.title}>Opciones</Text>
            <Text style={styles.name}>Juan Pérez</Text>
            <Text style={styles.company}>Kellog's</Text>
            <View style={styles.buttonsContainer}>
                <Button title="Editar Datos" onPress={onPressEditarPerfil} color="#890202" />
                <Text style={{ padding: 10 }} />
                <Button title="Cambiar Contraseña" onPress={() => { }} color="#890202" />
                <Text style={{ padding: 10 }} />
            </View>
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
    }
});

export default Opciones;