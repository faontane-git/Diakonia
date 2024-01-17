import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';

const Peso = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { nombreBeneficiario, fechas, pesos } = route.params;

  // Eliminar datos con valor "-"
  const datosLimpios = pesos.reduce((acc, peso, index) => {
    if (peso !== "-") {
      acc.fechas.push(fechas[index]);
      acc.pesos.push(peso);
    }
    console.log(acc);
    return acc;
  }, { fechas: [], pesos: [] });

  // Datos para el gráfico de Talla en metros
  const heightData = {
    labels: datosLimpios.fechas,
    datasets: [
      {
        data: datosLimpios.pesos,
      },
    ],
  };



  const handleOptionPress = (option) => {
    navigation.navigate(option);
  };

  const handleDataPointClick = (dataset, dataPointIndex) => {
    console.log(`Punto de datos clickeado en el conjunto ${dataset} y el índice ${dataPointIndex}`);
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
          onPress={() => handleOptionPress('Seguimiento')}
        >
          <Text style={styles.buttonText}>Regresar</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Seguimiento Nutricional</Text>
        <Text style={styles.title}>{nombreBeneficiario}</Text>
        <Text style={styles.title}>Peso</Text>
      </View>
      <View style={styles.chartContainer}>
        <Text>Gráfico de Líneas de Peso</Text>
        <TouchableOpacity activeOpacity={1} onPress={() => console.log('Gráfico de Talla en Metros clickeado')}>
          <LineChart
            data={heightData}
            width={375}
            height={300}
            yAxisLabel=""
            chartConfig={{
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#ffa726',
              },
            }}
            bezier
            style={{
              marginVertical: 4,
              marginHorizontal: 20,
              borderRadius: 16,
              marginRight: 10,
            }}
            onDataPointClick={({ datasetIndex, dataPointIndex }) =>
              handleDataPointClick(datasetIndex, dataPointIndex)
            }
          />
        </TouchableOpacity>
      </View>

      {/* Tabla de Datos */}
      <View style={styles.tableContainer}>
        <View style={[styles.tableRow, styles.tableCellBorder]}>
          <Text style={[styles.txtFecha, styles.tableCellHeader, styles.tableCellBorder]}>Fecha</Text>
          <Text style={[styles.txtTalla, styles.tableCellHeader, styles.tableCellBorder]}>Talla (m)</Text>
        </View>
        {heightData.labels.map((label, index) => (
          <View key={index} style={[styles.tableRow, styles.tableRowBorder]}>
            <Text style={[styles.tableCell, styles.tableCellBorder]}>{label}</Text>
            <Text style={[styles.tableCell, styles.tableCellBorder]}>{heightData.datasets[0].data[index]}</Text>
          </View>
        ))}
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
  title: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
    alignSelf: 'center',
    textAlign: 'center',
  },
  txtFecha: {
    marginLeft: 20,
  },
  txtTalla: {
    marginRight: 100,
  },
  textContainer: {
    paddingBottom: 10,
  },
  chartContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  tableContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
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

export default Peso;
