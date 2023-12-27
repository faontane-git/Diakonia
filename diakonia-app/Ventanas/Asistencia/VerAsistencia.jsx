import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const App = () => {
  const nombre = 'Fabrizzio Ontaneda';
  const institucion = 'Diakonía';
  const dataToEncode = `${nombre}\n${institucion}`;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Generador de Código QR</Text>
      <QRCode
        value={dataToEncode}
        size={200}
        color="black"
        backgroundColor="white"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
});

export default App;
