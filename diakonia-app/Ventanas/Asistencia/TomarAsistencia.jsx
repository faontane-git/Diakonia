import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, Alert, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../AuthContext';
import { Timestamp } from 'firebase/firestore';
import { getFirestore, collection, doc, query, where, getDoc, updateDoc, } from 'firebase/firestore';


const TomarAsistencia = () => {
    const { scannedData } = useAuth();
    const navigation = useNavigation();
    const route = useRoute();
    const [currentDate, setCurrentDate] = useState('');
    const [currentHour, setCurrentHour] = useState('');
    const [servicio, setServicio] = useState('');
    const nombre = scannedData?.nombre || '';
    const institucion = scannedData?.institucion || '';
    const convenio = scannedData?.convenio || '';
    const iDinstitucion = scannedData?.iDinstitucion || '';
    const idBeneficiario = scannedData?.iDinstitucion || '';

    const registrarAsistencia = async () => {
        const querydb = getFirestore();
        const beneficiariosCollection = collection(querydb, 'beneficiarios');
        const beneficiarioDoc = doc(beneficiariosCollection, '5vsGEsza5kLXwWAdyOQu');

        try {
            // Obtén el documento actual del beneficiario
            const beneficiarioSnapshot = await getDoc(beneficiarioDoc);

            if (beneficiarioSnapshot.exists()) {
                const beneficiarioData = beneficiarioSnapshot.data();
                // Verifica si 'desayuno' existe antes de acceder a él
                const desayunoArray = beneficiarioData.desayuno || [];
                // Convierte la fecha actual a un objeto Timestamp
                const timestamp = Timestamp.fromDate(new Date());

                // Verifica si la fecha actual ya está registrada
                if (isDateAlreadyRegistered(beneficiarioData.dias, timestamp)) {
                    Alert.alert('¡Asistencia Duplicada!', 'La asistencia ya está registrada para hoy.');
                }
                else {
                    // Actualiza el documento con los nuevos datos
                    await updateDoc(beneficiarioDoc, {
                        desayuno: [...desayunoArray, 1],
                        dias: [...(beneficiarioData.dias || []), timestamp],
                    });
                    Alert.alert('Asistencia Registrada', 'La asistencia ha sido registrada con éxito.');
                }
            
            } else {
                console.error('El documento del beneficiario no existe.');
            }
        } catch (error) {
            console.error('Error al registrar la asistencia:', error);
        }
    };

    const isDateAlreadyRegistered = (datesArray, newDate) => {
        return (
            datesArray &&
            datesArray
                .map(timestamp => timestamp.toDate().toLocaleDateString('es-ES'))
                .some(date => date === newDate.toDate().toLocaleDateString('es-ES'))
        );
    };

    useEffect(() => {
        getCurrentDate();
        getCurrentHour();
    }, []);

    const getCurrentDate = () => {
        const date = new Date();
        const day = addLeadingZero(date.getDate());
        const month = addLeadingZero(date.getMonth() + 1);
        const year = date.getFullYear();
        const formattedDate = `${day}/${month}/${year}`;
        setCurrentDate(formattedDate);
    };

    const addLeadingZero = (number) => {
        return number < 10 ? `0${number}` : number;
    };

    const getCurrentHour = () => {
        const hour = new Date().getHours();
        setCurrentHour(hour);

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
            setServicio('Desayuno');
        } else {
            setServicio('');
        }
    };

    useEffect(() => {
        determineServicio();
    }, [currentHour, scannedData]);

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

                    <TouchableOpacity
                        style={styles.buttonAsistencia}
                        onPress={() => navigation.navigate('TomarHuella')}
                    >
                        <Text style={styles.buttonText}>Tomar QR</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Nombre</Text>
                    <TextInput style={styles.inputNombre} value={nombre || ''} editable={false} />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Institución</Text>
                    <TextInput style={styles.inputInstitucion} value={institucion || ''} editable={false} />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Convenio</Text>
                    <TextInput style={styles.inputInstitucion} value={convenio || ''} editable={false} />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Servicio</Text>
                    <TextInput style={styles.inputServicio} value={servicio} editable={false} />
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.buttonAsistencia}
                        onPress={registrarAsistencia}
                    >
                        <Text style={styles.buttonText}>Registrar Asistencia</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View >
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
