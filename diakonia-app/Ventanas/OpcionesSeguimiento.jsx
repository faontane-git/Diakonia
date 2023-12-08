import React from 'react';
import {StyleSheet,View,Text,ScrollView,Dimensions,TouchableOpacity,Image}from 'react-native';
import { useNavigation } from '@react-navigation/native';

const OpcionesSeguimiento = () => {
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
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Seguimiento Nutricional</Text>
        <Text style={styles.title}>Joffre Ramírez</Text>
      </View>
      <ScrollView>
        <TouchableOpacity style={styles.option} onPress={() => handleOptionPress('Peso')}>
          <Text style={[styles.text,{ color: 'white' }]}>Peso</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}  onPress={() => handleOptionPress('Talla')}>
          <Text style={[styles.text,{ color: 'white' }]}>Talla</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}  onPress={() => handleOptionPress('Imc')}>
          <Text style={[styles.text,{ color: 'white' }]}>Imc</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => handleOptionPress('Hemoglobina')} >
          <Text style={[styles.text,{ color: 'white' }]}>Hemoglobina</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => handleOptionPress('Regresar')} >
          <Text style={[styles.text,{ color: 'white' }]}>Regresar</Text>
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

export default OpcionesSeguimiento;