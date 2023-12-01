import React, {useState} from 'react';
import {View,Text,StyleSheet,TextInput,Button,KeyboardAvoidingView,TouchableOpacity} from 'react-native';

const EditarPerfil = () => {
 const [nombre, setNombre] = useState('Juan');
 const [apellido, setApellido] = useState('Perez');
 const [institucion, setInstitucion] = useState('Kellog\'s');
 const [correo, setCorreo] = useState('persona@kellogs.com');

 const handleSubmit = () => {
    console.log('Datos guardados');
 };

 return (
    <KeyboardAvoidingView style={styles.container}>
      <Text style={styles.titulo}>Editar Perfil</Text>
      <TextInput
        style={styles.input}
        onChangeText={setNombre}
        value={nombre}
        placeholder="Nombre"
      />
      <TextInput
        style={styles.input}
        onChangeText={setApellido}
        value={apellido}
        placeholder="Apellido"
      />
      <TextInput
        style={styles.input}
        onChangeText={setInstitucion}
        value={institucion}
        placeholder="Institución"
      />
      <TextInput
        style={styles.input}
        onChangeText={setCorreo}
        value={correo}
        placeholder="Correo electronico"
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Guardar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.regresarButton}>
        <Text style={styles.buttonText}>Regresar</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
 );
};

const styles = StyleSheet.create({
 container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
 },
 titulo: {
    fontSize: 24,
    marginBottom: 20,
 },
 input: {
    borderWidth: 1,
    borderColor: 'black',
    width: '80%',
    padding: 10,
    marginBottom: 20,
 },
 button: {
    backgroundColor: 'black',
    padding: 10,
    width: '80%',
    marginBottom: 20,
 },
 buttonText: {
    color: 'white',
    textAlign: 'center',
 },
 regresarButton: {
    backgroundColor: 'grey',
    padding: 10,
    width: '80%',
 },
});

export default EditarPerfil;