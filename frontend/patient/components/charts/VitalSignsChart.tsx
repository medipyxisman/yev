import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { format } from 'date-fns';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import type { VitalSigns } from '../../api/vitalSignsApi';

interface VitalSignsChartProps {
  data: VitalSigns[];
  metric: 'bloodPressure' | 'heartRate' | 'respiratoryRate' | 'temperature' | 'oxygenSaturation';
  color?: string;
}

export function VitalSignsChart({ data, metric, color = colors.primary[500] }: VitalSignsChartProps) {
  const sortedData = [...data].sort((a, b) => 
    new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime()
  );

  const getMetricValue = (record: VitalSigns) => {
    if (metric === 'bloodPressure') {
      return record.bloodPressure.systolic;
    }
    return record[metric];
  };

  const chartData = {
    labels: sortedData.map(record => 
      format(new Date(record.recordedAt), 'MM/dd')
    ),
    datasets: [{
      data: sortedData.map(record => getMetricValue(record)),
      color: () => color,
      strokeWidth: 2
    }]
  };

  const getYAxisSuffix = () => {
    switch (metric) {
      case 'bloodPressure':
        return ' mmHg';
      case 'heartRate':
        return ' bpm';
      case 'respiratoryRate':
        return ' br/min';
      case 'temperature':
        return '°C';
      case 'oxygenSaturation':
        return '%';
      default:
        return '';
    }
  };

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: metric === 'temperature' ? 1 : 0,
    color: () => color,
    labelColor: () => colors.gray[500],
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: color
    }
  };

  return (
    <View style={styles.container}>
      <LineChart
        data={chartData}
        width={Dimensions.get('window').width - spacing[8]}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        yAxisSuffix={getYAxisSuffix()}
        yAxisInterval={1}
        fromZero
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: spacing[4],
    marginBottom: spacing[4]
  },
  chart: {
    marginVertical: spacing[4],
    borderRadius: 16
  }
});