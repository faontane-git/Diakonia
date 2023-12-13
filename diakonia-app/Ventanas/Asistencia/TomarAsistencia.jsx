import React from 'react';
import { StyleSheet, View, Text, ScrollView, Dimensions, TouchableOpacity, Image, Button, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FingerprintScanner from 'react-native-fingerprint-scanner';


const TomarAsistencia = () => {
    const navigation = useNavigation();
    const screenWidth = Dimensions.get('window').width;
    const handleOptionPress = (option) => {
        navigation.navigate(option);
    };
    const handleAuthentication = () => {
        FingerprintScanner
            .authenticate({ onAttempt: () => console.log('Autenticación en progreso') })
            .then(() => {
                Alert.alert('Autenticación exitosa', 'Has tocado tu huella correctamente.');
            })
            .catch((error) => {
                Alert.alert('Error de autenticación', error.message);
            });
    };

    return (
        <View style={styles.container}>
            <View style={styles.imagesContainer}>
                <Image
                    style={[styles.image, { marginTop: 0, marginLeft: -70 }]}
                    source={require('../../assets/imagenes/logoMenu-banco-alimentos.png')}
                />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.title}>Asistencia</Text>
            </View>

            <View style={styles.contenedor}>


                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Fecha</Text>
                    <TextInput
                        style={styles.inputFecha}
                        value="10/10/2023"
                        editable={false}
                    />
                </View>

                <View style={styles.inputBoton}>
                    <Button
                        title="Tomar Huella"
                        onPress={() => console.log('Tomar Huella')}
                        style={styles.inputHuella}
                        color={'#890202'}

                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Nombre</Text>
                    <TextInput
                        style={styles.inputNombre}
                        value=""
                        editable={false}
                    />
                </View>


                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Apellido</Text>
                    <TextInput
                        style={styles.inputApellido}
                        value=""
                        editable={false}
                    />
                </View>


                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Institución</Text>
                    <TextInput
                        style={styles.inputInstitucion}
                        value=""
                        editable={false}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Servicio</Text>
                    <TextInput
                        style={styles.inputServicio}
                        value=""
                        editable={false}
                    />
                </View>


                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.buttonAsistencia} onPress={() => console.log('Registrar Asistencia')}>
                        <Text style={styles.buttonText}>Registrar Asistencia</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
        paddingVertical: 30,
    }, imagesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 50,
    }, textContainer: {
        alignItems: 'center',
        paddingVertical: 5,
    },
    title: {
        fontSize: 18,
        color: '#333',
        fontWeight: 'bold',
        alignSelf: 'center',
        textAlign: 'center',
    }, contenedor: {
        alignItems: 'flex-start', // Cambié de 'center' a 'flex-start'
        paddingHorizontal: 20, // Agregué un padding para mejorar el diseño
    },
    titulo: {
        fontSize: 16,
        marginBottom: 5,
    }, inputFecha: {
        borderWidth: 1,
        borderColor: 'black',
        width: '30%',
        padding: 10,
        marginBottom: 20,
    }, inputFecha: {
        borderWidth: 1,
        borderColor: 'black',
        width: '30%',
        padding: 10,
        marginBottom: 20,
    }, inputNombre: {
        borderWidth: 1,
        borderColor: 'black',
        width: '70%',
        padding: 10,
        marginBottom: 20,
    }, inputApellido: {
        borderWidth: 1,
        borderColor: 'black',
        width: '70%',
        padding: 10,
        marginBottom: 20,
    }, inputInstitucion: {
        borderWidth: 1,
        borderColor: 'black',
        width: '70%',
        padding: 10,
        marginBottom: 20,
    }, inputServicio: {
        borderWidth: 1,
        borderColor: 'black',
        width: '70%',
        padding: 10,
        marginBottom: 20,
    }, inputBoton: {
        padding: 10, // Ajusta el espacio interno del botón
        width: '100%',
    }, inputHuella: {
        backgroundColor: '#890202', // Cambia el color del fondo del botón
    }, buttonText: {
        color: 'white',
        textAlign: 'center',
    }, buttonAsistencia: {
        backgroundColor: '#890202',
        padding: 10,
        width: '80%',
    }, contenedor: {
         paddingHorizontal: 20, // Agregué un padding para mejorar el diseño
    },buttonContainer:{
        marginLeft: 40, // Agregué un padding para mejorar el diseño
    }
});

export default TomarAsistencia;