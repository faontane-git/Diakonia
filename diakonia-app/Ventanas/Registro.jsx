import React, { Component } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import FingerprintScanner from 'react-native-fingerprint-scanner';

export default class Registro extends Component {
 state = {
    isAuthenticating: false,
 };

 handleAuthenticationAttempted = () => {
    this.setState({ isAuthenticating: true });
 };

 handleAuthenticationSucceeded = () => {
    this.setState({ isAuthenticating: false });
    // Aquí puedes continuar con la lógica de tu aplicación
 };

 handleAuthenticationFailed = () => {
    this.setState({ isAuthenticating: false });
    // Puedes mostrar un mensaje de error al usuario, o intentar nuevamente
 };

 authenticate = () => {
    FingerprintScanner
      .authenticate({ onAttempt: this.handleAuthenticationAttempted })
      .then(() => {
        this.handleAuthenticationSucceeded();
      })
      .catch((error) => {
        this.handleAuthenticationFailed();
      });
 };

 render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <TouchableOpacity onPress={this.authenticate}>
          <Text>Autenticar</Text>
        </TouchableOpacity>
      </View>
    );
 }
}

