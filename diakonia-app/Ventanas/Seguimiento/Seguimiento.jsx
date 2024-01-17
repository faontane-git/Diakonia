import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, FlatList, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../AuthContext';

const Seguimiento = () => {
  const navigation = useNavigation();
  const [busqueda, setBusqueda] = useState('');
  const [nutrientes, setNutrientes] = useState([]);
  const { institucionId } = useAuth();
  const { convenioId } = useAuth();
  const handleOptionPress = (option) => {
    navigation.navigate(option);
  };
  const buscar = (texto) => {
    setBusqueda(texto);
  };

  useEffect(() => {
    const obtenerDatos = async () => {
      const querydb = getFirestore();
      const beneficiariosCollection = collection(querydb, 'beneficiarios');
      const beneficiariosQuery = query(
        beneficiariosCollection,
        where('institucionId', '==', institucionId),
        where('convenioId', '==', convenioId)
      );
      try {
        const querySnapshot = await getDocs(beneficiariosQuery);
        setNutrientes(querySnapshot.docs.map((benf) => ({ id: benf.id, ...benf.data() })));
      } catch (error) {
        console.error('Error al obtener documentos:', error);
      }
    };

    obtenerDatos();
  }, []);

  const filtrarNutrientes = (texto) => {
    return nutrientes.filter((nutriente) =>
      nutriente.nombre.toLowerCase().includes(texto.toLowerCase())
    );
  };

  const navegar = (nombreBeneficiario, idBeneficiario) => {
    console.log(idBeneficiario);
    navigation.navigate('OpcionesSeguimiento', { nombreBeneficiario, idBeneficiario });
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
        <Text style={styles.title}>Seguimiento Nutricional</Text>
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
          <TouchableOpacity style={styles.option} onPress={() => navegar(item.nombre, item.cedula)}>
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
