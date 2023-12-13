import React from 'react';
import {StyleSheet,View,Text,ScrollView,Dimensions,TouchableOpacity,Image}from 'react-native';
import { useNavigation } from '@react-navigation/native';



const Home = () => {
  const navigation = useNavigation();
  const screenWidth = Dimensions.get('window').width;
  const handleOptionPress = (option) => {
    navigation.navigate(option);
  };

  
 return (
    <View style={styles.container}>
      <View style={styles.imagesContainer}>
        <Image
          style={[styles.image, { marginTop: 0, marginLeft:-70}]} 
          source={require('../assets/imagenes/logoMenu-banco-alimentos.png')}
        />
        <TouchableOpacity onPress={() => handleOptionPress('Opciones')}>
        <Image
          style={[styles.image, { marginTop: 0, marginLeft:180}]} 
          source={require('../assets/imagenes/usuario-de-perfil.png')}
        />
        </TouchableOpacity>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Beneficiarios</Text>
        <Text style={styles.title}>Seleccione una opción</Text>
      </View>
      <ScrollView>
        <TouchableOpacity style={styles.option} onPress={() => handleOptionPress('Registrar')}>
          <Text style={[styles.text,{ color: 'white' }]}>Registrar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}  onPress={() => handleOptionPress('Asistencia')}>
          <Text style={[styles.text,{ color: 'white' }]}>Asistencia</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}  onPress={() => handleOptionPress('Seguimiento')}>
          <Text style={[styles.text,{ color: 'white' }]}>Seguimiento Nutricional</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => handleOptionPress('VerRegistro')} >
          <Text style={[styles.text,{ color: 'white' }]}>Ver Registro</Text>
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
textContainer:{
  paddingBottom:10
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