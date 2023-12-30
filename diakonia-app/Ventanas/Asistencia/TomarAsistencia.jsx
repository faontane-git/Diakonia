import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, Button, TextInput, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const TomarAsistencia = () => {
    const navigation = useNavigation();
    const [currentDate, setCurrentDate] = useState('');
    const [currentHour, setCurrentHour] = useState('');
    const [servicio, setServicio] = useState('');

    useEffect(() => {
        getCurrentDate();
        getCurrentHour();
    }, []);

    const handleOptionPress = (option) => {
        navigation.navigate(option);
    };

    const getCurrentDate = () => {
        const date = new Date();
        const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        setCurrentDate(formattedDate);
    };

    const getCurrentHour = () => {
        const hour = new Date().getHours();
        setCurrentHour(hour);

        // Verificar si la hora es mayor a las 3 PM (15 en formato de 24 horas)
        if (hour >= 15) {
            Alert.alert(
                '¡Notificación!',
                'No puedes tomar asistencia después de las 3 PM.',
            );
        }
    };

    const determineServicio = () => {
        if (currentHour >= 6 && currentHour <= 10) {
            setServicio('Desayuno');
        } else if (currentHour >= 11 && currentHour <= 23) {
            setServicio('Almuerzo');
        } else {
            setServicio('');
        }
    };

    useEffect(() => {
        determineServicio();
    }, [currentHour]);

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
                <View style={styles.row}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Fecha</Text>
                        <TextInput style={styles.inputFecha} value={currentDate} editable={false} />
                    </View>

                    <View style={styles.inputBoton}>
                        <Button
                            title="Tomar QR"
                            onPress={() => handleOptionPress('TomarHuella')}
                            color="#890202"
                        />
                    </View>
                </View>


                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Nombre</Text>
                    <TextInput style={styles.inputNombre} value="" editable={false} />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Institución</Text>
                    <TextInput style={styles.inputInstitucion} value="" editable={false} />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Servicio</Text>
                    <TextInput style={styles.inputServicio} value={servicio} editable={false} />
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.buttonAsistencia}
                        onPress={() => console.log('Registrar Asistencia')}
                    >
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
    },
    imagesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 50,
    },
    textContainer: {
        alignItems: 'center',
        paddingVertical: 5,
    },
    title: {
        fontSize: 18,
        color: '#333',
        fontWeight: 'bold',
        alignSelf: 'center',
        textAlign: 'center',
    },
    contenedor: {
        alignItems: 'flex-start',
        paddingHorizontal: 20,
    },
    row: {
        justifyContent: 'space-between',
        width: '100%',
    },
    inputContainer: {
        marginBottom: 20,
        width: '100%',
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    inputFecha: {
        borderWidth: 1,
        borderColor: 'black',
        width: '30%',
        padding: 10,
    },
    inputBoton: {
        padding: 0,
    },
    inputNombre: {
        borderWidth: 1,
        borderColor: 'black',
        width: '70%',
        padding: 10,
    },
    inputApellido: {
        borderWidth: 1,
        borderColor: 'black',
        width: '70%',
        padding: 10,
    },
    inputInstitucion: {
        borderWidth: 1,
        borderColor: 'black',
        width: '70%',
        padding: 10,
    },
    inputServicio: {
        borderWidth: 1,
        borderColor: 'black',
        width: '70%',
        padding: 10,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
    },
    buttonContainer: {
        marginTop: 25,
        alignItems: 'center',
        width: '100%',
    },
    buttonAsistencia: {
        backgroundColor: '#890202',
        padding: 10,
        width: '100%',
    },
});

export default TomarAsistencia;
