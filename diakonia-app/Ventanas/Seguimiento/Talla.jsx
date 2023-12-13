import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';

const Talla = () => {
  const navigation = useNavigation();

  // Datos para el gráfico de Talla en metros
  const heightData = {
    labels: ['2023-01-01', '2023-01-05', '2023-01-10', '2023-01-15', '2023-01-20'],
    datasets: [
      {
        data: [1.75, 1.76, 1.78, 1.77, 1.79],
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
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Seguimiento Nutricional</Text>
        <Text style={styles.title}>Joffre Ramírez</Text>
        <Text style={styles.title}>Talla</Text>
      </View>
      <View style={styles.chartContainer}>
        <Text>Gráfico de Líneas de Talla</Text>
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
  },
});

export default Talla;
