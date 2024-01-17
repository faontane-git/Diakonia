import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const Info = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const handleOptionPress = (option) => {
    navigation.navigate(option);
  };
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
        <TouchableOpacity
          style={[styles.buttonContainer, { marginTop: 0, marginLeft: 140 }]}
          onPress={() => handleOptionPress('VerRegistro')}
        >
          <Text style={styles.buttonText}>Regresar</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Información</Text>
      <KeyboardAvoidingView style={styles.cuadro} behavior="padding" enabled>
        <View style={styles.contenedor}>
          <Text style={styles.textContainer}>Nombre</Text>
          <TextInput
            style={styles.input}
            value={route.params.nombre}
            editable={false}
          />
          <Text style={styles.textContainer}>Cédula</Text>
          <TextInput
            style={styles.input}
            value={route.params.cedula + ""}
            editable={false}
          />
          <Text style={styles.textContainer}>Sexo</Text>
          <TextInput
            style={styles.input}
            value={route.params.genero}
            editable={false}
          />
          <Text style={styles.textContainer}>Número</Text>
          <TextInput
            style={styles.input}
            value={route.params.numero_contacto + ""}
            editable={false}
          />
          <Text style={styles.textContainer}>Fecha de Nacimiento</Text>
          <TextInput
            style={styles.input}
            value={route.params.fecha_nacimiento}
            editable={false}
          />

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
  }, buttonContainer: {
    backgroundColor: '#890202',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
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
