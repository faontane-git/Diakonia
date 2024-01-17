import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, Alert, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../AuthContext';
import { Timestamp } from 'firebase/firestore';
import { getFirestore, collection, doc, query, where, getDoc, updateDoc, getDocs } from 'firebase/firestore';
import { onSnapshot } from 'firebase/firestore';

const TomarAsistencia = () => {
    const { scannedData } = useAuth();
    const { convenioId } = useAuth();
    const route = useRoute();
    const navigation = useNavigation();
    const handleOptionPress = (option) => {
        navigation.navigate(option);
      };
    
    const [currentDate, setCurrentDate] = useState('');
    const [currentHour, setCurrentHour] = useState('');

    const [desayuno, setDesayuno] = useState(false);
    const [almuerzo, setAlmuerzo] = useState(false);

    const [servicio, setServicio] = useState('');
    const nombre = scannedData?.nombre || '';
    const institucion = scannedData?.institucion || '';
    const convenio = scannedData?.convenio || '';
    const iDinstitucion = scannedData?.iDinstitucion || '';
    const idBeneficiario = scannedData?.iDinstitucion || '';
   
    const establecerHorarios = () => {
        try {
            const db = getFirestore();
            const horariosCollection = collection(db, 'horarios');

            let inicioDesayuno, finalDesayuno, inicioAlmuerzo, finalAlmuerzo;

            const unsubscribe = onSnapshot(horariosCollection, (querySnapshot) => {
                if (!querySnapshot.empty) {
                    querySnapshot.forEach((horarioDoc) => {
                        if (horarioDoc.exists() && horarioDoc.data().horaDesayuno) {
                            const { inicial, final } = horarioDoc.data().horaDesayuno;
                            inicioDesayuno = inicial;
                            finalDesayuno = final;
                        }
                    });

                    querySnapshot.forEach((horarioDoc) => {
                        if (horarioDoc.exists() && horarioDoc.data().horaAlmuerzo) {
                            const { inicial, final } = horarioDoc.data().horaAlmuerzo;
                            inicioAlmuerzo = inicial;
                            finalAlmuerzo = final;
                        }
                    });

                    // Llamar a getCurrentHour con las horas obtenidas
                    getCurrentHour(inicioDesayuno, finalDesayuno, inicioAlmuerzo, finalAlmuerzo);
                } else {
                    console.error('No se encontraron documentos en la colección "horarios"');
                }
            });

        } catch (error) {
            console.error('Error al establecer los horarios:', error);
        }
    };

    const registrarAsistencia = async () => {
        const querydb = getFirestore();
        const beneficiariosCollection = collection(querydb, 'beneficiarios');
        const beneficiarioDoc = doc(beneficiariosCollection, '5vsGEsza5kLXwWAdyOQu');

        try {
            // Obtén el documento actual del beneficiario
            const beneficiarioSnapshot = await getDoc(beneficiarioDoc);

            if (beneficiarioSnapshot.exists()) {
                const beneficiarioData = beneficiarioSnapshot.data();
                const desayunoArray = beneficiarioData.desayuno || [];
                const timestamp = Timestamp.fromDate(new Date());

                if (isDateAlreadyRegistered(beneficiarioData.dias, timestamp)) {
                    Alert.alert('¡Asistencia Duplicada!', 'La asistencia ya está registrada para hoy.');
                }
                else {
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
        establecerHorarios();
        getCurrentDate();
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

    const getCurrentHour = (inicioDesayuno, finalDesayuno, inicioAlmuerzo, finalAlmuerzo) => {
        consultarDatosPorConvenio();
        const currentDateTime = new Date();
        const currentHour = currentDateTime.getHours();
        const currentMinute = currentDateTime.getMinutes();
        const currentFormattedTime = `${currentHour}:${currentMinute < 10 ? '0' : ''}${currentMinute}`;
        const desayuno_hora = currentFormattedTime >= inicioDesayuno && currentFormattedTime <= finalDesayuno;
        const almuerzo_hora = currentFormattedTime >= inicioAlmuerzo && currentFormattedTime <= finalAlmuerzo;



        if (!(desayuno_hora || almuerzo_hora)) {
            Alert.alert(
                '¡Notificación!',
                '¡No puedes tomar asistencia fuera del horario permitido!',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            navigation.navigate('Asistencia');
                        },
                    },
                ],
                { cancelable: false }
            );
        } else {
            if (desayuno) {
                setServicio('Desayuno');

            } else {
                setServicio('Almuerzo');
            }
        }
    };


    const consultarDatosPorConvenio = async () => {
        try {
            const db = getFirestore();
            const datosCollection = collection(db, 'convenios'); // Reemplaza 'tuColeccion' con el nombre real de tu colección

            // Consulta para obtener documentos que tengan el ID igual al valor de useAuth
            const documento = await getDoc(doc(datosCollection, convenioId));

            if (documento.exists()) {
                const datos = documento.data();
                setDesayuno(datos.desayuno);
                setAlmuerzo(datos.almuerzo);
            } else {
                console.log('No se encontraron datos para el convenioId:', convenioId);
            }
        } catch (error) {
            console.error('Error al consultar datos:', error);
        }
    };


    return (
        <View style={styles.container}>
            <View style={styles.imagesContainer}>
                <Image
                    style={[styles.image, { marginTop: 0, marginLeft: -70 }]}
                    source={require('../../assets/imagenes/logoMenu-banco-alimentos.png')}
                />
                <TouchableOpacity
                    style={[styles.buttonCont, { marginTop: 0, marginLeft: 140 }]}
                    onPress={() => handleOptionPress('Asistencia')}
                >
                    <Text style={styles.buttonText}>Regresar</Text>
                </TouchableOpacity>
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
