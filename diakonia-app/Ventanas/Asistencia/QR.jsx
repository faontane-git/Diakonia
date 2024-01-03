import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const QR = () => {
  const datos = {
    nombre: 'Eris Andrade',
    institucion: 'Diakonía',
    iDinstitucion: 'HPWbQYOQ7fZKHu4rb198',
    idBeneficiario: '5vsGEsza5kLXwWAdyOQu'
  };

  const textoQR = JSON.stringify(datos);

  return (
    <View style={styles.container}>
      <QRCode
        value={textoQR}
        size={200} // Tamaño del código QR
        color="black" // Color del código QR
        backgroundColor="white" // Color de fondo del código QR
      />
      <Text>{textoQR}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default QR;
