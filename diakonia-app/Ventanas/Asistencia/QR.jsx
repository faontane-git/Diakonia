import React from 'react';
import { View, Text } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const QR = () => {
  const datos = {
    nombre: 'Eris Andrade',
    institucion: 'Diakonía',
    iDinstitucion: 'HPWbQYOQ7fZKHu4rb198',
  };

  const textoQR = JSON.stringify(datos);

  return (
    <View>
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

export default QR;
