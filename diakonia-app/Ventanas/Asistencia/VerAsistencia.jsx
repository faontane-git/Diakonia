import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../AuthContext';
import { getFirestore, collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import DropDownPicker from 'react-native-dropdown-picker';

const VerAsistencia = () => {
  const { institucionId } = useAuth();
  const { convenioId, convenioN } = useAuth();
  const [data, setData] = useState([]);
  const [convenioData, setConvenioData] = useState([]);
  const [date, setDate] = useState(new Date());
  const [busqueda, setBusqueda] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [arregloFechas, setArregloNombresFechas] = useState([]);
  const [arregloBeneficiarios, setArregloBeneficiario] = useState([]);
  const [asistenciasIndex, setIndice] = useState(-1);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: 'Desayuno', value: 'Desayuno' },
    { label: 'Almuerzo', value: 'Almuerzo' },
  ]);

  const handleOptionPress = (option) => {
    navigation.navigate(option);
  };

  useEffect(() => {
    // Esta función se ejecutará al montar el componente
    const cargarDatos = async () => {
      setLoading(true);

      await consulta();

      // Actualiza asistenciasIndex según la nueva fecha seleccionada
      const nuevaFechaSeleccionada = convertirFormato(date);
      const nuevoIndice = arregloFechas.indexOf(nuevaFechaSeleccionada);
      setIndice(nuevoIndice);

      setLoading(false);
    };

    cargarDatos(); // Llama a la función al montar el componente
  }, []); // El array vacío asegura que este efecto solo se ejecute al montar el componente

  const onChange = async (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setLoading(true);
      setDate(selectedDate);
      await consulta();
      const nuevaFechaSeleccionada = convertirFormato(selectedDate);
      const nuevoIndice = arregloFechas.indexOf(nuevaFechaSeleccionada);
      setIndice(nuevoIndice);
      setLoading(false);
    }
  };

  const buscar = (texto) => {
    setBusqueda(texto);
  };

  const consulta = async () => {
    const querydb = getFirestore();
    const beneficiariosCollection = collection(querydb, 'beneficiarios');
    const beneficiariosQuery = query(
      beneficiariosCollection,
      where('institucionId', '==', institucionId),
      where('convenioId', '==', convenioId)
    );
    try {
      const querySnapshot = await getDocs(beneficiariosQuery);
      const beneficiariosData = querySnapshot.docs.map((benf) => ({
        id: benf.id,
        ...benf.data(),
      }));

      setData(beneficiariosData);

      for (const beneficiario of beneficiariosData) {
        await consultaBeneficiario(beneficiario.id);
      }

      const conveniosCollection = collection(querydb, 'convenios');
      const idEspecifico = convenioId;
      const convenioDocRef = doc(conveniosCollection, idEspecifico);
      const convenioDocSnapshot = await getDoc(convenioDocRef);

      if (convenioDocSnapshot.exists()) {
        const convenioData = {
          id: convenioDocSnapshot.id,
          ...convenioDocSnapshot.data(),
        };
        setConvenioData([convenioData]);

        const listaNombresFechas = convenioData.dias.map((fecha) =>
          convertirTimestampAFecha(fecha)
        );
        setArregloNombresFechas(listaNombresFechas);
      } else {
        console.log('No se encontró ningún documento con el ID especificado.');
      }
    } catch (error) {
      console.error('Error al obtener documentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const consultaBeneficiario = async (beneficiarioId) => {
    const querydb = getFirestore();
    const beneficiarioRef = doc(querydb, 'beneficiarios', beneficiarioId);
    try {
      const beneficiarioDoc = await getDoc(beneficiarioRef);

      if (beneficiarioDoc.exists()) {
        const beneficiarioData = beneficiarioDoc.data();
        const nombre = beneficiarioData.nombre;
        const beneficiarioObjeto = {
          nombre: nombre,
          desayuno: beneficiarioData.desayuno,
          almuerzo: beneficiarioData.almuerzo,
        };
        setArregloBeneficiario(beneficiarioObjeto);
      } else {
        console.log('No se encontró el beneficiario con ID:', beneficiarioId);
      }
    } catch (error) {
      console.error('Error al obtener el beneficiario:', error);
    }
  };

  const convertirTimestampAFecha = (timestamp) => {
    const fecha = new Date(timestamp.seconds * 1000);
    const day = addLeadingZero(fecha.getDate());
    const month = addLeadingZero(fecha.getMonth() + 1);
    const year = fecha.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate;
  };

  const addLeadingZero = (number) => {
    return number < 10 ? `0${number}` : number;
  };

  const convertirFormato = (date) => {
    const formattedDate = new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
    return formattedDate;
  };

  return (
    <View style={styles.container}>
      <View style={styles.imagesContainer}>
        <Image
          style={[styles.image, { marginTop: 0, marginLeft: -70 }]}
          source={require('../../assets/imagenes/logoMenu-banco-alimentos.png')}
        />
        <TouchableOpacity
          style={[styles.buttonCont, { marginTop: 0, marginLeft: 140 }]}
          onPress={() => handleOptionPress('Asistencia')}
        >
          <Text style={styles.buttonText}>Regresar</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Asistencia</Text>
        <Text style={styles.title}>{convenioN}</Text>
        <Text style={styles.subTitle}>Seleccione un item y luego seleccione una fecha</Text>
      </View>

      <View>
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          style={styles.dropdown}
        />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={{ marginTop: 10, marginLeft: '5%' }}>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={{
              backgroundColor: '#890202',
              padding: 10,
              marginLeft: '10%',
              borderRadius: 5,
              alignItems: 'center',
              justifyContent: 'center',
              width: '80%',
            }}
          >
            <Text style={{ fontSize: 12, color: 'white' }}>Seleccione una fecha</Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker value={date} mode="date" display="default" onChange={onChange} />
          )}
        </View>

        <View style={{ marginLeft: '5%' }}>
          <Text style={{ marginTop: '5%', marginLeft: '5%' }}>Fecha seleccionada: {convertirFormato(date)}</Text>
        </View>

        <View style={styles.tableContainer}>
          <Text style={styles.tableTitle}>Beneficiarios</Text>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>Nombre</Text>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>Asistencia</Text>
          </View>

          {loading && (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Cargando...</Text>
            </View>
          )}

          {data.map((nombreFecha, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableCellHeader]}>{nombreFecha.nombre}</Text>
              <Text style={styles.tableCell}>
                {/* Utilizando el índice de la fecha seleccionada y la opción del DropDownPicker */}
                {asistenciasIndex !== -1 &&
                  (value === 'Desayuno'
                    ? nombreFecha.desayuno[asistenciasIndex] === 0
                      ? 'F'
                      : 'A'
                    : value === 'Almuerzo'
                      ? nombreFecha.almuerzo[asistenciasIndex] === 0
                        ? 'F'
                        : 'A'
                      : null)}
              </Text>
            </View>
          ))}
        </View>

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
  subTitle: {
    marginTop: 5,
    fontSize: 14,
    color: '#333',
    alignSelf: 'center',
    textAlign: 'center',
  },
  txtNombre: {
    marginLeft: 20,
  },
  txtDias: {
    marginRight: 100,
  },
  textContainer: {
    paddingBottom: 10,
  },
  option: {
    backgroundColor: '#890202',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 10,
    marginHorizontal: 20,
  },
  optionContainer: {
    paddingVertical: 25,
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
  tableContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  tableTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  tableCellHeader: {
    fontWeight: 'bold',
  },
  tableCell: {
    flex: 1,
    marginLeft: 4,
  },
  tableCellBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tableRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  buscador: {
    backgroundColor: 'white',
    color: 'black',
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 5,
    borderWidth: 1,
    borderColor: 'black',
  },
  buttonCont: {
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
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  }, loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default VerAsistencia;
