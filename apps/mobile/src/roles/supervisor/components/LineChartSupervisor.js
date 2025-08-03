import React from 'react';
import { View, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

export default function LineChartSupervisor() {
  return (
    <View style={{ alignItems: 'center', marginBottom: 12 }}>
      <LineChart
        data={{
          labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
          datasets: [
            {
              data: [120, 140, 180, 100],
              color: () => '#FFD600',
              strokeWidth: 3,
            },
            {
              data: [100, 200, 150, 120],
              color: () => '#2D5FFF',
              strokeWidth: 3,
            },
          ],
          legend: ['Proyectos retrasados', 'Proyectos completos'],
        }}
        width={Dimensions.get('window').width - 64}
        height={180}
        chartConfig={{
          backgroundColor: '#181A1B',
          backgroundGradientFrom: '#181A1B',
          backgroundGradientTo: '#181A1B',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255,255,255,${opacity})`,
          labelColor: () => '#C2C3CB',
          propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: '#232627',
          },
        }}
        bezier
        style={{
          borderRadius: 12,
        }}
      />
    </View>
  );
} 