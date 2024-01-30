import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Modal, Button, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc,collection, getDocs, query, where,getDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';
import bcrypt from 'react-native-bcrypt';

const Login = () => {
  const navigation = useNavigation();
  const { login } = useAuth();
  const { setInstitucionId, setInstitucionN, setConvenioN, setConvenioId } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);

    const auth = getAuth();
    const db = getFirestore();

    try {
      const usersCollection = collection(db, 'usuarios');
      const q = query(usersCollection, where('correo', '==', email));

      const querySnapshot = await getDocs(q);

      if (querySnapshot.size > 0) {
        const userData = querySnapshot.docs[0].data();
        const userRole = userData.rol;
        const institucionId = userData.institucionId;
        const institucionN = userData.institucionN;
        const convenioId = userData.convenioId;
        const convenioN = userData.convenioN;
        // Retrieve data from "instituciones" collection using institucionId
        const institucionesCollection = collection(db, 'instituciones');
        const institucionDoc = await getDoc(doc(institucionesCollection, institucionId));
        const institucionData = institucionDoc.data();
        if(!institucionData.activo){
          Alert.alert('¡Notificación','¡La institución está inactivada, consulte con su administrador!');
          return true;
        }

        const passwordMatch = bcrypt.compareSync(password, userData.contraseña);

        if (passwordMatch) {
          const usuario = {
            id: querySnapshot.docs[0].id,
            email: email,
            rol: userRole,
          };

          setInstitucionId(institucionId);
          setInstitucionN(institucionN);
          setConvenioId(convenioId);
          setConvenioN(convenioN);

          const conveniosCollection = collection(db, 'convenios');
          const convenioDoc = await getDocs(conveniosCollection).then((snapshot) => {
            return snapshot.docs.find((doc) => doc.id === convenioId);
          });

          if (convenioDoc && convenioDoc.exists()) {
            const convenioData = convenioDoc.data();
            const convenioActivo = convenioData.activo;

            if (!convenioActivo) {
              setErrorMessage(`¡El convenio: ${convenioN} ya no se encuentra activo!`);
              setErrorModalVisible(true);
              return;
            }
          }

          if (userRole !== 'Registrador') {
            setErrorMessage('¡No tienes permisos para iniciar sesión en esta aplicación!');
            setErrorModalVisible(true);
          } else {
            Alert.alert('Bienvenido ' + userData.nombre, '¡Has iniciado sesión exitosamente!');
            navigation.navigate('Home');
          }
        } else {
          setErrorMessage('¡Contraseña incorrecta. Inicio de sesión fallido!');
          setErrorModalVisible(true);
        }
      } else {
        setErrorMessage('¡El Correo o Contraseña ingresado es incorrecto!\nVuelva a ingresar');
        setErrorModalVisible(true);
      }
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
      setErrorMessage('¡El Correo o Contraseña ingresado es incorrecto!\nVuelva a intentarlo.');
      setErrorModalVisible(true);
    } finally {
      setLoading(false);
    }
  };


  const closeModal = () => {
    setErrorModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#890202" />
      ) : (
        <>
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

          <Modal visible={errorModalVisible} animationType="slide" transparent={true} onRequestClose={closeModal}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>{errorMessage}</Text>
                <Button title="OK" onPress={closeModal} />
              </View>
            </View>
          </Modal>
        </>
      )}
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
