import React from 'react';
import { SafeAreaView } from 'react-native';
import RegisterSuccessWindow from './RegisterSuccessWindow';

const Exito = () => {
 const handlePress = () => {
    console.log('Ir a Perfil');
 };

 return (
    <SafeAreaView>
      <RegisterSuccessWindow onPress={handlePress} />
    </SafeAreaView>
 );
};

export default Exito;