import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';

const Imc = () => {
  const navigation = useNavigation();
  const data = {
    labels: ['2023-01-01', '2023-01-05', '2023-01-10', '2023-01-15', '2023-01-20'],
    datasets: [
      {
        data: [22, 23, 21, 24, 25],
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
        <Text style={styles.title}>IMC</Text>
      </View>
      <View style={styles.chartContainer}>
        <Text>Gráfico de Líneas de IMC</Text>
        <TouchableOpacity activeOpacity={1} onPress={() => console.log('Gráfico clickeado')}>
          <LineChart
            data={data}
            width={375}
            height={300}
            yAxisLabel="IMC"
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
          <Text style={[styles.txtFecha,styles.tableCellHeader, styles.tableCellBorder]}>Fecha</Text>
          <Text style={[styles.txtImc,styles.tableCellHeader, styles.tableCellBorder]}>IMC</Text>
        </View>
        {data.labels.map((label, index) => (
          <View key={index} style={[styles.tableRow, styles.tableRowBorder]}>
            <Text style={[styles.tableCell, styles.tableCellBorder]}>{label}</Text>
            <Text style={[styles.tableCell, styles.tableCellBorder]}>{data.datasets[0].data[index]}</Text>
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
  },txtFecha:{
    marginLeft: 20,
  },txtImc:{
    marginRight:145,
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
});

export default Imc;
