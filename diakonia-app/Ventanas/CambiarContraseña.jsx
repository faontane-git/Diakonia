import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native';

const CambiarContraseña = () => {
 const [newPassword, setNewPassword] = useState('');
 const [confirmPassword, setConfirmPassword] = useState('');

 const handleSubmit = () => {
    if (newPassword === confirmPassword) {
      // Procesar la contraseña y realizar las acciones necesarias
    } else {
      alert('Las contraseñas no coinciden');
    }
 };

 return (
    <View style={styles.container}>
      <Text style={styles.title}>Nueva Contraseña</Text>
      <TextInput
        style={styles.input}
        onChangeText={setNewPassword}
        value={newPassword}
        placeholder="Nueva Contraseña"
        secureTextEntry
      />
      <Text style={styles.title}>Cambiar Contraseña</Text>
      <TextInput
        style={styles.input}
        onChangeText={setConfirmPassword}
        value={confirmPassword}
        placeholder="Repetir Contraseña"
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Guardar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.backButton} onPress={() => alert('Regresar')}>
        <Text style={styles.buttonText}>Regresar</Text>
      </TouchableOpacity>
    </View>
 );
};

const styles = StyleSheet.create({
 container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
 },
 title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
 },
 input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
 },
 button: {
    backgroundColor: '#007BFF',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
 },
 buttonText: {
    color: 'white',
    fontSize: 18,
 },
 backButton: {
    backgroundColor: 'red',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    alignItems: 'center',
 },
});

export default CambiarContraseña;