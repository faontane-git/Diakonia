import React from 'react';
import { StyleSheet, View, Text, ScrollView, Dimensions, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';



const VerAsistencia = () => {
    const navigation = useNavigation();
    const data = {
        labels: ['Fabrizzio Ontaneda', 'Joffre Ramírez', 'Juan Pérez', 'Carlos López', 'Laura Martínez'],
        datasets: [
            {
                data: [2, 1, 2, 1, 0],
            },
        ],
    };
    const screenWidth = Dimensions.get('window').width;
    const handleOptionPress = (option) => {
        navigation.navigate(option);
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
            {/* Tabla de Datos */}
            <View style={styles.tableContainer}>
                <View style={[styles.tableRow, styles.tableCellBorder]}>
                    <Text style={[styles.txtNombre, styles.tableCellHeader, styles.tableCellBorder]}>Nombre</Text>
                    <Text style={[styles.txtDias, styles.tableCellHeader, styles.tableCellBorder]}>Días Asistidos</Text>
                </View>
                {data.labels.map((label, index) => (
                    <View key={index} style={[styles.tableRow, styles.tableRowBorder]}>
                        <Text style={[styles.tableCell, styles.tableCellBorder]}>{label}</Text>
                        <Text style={[styles.tableCell, styles.tableCellBorder]}>{data.datasets[0].data[index]}</Text>
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
    }, txtNombre: {
        marginLeft: 20,
    }, txtDias: {
        marginRight: 100,
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
    text: {
        fontSize: 16,
        color: '#333',
    }, tableContainer: {
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
});

export default VerAsistencia;