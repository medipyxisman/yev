import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Text } from '../../../components/ui/Text';
import { Card } from '../../../components/ui/Card';
import { colors } from '../../../components/theme/colors';
import { spacing } from '../../../components/theme/spacing';
import { VitalSignsChart } from '../../../components/charts/VitalSignsChart';
import vitalSignsApi, { VitalSigns } from '../../../api/vitalSignsApi';
import { Picker } from '@react-native-picker/picker';

const timeRanges = [
  { label: 'Last 7 Days', value: 7 },
  { label: 'Last 30 Days', value: 30 },
  { label: 'Last 90 Days', value: 90 }
];

export default function VitalSignsTrendsScreen() {
  const { id } = useLocalSearchParams();
  const [vitalSigns, setVitalSigns] = useState<VitalSigns[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState(7);

  useEffect(() => {
    fetchVitalSigns();
  }, [id]);

  const fetchVitalSigns = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await vitalSignsApi.getVitalSigns(id as string);
      setVitalSigns(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch vital signs');
    } finally {
      setLoading(false);
    }
  };

  const filterDataByTimeRange = (data: VitalSigns[]) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - timeRange);
    
    return data.filter(record => 
      new Date(record.recordedAt) >= cutoffDate
    );
  };

  const filteredData = filterDataByTimeRange(vitalSigns);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading vital signs data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text color={colors.error[500]}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text variant="2xl" weight="bold">Vital Signs Trends</Text>
        <View style={styles.timeRangeContainer}>
          <Text variant="sm" weight="medium" color={colors.gray[500]}>
            Time Range:
          </Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={timeRange}
              onValueChange={setTimeRange}
              style={styles.picker}
            >
              {timeRanges.map(range => (
                <Picker.Item
                  key={range.value}
                  label={range.label}
                  value={range.value}
                />
              ))}
            </Picker>
          </View>
        </View>
      </View>

      {filteredData.length === 0 ? (
        <Card variant="elevated" style={styles.emptyState}>
          <Text style={styles.emptyText}>
            No vital signs data available for the selected time range
          </Text>
        </Card>
      ) : (
        <>
          <Card variant="elevated" style={styles.chartCard}>
            <Text variant="lg" weight="semibold" style={styles.chartTitle}>
              Blood Pressure
            </Text>
            <VitalSignsChart
              data={filteredData}
              metric="bloodPressure"
              color={colors.primary[500]}
            />
          </Card>

          <Card variant="elevated" style={styles.chartCard}>
            <Text variant="lg" weight="semibold" style={styles.chartTitle}>
              Heart Rate
            </Text>
            <VitalSignsChart
              data={filteredData}
              metric="heartRate"
              color={colors.success[500]}
            />
          </Card>

          <Card variant="elevated" style={styles.chartCard}>
            <Text variant="lg" weight="semibold" style={styles.chartTitle}>
              Respiratory Rate
            </Text>
            <VitalSignsChart
              data={filteredData}
              metric="respiratoryRate"
              color={colors.warning[500]}
            />
          </Card>

          <Card variant="elevated" style={styles.chartCard}>
            <Text variant="lg" weight="semibold" style={styles.chartTitle}>
              Temperature
            </Text>
            <VitalSignsChart
              data={filteredData}
              metric="temperature"
              color={colors.error[500]}
            />
          </Card>

          <Card variant="elevated" style={styles.chartCard}>
            <Text variant="lg" weight="semibold" style={styles.chartTitle}>
              Oxygen Saturation
            </Text>
            <VitalSignsChart
              data={filteredData}
              metric="oxygenSaturation"
              color={colors.primary[700]}
            />
          </Card>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[100],
    padding: spacing[4]
  },
  header: {
    marginBottom: spacing[6]
  },
  timeRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    marginTop: spacing[4]
  },
  pickerContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 8,
    backgroundColor: colors.gray[50],
    overflow: 'hidden'
  },
  picker: {
    height: 40
  },
  chartCard: {
    marginBottom: spacing[4]
  },
  chartTitle: {
    marginBottom: spacing[4]
  },
  emptyState: {
    padding: spacing[6],
    alignItems: 'center'
  },
  emptyText: {
    textAlign: 'center',
    color: colors.gray[500]
  }
});