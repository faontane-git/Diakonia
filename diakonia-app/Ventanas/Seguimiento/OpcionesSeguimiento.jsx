import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Dimensions, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';


const OpcionesSeguimiento = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [pesos, setPeso] = useState([]);
  const [fechas, setFecha] = useState([]);
  const [hgbs, setHGB] = useState([]);
  const [tallas, setTalla] = useState([]);

  const { nombreBeneficiario } = route.params;
  const { idBeneficiario } = route.params;

  useEffect(() => {
    const obtenerDatos = async () => {
      const querydb = getFirestore();
      const beneficiariosCollection = collection(querydb, 'beneficiarios');
      const beneficiariosQuery = query(beneficiariosCollection, where('cedula', '==', idBeneficiario));
      try {
        const querySnapshot = await getDocs(beneficiariosQuery);
        const beneficiarioData = querySnapshot.docs.map((benf) => ({ id: benf.id, ...benf.data() }))[0];
        // Obtener fechas de seguimiento y pesos del beneficiario
        if (beneficiarioData.fechasSeguimiento) {
          const fechasSeguimiento = beneficiarioData.fecha_seguimiento.map((timestamp) => {
            return new Date(timestamp.seconds * 1000).toLocaleDateString('es-ES');
          });

          const peso = beneficiarioData.pesos;
          const hgb = beneficiarioData.hgb;
          const talla = beneficiarioData.talla;


          setFecha(fechasSeguimiento);
          setPeso(peso);
          setHGB(hgb);
          setTalla(talla);
        }else{
          setFecha([0]);
          setPeso([0]);
          setHGB([0]);
          setTalla([0]);
        }

      } catch (error) {
        console.error('Error al obtener documentos:', error);
      }
    };
    obtenerDatos();
  }, []);


  const screenWidth = Dimensions.get('window').width;
  const handleOptionPressH = (option) => {
    navigation.navigate(option);
  };

  const handleOptionPress = (option) => {
    if (option === 'Peso') {
      navigation.navigate(option, { nombreBeneficiario, fechas, pesos });
    } else if (option === 'Talla') {
      navigation.navigate(option, { nombreBeneficiario, fechas, tallas });
    } else if (option === 'Hemoglobina') {
      navigation.navigate(option, { nombreBeneficiario, fechas, hgbs });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imagesContainer}>
        <Image
          style={[styles.image, { marginTop: 0, marginLeft: -70 }]}
          source={require('../../assets/imagenes/logoMenu-banco-alimentos.png')}
        />
        <TouchableOpacity
          style={[styles.buttonContainer, { marginTop: 0, marginLeft: 140 }]}
          onPress={() => handleOptionPressH('Seguimiento')}
        >
          <Text style={styles.buttonText}>Regresar</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Seguimiento Nutricional</Text>
        <Text style={styles.title}>{nombreBeneficiario}</Text>
      </View>
      <ScrollView>
        <TouchableOpacity style={styles.option} onPress={() => handleOptionPress('Peso')}>
          <Text style={[styles.text, { color: 'white', textAlign: 'center' }]}>Peso</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => handleOptionPress('Talla')}>
          <Text style={[styles.text, { color: 'white', textAlign: 'center' }]}>Talla</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => handleOptionPress('Hemoglobina')} >
          <Text style={[styles.text, { color: 'white', textAlign: 'center' }]}>Hemoglobina</Text>
        </TouchableOpacity>
        {/*  
        <TouchableOpacity style={styles.option} onPress={() => handleOptionPress('Regresar')} >
          <Text style={[styles.text, { color: 'white', textAlign: 'center' }]}>Regresar</Text>
        </TouchableOpacity>
        */}
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
  textContainer: {
    paddingBottom: 10
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
  }, buttonContainer: {
    backgroundColor: '#890202',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  }, buttonText: {
    color: 'white',
  },
});

export default OpcionesSeguimiento;
