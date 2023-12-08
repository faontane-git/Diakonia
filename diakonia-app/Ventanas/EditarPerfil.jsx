import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, KeyboardAvoidingView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const EditarPerfil = () => {
  const navigation = useNavigation();
  const [nombre, setNombre] = useState('Juan');
  const [apellido, setApellido] = useState('Perez');
  const [institucion, setInstitucion] = useState('Kellog\'s');
  const [correo, setCorreo] = useState('persona@kellogs.com');

  const onPressRegresar = () => {
    navigation.navigate('Opciones');
  }

  const handleSubmit = () => {
    console.log('Datos guardados');
  };

  return (
    <View style={styles.container}>
      <View style={styles.imagesContainer}>
        <Image
          style={[styles.image, { marginTop: 0, marginLeft: -70 }]}
          source={require('../assets/imagenes/logoMenu-banco-alimentos.png')}
        />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>Editar Perfil</Text>
      </View>

      <KeyboardAvoidingView style={styles.cuadro} behavior="padding" enabled>
        <View style={styles.contenedor}>
          <Text style={styles.titulo}>Nombre</Text>
          <TextInput
            style={styles.input}
            onChangeText={setNombre}
            value={nombre}
            placeholder="Nombre"
          />
          <Text style={styles.titulo}>Apellido</Text>
          <TextInput
            style={styles.input}
            onChangeText={setApellido}
            value={apellido}
            placeholder="Apellido"
          />
          <Text style={styles.titulo}>Institución</Text>
          <TextInput
            style={styles.input}
            onChangeText={setInstitucion}
            value={institucion}
            placeholder="Institución"
            editable={false}
          />
          <Text style={styles.titulo}>Correo</Text>
          <TextInput
            style={styles.input}
            onChangeText={setCorreo}
            value={correo}
            placeholder="Correo electrónico"
            editable={false} 
          />
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Guardar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.regresarButton} onPress={onPressRegresar}>
            <Text style={styles.buttonText}>Regresar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    fontSize: 24,
    textAlign: 'center',
    margin: 10,
  },
  cuadro: {
   
  },
  contenedor: {
    alignItems: 'flex-start', // Cambié de 'center' a 'flex-start'
    paddingHorizontal: 20, // Agregué un padding para mejorar el diseño
  },
  titulo: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: 'black',
    width: '100%', // Cambié de '80%' a '100%'
    padding: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#890202',
    padding: 10,
    width: '100%', // Cambié de '80%' a '100%'
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  regresarButton: {
    backgroundColor: '#890202',
    padding: 10,
    width: '100%', // Cambié de '80%' a '100%'
  },
});

export default EditarPerfil;
