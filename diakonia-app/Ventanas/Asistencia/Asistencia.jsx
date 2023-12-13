import React from 'react';
import { StyleSheet, View, Text, ScrollView, Dimensions, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';



const Asistencia = () => {
    const navigation = useNavigation();
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
                <Text style={styles.title}>Seleccione una opción</Text>
            </View>
            <ScrollView style={styles.optionContainer}>
                <TouchableOpacity style={styles.option} onPress={() => handleOptionPress('TomarAsistencia')}>
                    <Text style={[styles.text, { color: 'white' }]}>Tomar Asistencias</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.option} onPress={() => handleOptionPress('VerAsistencia')}>
                    <Text style={[styles.text, { color: 'white' }]}>Ver Asistencia</Text>
                </TouchableOpacity>
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
    text: {
        fontSize: 16,
        color: '#333',
    },
});

export default Asistencia;