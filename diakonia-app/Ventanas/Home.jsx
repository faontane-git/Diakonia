import React from 'react';
import { StyleSheet, View, Text, ScrollView, Dimensions, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from './AuthContext';


const Home = () => {
  const navigation = useNavigation();
  const { institucionId } = useAuth();
  const { institucionN } = useAuth();
  const { convenioN } = useAuth();
  const screenWidth = Dimensions.get('window').width;
  const handleOptionPress = (option) => {
    navigation.navigate(option);
  };


  return (
    <View style={styles.container}>
      <View style={styles.imagesContainer}>
        <Image
          style={[styles.image, { marginTop: 0, marginLeft: -70 }]}
          source={require('../assets/imagenes/logoMenu-banco-alimentos.png')}
        />
        <TouchableOpacity onPress={() => handleOptionPress('Opciones')}>
          <Image
            style={[styles.image, { marginTop: 0, marginLeft: 160 }]}
            source={require('../assets/imagenes/usuario-de-perfil.png')}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{institucionN}</Text>
        <Text style={styles.title}>{convenioN}</Text>
        <Text style={styles.title}>Seleccione una opción</Text>
      </View>
      <ScrollView>
        {/*
        <TouchableOpacity style={styles.option} onPress={() => handleOptionPress('Registrar')}>
          <Text style={[styles.text, { color: 'white' }]}>Registrar</Text>
        </TouchableOpacity>
        */}
        <TouchableOpacity style={styles.option} onPress={() => handleOptionPress('Asistencia')}>
          <Text style={[styles.text, { color: 'white' }]}>Asistencia</Text>
          <Image
            style={{ width: 50, height: 50, marginLeft: 250, marginTop: -35 }}
            source={require('../assets/imagenes/asistencia.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => handleOptionPress('Seguimiento')}>
          <Text style={[styles.text, { color: 'white' }]}>Seguimiento Nutricional</Text>
          <Image
            style={{ width: 50, height: 50, marginLeft: 250, marginTop: -35 }}
            source={require('../assets/imagenes/seguimientoNutricional.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => handleOptionPress('VerRegistro')} >
          <Text style={[styles.text, { color: 'white' }]}>Ver Registros</Text>
          <Image
            style={{ width: 50, height: 50, marginLeft: 250, marginTop: -35 }}
            source={require('../assets/imagenes/verRegistros.png')}
          />
        </TouchableOpacity>
      </ScrollView>
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
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
});

export default Home;