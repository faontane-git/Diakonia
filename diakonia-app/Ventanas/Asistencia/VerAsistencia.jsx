import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '../AuthContext';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

const VerAsistencia = () => {
    const { institucionId } = useAuth();
    const [data, setData] = useState([]);
    const [date, setDate] = useState(new Date());
    const [busqueda, setBusqueda] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [arregloNombresFechas, setArregloNombresFechas] = useState([]);

    const onChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDate(selectedDate);
        }
    };

    const buscar = (texto) => {
        setBusqueda(texto);
    };

    const consulta = async () => {
        const querydb = getFirestore();
        const beneficiariosCollection = collection(querydb, 'beneficiarios');
        const beneficiariosQuery = query(
            beneficiariosCollection,
            where('institucionId', '==', institucionId)
        );

        try {
            const querySnapshot = await getDocs(beneficiariosQuery);
            const beneficiariosData = querySnapshot.docs.map((benf) => ({
                id: benf.id,
                ...benf.data(),
            }));

            setData(beneficiariosData);

            const arregloNombresFechas = beneficiariosData.map((item) => ({
                nombre: item.nombre,
                fechas: item.dias.map((fecha) => convertirTimestampAFecha(fecha)),
            }));
            setArregloNombresFechas(arregloNombresFechas);
        } catch (error) {
            console.error('Error al obtener documentos:', error);
        }
    };

    const convertirTimestampAFecha = (timestamp) => {
        const fecha = new Date(timestamp.seconds * 1000);
        return fecha.toLocaleDateString('es-ES');
    };

    useEffect(() => {
        consulta();
    }, []);

    const convertirFormato = (date) => {
        const formattedDate = new Intl.DateTimeFormat('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }).format(date);
        return formattedDate;
    };

    const asistenciasFechaSeleccionada = arregloNombresFechas.filter((item) =>
        item.fechas.includes(convertirFormato(date))
    );

    const filtroPorNombre = arregloNombresFechas.filter(
        (item) => item.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

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

            <View>
                <TouchableOpacity
                    onPress={() => setShowDatePicker(true)}
                    style={{
                        backgroundColor: '#890202',
                        padding: 10,
                        marginLeft: '10%',
                        borderRadius: 5,
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '80%',
                    }}
                >
                    <Text style={{ fontSize: 12, color: 'white' }}>
                        Seleccione una fecha
                    </Text>
                </TouchableOpacity>

                {showDatePicker && (
                    <DateTimePicker
                        value={date}
                        mode="date"
                        display="default"
                        onChange={onChange}
                    />
                )}
            </View>
            <Text style={{ marginTop: '5%', marginLeft: '5%' }}>Fecha seleccionada: {convertirFormato(date)}</Text>

            {/* TextInput para búsqueda */}
            <TextInput
                style={styles.buscador}
                placeholder="Buscar Nombre"
                onChangeText={buscar}
                value={busqueda}
            />

            {/* Tabla de Datos */}
            <View style={styles.tableContainer}>
                <Text style={styles.tableTitle}>Beneficiarios</Text>
                <View style={[styles.tableRow, styles.tableHeader]}>
                    <Text style={[styles.tableCell, styles.tableCellHeader]}>Nombre</Text>
                    <Text style={[styles.tableCell, styles.tableCellHeader]}>Asistencia</Text>
                </View>
                {filtroPorNombre.map((item, index) => (
                    <View key={index} style={styles.tableRow}>
                        <Text style={[styles.tableCell, styles.tableCellHeader]}>{item.nombre}</Text>
                        <Text style={[
                            styles.tableCell,
                            {
                                color: asistenciasFechaSeleccionada
                                    .find((asistencia) => asistencia.nombre === item.nombre)
                                    ?.fechas.includes(convertirFormato(date))
                                    ? 'black'  // Color por defecto si es 'Sí'
                                    : 'red',   // Color rojo si es 'No'
                            }
                        ]}>
                            {asistenciasFechaSeleccionada
                                .find((asistencia) => asistencia.nombre === item.nombre)
                                ?.fechas.includes(convertirFormato(date))
                                ? 'Sí'
                                : 'No'}
                        </Text>
                    </View>
                ))}

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
    title: {
        fontSize: 18,
        color: '#333',
        fontWeight: 'bold',
        alignSelf: 'center',
        textAlign: 'center',
    },
    txtNombre: {
        marginLeft: 20,
    },
    txtDias: {
        marginRight: 100,
    },
    textContainer: {
        paddingBottom: 10,
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
    text: {
        fontSize: 16,
        color: '#333',
    },
    tableContainer: {
        marginTop: 20,
        paddingHorizontal: 20,
    },
    tableTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    tableCellHeader: {
        fontWeight: 'bold',
    },
    tableCell: {
        flex: 1,
        marginLeft: 4,
    },
    tableCellBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    tableRowBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    }, 
    buscador: {
        backgroundColor: 'white',
        color: 'black',
        paddingHorizontal: 20,
        paddingVertical: 5,
        borderRadius: 10,
        marginHorizontal: 20,
        marginTop: 5,
        borderWidth: 1,
        borderColor: 'black',
    },
});

export default VerAsistencia;
