import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ImageBackground, ScrollView, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const fetchData = async () => {
  // Simulación de datos. Reemplaza esta función para obtener datos de tu base de datos.
  return [
    { label: 'Lunes', value: 1000 },
    { label: 'Martes', value: 1500 },
    { label: 'Miércoles', value: 1300 },
    { label: 'Jueves', value: 900 },
    { label: 'Viernes', value: 1600 },
    { label: 'Sábado', value: 1400 },
    { label: 'Domingo', value: 1700 },
  ];
};

export default function ConsumptionScreen() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const fetchedData = await fetchData();
      setData(fetchedData);
    };

    loadData();
  }, []);

  if (!data) {
    return <Text>Cargando datos...</Text>;
  }

  const chartData = {
    labels: data.map(item => item.label),
    datasets: [
      {
        data: data.map(item => item.value),
      },
    ],
  };

  return (
    <ImageBackground source={require('../assets/images/background.jpeg')} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Consumo</Text>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.chartContainer}>
            <LineChart
              data={chartData}
              width={Dimensions.get('window').width - 40}
              height={220}
              chartConfig={{
                backgroundColor: 'transparent',
                backgroundGradientFrom: 'transparent',
                backgroundGradientTo: 'transparent',
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: '#ffa726',
                },
              }}
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 28,
    color: '#fff',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  scrollContainer: {
    alignItems: 'center',
  },
  chartContainer: {
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
