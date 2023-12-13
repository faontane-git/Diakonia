import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const CambiarContraseña = () => {
   const navigation = useNavigation();
   const [newPassword, setNewPassword] = useState('');
   const [confirmPassword, setConfirmPassword] = useState('');

   const onPressRegresar = () => {
      navigation.navigate('Opciones');
   
   }
   const handleSubmit = () => {
      if (newPassword === confirmPassword) {
         // Procesar la contraseña y realizar las acciones necesarias
      } else {
         alert('Las contraseñas no coinciden');
      }
   };

   return (
      <View style={styles.container}>
         <View style={styles.imagesContainer}>
            <Image
               style={[styles.image, { marginTop: 0, marginLeft: -70 }]}
               source={require('../../assets/imagenes/logoMenu-banco-alimentos.png')}
            />
         </View>
         <Text style={styles.title}>Cambiar Contraseña</Text>
         <KeyboardAvoidingView style={styles.cuadro} behavior="padding" enabled>
            <View style={styles.contenedor}>
               <Text style={styles.textContainer}>Nueva Contraseña</Text>
               <TextInput
                  style={styles.input}
                  onChangeText={setNewPassword}
                  value={newPassword}
                  secureTextEntry
               />
               <Text style={styles.textContainer}>Cambiar Contraseña</Text>
               <TextInput
                  style={styles.input}
                  onChangeText={setConfirmPassword}
                  value={confirmPassword}
                  secureTextEntry
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

export default CambiarContraseña;