import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, FlatList, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Seguimiento = () => {
  const navigation = useNavigation();
  const [busqueda, setBusqueda] = useState('');
  const [nutrientes, setNutrientes] = useState([
    { id: 1, nombre: 'Fabrizzio Ontaneda' },
    { id: 2, nombre: 'Joffre Ramírez' },
    { id: 3, nombre: 'Juan Pérez' },
    { id: 4, nombre: 'Carlos López' },
    { id: 5, nombre: 'Laura Martínez' },
  ]);

  const buscar = (texto) => {
    setBusqueda(texto);
  };

  const filtrarNutrientes = (texto) => {
    return nutrientes.filter((nutriente) =>
      nutriente.nombre.toLowerCase().includes(texto.toLowerCase())
    );
  };

  const navegar = () => {
    navigation.navigate('OpcionesSeguimiento');
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
        <Text style={styles.title}>Registrar Beneficiario</Text>
      </View>
      <TextInput
        style={styles.buscador}
        placeholder="Buscar Nombre"
        onChangeText={buscar}
        value={busqueda}
      />
      <FlatList
        data={filtrarNutrientes(busqueda)}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.option} onPress={() => navegar()}>
            <Text style={[styles.text, { color: 'white' }]}>{item.nombre}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
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
  buscador: {
    backgroundColor: 'white',
    color: 'black',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'black',
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
  }, buttonContainer: {
    backgroundColor: '#890202',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  }, buttonText: {
    color: 'white',
  },
});

export default Seguimiento;
