import React from 'react';
import { StyleSheet, View, Text, ScrollView, Dimensions, TouchableOpacity, Image, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../AuthContext';

const Asistencia = () => {
    const navigation = useNavigation();
    const screenWidth = Dimensions.get('window').width;
    const { updateScannedData } = useAuth();
    const handleOptionPress = (option) => {
        if (option === 'TomarAsistencia') {
            updateScannedData({
                nombre: '',
                institucion: '',
                iDinstitucion: '',
            });
        }

        navigation.navigate(option);
    };



    return (
        <View style={styles.container}>
            <View style={styles.imagesContainer}>
                <Image
                    style={[styles.image, { marginTop: 0, marginLeft: -70 }]}
                    source={require('../../assets/imagenes/logoMenu-banco-alimentos.png')}
                />
                <TouchableOpacity
                    style={[styles.buttonContainer, { marginTop: 0, marginLeft: 140 }]}
                    onPress={() => handleOptionPress('Home')}
                >
                    <Text style={styles.buttonText}>Regresar</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.title}>Asistencia</Text>
                <Text style={styles.title}>Seleccione una opción</Text>
            </View>
            <ScrollView style={styles.optionContainer}>
                <TouchableOpacity style={styles.option} onPress={() => handleOptionPress('TomarAsistencia')}>
                    <Text style={[styles.text, { color: 'white' }]}>Tomar Asistencias</Text>
                    <Image
                        style={{ width: 50, height: 50, marginLeft: 250, marginTop: -35 }}
                        source={require('../../assets/imagenes/tomarAsistencia.png')}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.option} onPress={() => handleOptionPress('VerAsistencia')}>
                    <Text style={[styles.text, { color: 'white' }]}>Ver Asistencia</Text>
                    <Image
                        style={{ width: 50, height: 50, marginLeft: 250, marginTop: -35 }}
                        source={require('../../assets/imagenes/verAsistencia.png')}
                    />
                </TouchableOpacity>
                {/*
                <TouchableOpacity style={styles.option} onPress={() => handleOptionPress('QR')}>
                    <Text style={[styles.text, { color: 'white' }]}>QR</Text>
                </TouchableOpacity>
                */}
            </ScrollView>
        </View>
    );
};

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
        fontSize: 18,
        color: '#333',
        fontWeight: 'bold',
        alignSelf: 'center',
        textAlign: 'center',
    },
    textContainer: {
        paddingBottom: 10
    },
    option: {
        backgroundColor: '#890202',
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 15,
        marginBottom: 10,
        marginHorizontal: 20,
    },
    optionContainer: {
        paddingVertical: 25,
    },
    buttonContainer: {
        backgroundColor: '#890202',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
     }, buttonText: {
        color: 'white',
     },
    text: {
        fontSize: 16,
        color: '#333',
    },
});

export default Asistencia;