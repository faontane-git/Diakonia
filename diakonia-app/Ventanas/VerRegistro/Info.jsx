import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Info = () => {
  const navigation = useNavigation();
  const [confirmPassword, setConfirmPassword] = useState('');
  const [hemoglobina, setHemoglobina] = useState('');

  const onPressRegresar = () => {
    navigation.navigate('VerRegistro');
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.imagesContainer}>
        <Image
          style={[styles.image, { marginTop: 0, marginLeft: -70 }]}
          source={require('../../assets/imagenes/logoMenu-banco-alimentos.png')}
        />
      </View>
      <Text style={styles.title}>Información</Text>
      <KeyboardAvoidingView style={styles.cuadro} behavior="padding" enabled>
        <View style={styles.contenedor}>
          <Text style={styles.textContainer}>Nombre</Text>
          <TextInput
            style={styles.input}
            value="Fabrizzio"
            editable={false}
          />
          <Text style={styles.textContainer}>Apellido</Text>
          <TextInput
            style={styles.input}
            value="Ontaneda"
            editable={false}
          />
          <Text style={styles.textContainer}>Institución</Text>
          <TextInput
            style={styles.input}
            value="Kellog's"
            editable={false}
          />
          <Text style={styles.textContainer}>Sexo</Text>
          <TextInput
            style={styles.input}
            value="Masculino"
            editable={false}
          />
          <Text style={styles.textContainer}>Fecha de Nacimiento</Text>
          <TextInput
            style={styles.input}
            value="2000-08-26"
            editable={false}
          />
          <Text style={styles.textContainer}>Peso(KG)</Text>
          <TextInput
            style={styles.input}
            value="75"
            editable={false}
          />
          <Text style={styles.textContainer}>Altura(CM)</Text>
          <TextInput
            style={styles.input}
            value="1.78"
            editable={false}
          />
          <Text style={styles.textContainer}>Hemoglobina</Text>
          <TextInput
            style={styles.input}
            value="100"
            editable={false}
          />
          <TouchableOpacity style={styles.regresarButton} onPress={onPressRegresar}>
            <Text style={styles.buttonText}>Regresar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
  contenedor: {
    alignItems: 'flex-start',
    paddingHorizontal: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'black',
    width: '100%',
    padding: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  regresarButton: {
    backgroundColor: '#890202',
    padding: 10,
    width: '100%',
  },
});

export default Info;
