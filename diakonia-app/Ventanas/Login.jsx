import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Modal, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import Home from './Home';

const Login = () => {
   const navigation = useNavigation();
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [errorModalVisible, setErrorModalVisible] = useState(false);
   const [errorMessage, setErrorMessage] = useState('');

   const handleLogin = () => {
      const auth = getAuth();
      console.log('Iniciando sesión con correo electrónico:', email);
      console.log('Iniciando sesión con contraseña:', password);

      signInWithEmailAndPassword(auth, email, password)
         .then((userCredential) => {
            navigation.navigate('Home');
         })
         .catch((error) => {
            setErrorMessage('¡El Correo o Contraseña\ningresado es incorrecto!\nVuelva a ingresar');
            setErrorModalVisible(true);
         });
   };

   const closeModal = () => {
      setErrorModalVisible(false);
   };

   return (
      <View style={styles.container}>
         <Image
            style={[styles.image, { marginTop: 0 }]}
            source={require('../assets/imagenes/logo-banco-alimentos.png')}
         />
         <Text style={styles.title}>
            Sistema de Gestión y Análisis de Impacto en Beneficiarios de Alimentos
         </Text>
         <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            onChangeText={setEmail}
            value={email}
         />
         <TextInput
            style={styles.input}
            placeholder="Contraseña"
            onChangeText={setPassword}
            value={password}
            secureTextEntry
         />
         <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Iniciar sesión</Text>
         </TouchableOpacity>

         {/* Modal para mostrar el mensaje de error */}
         <Modal
            visible={errorModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={closeModal}>
            <View style={styles.modalContainer}>
               <View style={styles.modalContent}>
                  <Text style={styles.modalText}>{errorMessage}</Text>
                  <Button title="OK" onPress={closeModal} />
               </View>
            </View>
         </Modal>
      </View>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F5FCFF',
   },
   title: {
      fontSize: 15,
      textAlign: 'center',
      margin: 10,
   },
   input: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 10,
      width: '80%',
      paddingLeft: 10,
   },
   button: {
      backgroundColor: '#890202',
      paddingHorizontal: 20,
      paddingVertical: 10,
      marginTop: 10,
      borderRadius: 5,
   },
   buttonText: {
      color: '#fff',
      fontSize: 16,
   },
   modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
   },
   modalContent: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
   },
   modalText: {
      fontSize: 16,
      marginBottom: 20,
   },
   image: {
      marginTop: 100,
      marginBottom: 10,
   },
});

export default Login;
