import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Image, TouchableOpacity } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../AuthContext';

const TomarHuella = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const { updateScannedData } = useAuth();
  const navigation = useNavigation();
  const handleOptionPress = (option) => {
    navigation.navigate(option);
  };

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ data }) => {
    console.log(data);
    setScanned(true);
    const parsedData = JSON.parse(data);
    updateScannedData({
      nombre: parsedData.nombre || '',
      institucion: parsedData.institucionN || '',
      iDinstitucion: parsedData.Institucion_ID || '',
      convenio: parsedData.convenioN || '',
      convenioId: parsedData.convenioId || '',
      cedula: parsedData.cedula || '',
    });
    Alert.alert(
      '¡Notificación!',
      '¡Datos escaneados con éxito!',
      [
        {
          text: 'OK',
          onPress: () => navigation.navigate('TomarAsistencia'),
        },
      ]
    );
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.imagesContainer}>
        <Image
          style={[styles.image, { marginTop: 0, marginLeft: -70 }]}
          source={require('../../assets/imagenes/logoMenu-banco-alimentos.png')}
        />
        <TouchableOpacity
          style={[styles.buttonContainer, { marginTop: 0, marginLeft: 140 }]}
          onPress={() => handleOptionPress('TomarAsistencia')}
        >
          <Text style={styles.buttonText}>Regresar</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>¡Escanea el código QR!</Text>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={styles.barCodeScanner}
        />
      </View>
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  }, buttonContainer: {
    backgroundColor: '#890202',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  }, buttonText: {
    color: 'white',
  },
  barCodeScanner: {
    width: 500,
    height: 500,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 50,
  },
});

export default TomarHuella;
