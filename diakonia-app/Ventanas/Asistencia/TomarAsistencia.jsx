import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, Alert, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../AuthContext';
import { Timestamp } from 'firebase/firestore';
import { getFirestore, collection, doc, query, where, getDoc, getDocs,updateDoc } from 'firebase/firestore';
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
    const idBeneficiario = scannedData?.idBeneficiario || '';
    const cedula = scannedData?.cedula || '';

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
        try {
            const firestore = getFirestore();
            const beneficiarioCollection = collection(firestore, 'beneficiarios');

            // Realiza una consulta para obtener el beneficiario por su cédula
            const querySnapshot = await getDocs(query(beneficiarioCollection, where('cedula', '==', cedula)));

            if (querySnapshot.docs) {
                const beneficiarioDoc = querySnapshot.docs[0];
                const nombreBeneficiario = beneficiarioDoc.data().nombre;
                if (servicio === "Almuerzo") {
                    const fechaHoy = currentDate;
                    const arregloDias = beneficiarioDoc.data().dias;
                    const arregloFechas = arregloDias.map((timestamp) => {
                        return new Date(timestamp.seconds * 1000).toLocaleDateString('es-ES');
                    });
                    const arregloAlmuerzo = beneficiarioDoc.data().almuerzo;
                    console.log(arregloFechas);
                    console.log(beneficiarioDoc.data().almuerzo);

                    // Encuentra el índice de la fechaHoy en el arregloFechas
                    const indiceFechaHoy = arregloFechas.findIndex((fecha) => fecha === fechaHoy);

                    // Si se encuentra la fecha en el arreglo, actualiza el valor en arregloAlmuerzo
                    if (indiceFechaHoy !== -1) {
                        arregloAlmuerzo[indiceFechaHoy] = 1;

                        // Ahora puedes actualizar el documento en la base de datos si es necesario
                        await updateDoc(doc(beneficiarioCollection, beneficiarioDoc.id), {
                            almuerzo: arregloAlmuerzo
                        });
                    } else {
                        console.log('La fecha de hoy no se encontró en el arreglo de fechas.');
                    }
                    if (servicio == "Desayuno") {

                    }
                } else {
                    console.log('No se encontró un beneficiario con la cédula proporcionada');
                }
            }
        } catch (error) {
            console.error('Error al registrar asistencia por cédula:', error);
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
        console.log(idBeneficiario);
    }, []);

    const getCurrentDate = () => {
        const date = new Date();
        const day = (date.getDate());
        const month = (date.getMonth() + 1);
        const year = date.getFullYear();
        const formattedDate = `${day}/${month}/${year}`;
        setCurrentDate(formattedDate);
    };

    const addLeadingZero = (number) => {
        return number < 10 ? `0${number}` : number;
    };

    const convertirHoraStringToDate = (horaString) => {
        const [hours, minutes] = horaString.split(':').map(Number);
        const currentDate = new Date();
        currentDate.setHours(hours);
        currentDate.setMinutes(minutes);
        return currentDate;
    };

    const getCurrentHour = (inicioDesayuno, finalDesayuno, inicioAlmuerzo, finalAlmuerzo) => {
        consultarDatosPorConvenio();
        const currentDateTime = new Date();
        const currentHour = currentDateTime.getHours();
        const currentMinute = currentDateTime.getMinutes();
        const currentFormattedTime = `${currentHour}:${currentMinute < 10 ? '0' : ''}${currentMinute}`;
        const desayuno_hora = convertirHoraStringToDate(currentFormattedTime) >= convertirHoraStringToDate(inicioDesayuno) && convertirHoraStringToDate(currentFormattedTime) <= convertirHoraStringToDate(finalDesayuno);
        const almuerzo_hora = convertirHoraStringToDate(currentFormattedTime) >= convertirHoraStringToDate(inicioAlmuerzo) && convertirHoraStringToDate(currentFormattedTime) <= convertirHoraStringToDate(finalAlmuerzo);

        if (!(desayuno_hora || almuerzo_hora)) {
            Alert.alert(
                '¡Notificación!',
                '¡No puedes tomar asistencia fuera del horario permitido!',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            //navigation.navigate('Asistencia');
                        },
                    },
                ],
                { cancelable: false }
            );
            setServicio('Desayuno');
        } else {
            if (desayuno_hora) {
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
