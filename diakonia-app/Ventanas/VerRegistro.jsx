import React, { useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import SearchableDropdown from 'react-native-searchable-dropdown';

const VerRegistro = () => {
   
   return (
      <View>
      </View>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#F5FCFF',
      paddingVertical: 30,
   },
    searchableDropdownTextInput: {
      color: 'red',
   },
   imagesContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 50,
   },
   image: {
      width: 120,
      height: 120,
   },
   title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
   },
   serviceContainer: {
      padding: 10,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: '#e6e6f0',
      borderRadius: 10,
   },
   dropdown: {
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: '#e6e6f0',
      borderRadius: 10,
   },
   item: {
      padding: 10,
      marginTop: 2,
      backgroundColor: '#fff',
      borderBottomWidth: 1,
      borderBottomColor: '#e6e6f0',
   },
   itemsContainer: {
      borderTopWidth: 1,
      borderTopColor: '#e6e6f0',
   },
   searchableDropdownTextInput: {
      fontSize: 14,
      padding: 10,
      borderWidth: 1,
      borderColor: '#e6e6f0',
      borderRadius: 10,
   },
   selectedText: {
      fontSize: 16,
      fontWeight: 'bold',
      marginTop: 10,
   },
});

export default VerRegistro;