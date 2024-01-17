// Importa useState y useEffect si aún no lo has hecho
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, FlatList, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../AuthContext';
import DropDownPicker from 'react-native-dropdown-picker';

const VerRegistro = () => {
  const navigation = useNavigation();
  const [busqueda, setBusqueda] = useState('');
  const [nutrientes, setNutrientes] = useState([]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: 'Todos', value: 'Todos' },
    { label: 'Desayuno', value: 'Desayuno' },
    { label: 'Almuerzo', value: 'Almuerzo' },
  ]);
  const { institucionId } = useAuth();
  const { convenioId } = useAuth();
  const handleOptionPress = (option) => {
    navigation.navigate(option);
  };

  useEffect(() => {
    const obtenerDatos = async () => {
      const querydb = getFirestore();
      const beneficiariosCollection = collection(querydb, 'beneficiarios');
      const beneficiariosQuery = query(
        beneficiariosCollection,
        where('institucionId', '==', institucionId),
        where('convenioId', '==', convenioId)
      ); try {
        const querySnapshot = await getDocs(beneficiariosQuery);
        setNutrientes(querySnapshot.docs.map((benf) => ({ id: benf.id, ...benf.data() })));
      } catch (error) {
        console.error('Error al obtener documentos:', error);
      }
    };

    obtenerDatos();
  }, []);

  const buscar = (texto) => {
    setBusqueda(texto);
  };

  const filtrarNutrientes = (texto) => {
    return nutrientes.filter((nutriente) =>
      nutriente.nombre.toLowerCase().includes(texto.toLowerCase())
    );
  };

  const navegar = (item) => {
    navigation.navigate('Info', {
      nombre: item.nombre,
      cedula: item.cedula,
      fecha_nacimiento: new Date(item.fecha_nacimiento.seconds * 1000).toLocaleDateString('es-ES'),
      genero: item.genero,
      numero_contacto: item.numero_contacto,
      numero_de_personas_mayores_en_el_hogar: item.numero_de_personas_mayores_en_el_hogar,
      numero_de_personas_menores_en_el_hogar: item.numero_de_personas_menores_en_el_hogar
    });
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
      <Text style={styles.title}>Registro</Text>
      {/*
       ComboBox 
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        containerStyle={styles.dropdownContainer}
        style={styles.dropdown}
      />
      */}
      {/* TextInput para búsqueda */}
      <TextInput
        style={styles.buscador}
        placeholder="Buscar Nombre"
        onChangeText={buscar}
        value={busqueda}
      />

      <FlatList
        data={filtrarNutrientes(busqueda)}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.option} onPress={() => navegar(item)}>
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
  }, dropdown: {
    backgroundColor: 'white',
    color: 'black',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'black',
    width: 345,
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

export default VerRegistro;
