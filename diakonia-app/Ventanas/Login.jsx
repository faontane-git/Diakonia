import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet,Image} from 'react-native';  
import { useNavigation } from '@react-navigation/native';
import Home from './Home';
 
 
const Login = () => {

 const navigation = useNavigation();
 const [email, setEmail] = React.useState('');
 const [password, setPassword] = React.useState('');

 const handleLogin = () => {
    console.log('Iniciando sesión con correo electrónico:', email);
    console.log('Iniciando sesión con contraseña:', password);
     if (email === 'admin' && password === 'admin') {
        navigation.navigate('Home');  
    }
 };

 return (
    <View style={styles.container}>
     <Image
        style={[styles.image, { marginTop: 0 }]} 
        source={require('../assets/imagenes/logo-banco-alimentos.png')}
      />
      <Text style={styles.title}>Sistema de Gestión y Análisis de Impacto en Beneficiarios de Alimentos</Text>
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
  redBarContainer: {
   },
  redBar: {
    width: '100%',
    height: 100,
    backgroundColor: 'red',
  }, 
  image: {
    marginTop: 100,  
    marginBottom: 10,  
  },
 });

 
export default Login;