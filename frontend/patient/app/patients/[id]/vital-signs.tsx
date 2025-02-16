import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text } from '../../../components/ui/Text';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { colors } from '../../../components/theme/colors';
import { spacing } from '../../../components/theme/spacing';
import { Plus } from 'lucide-react-native';
import vitalSignsApi, { VitalSigns } from '../../../api/vitalSignsApi';
import vitalSignsAlertApi from '../../../api/vitalSignsAlertApi';

export default function VitalSignsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [vitalSigns, setVitalSigns] = useState<VitalSigns[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleNewRecord = () => {
    router.push({
      pathname: '/(modals)/record-vital-signs',
      params: { id }
    });
  };

  const getStatusColor = (value: number, range: { min: number; max: number }) => {
    if (value < range.min) return colors.error[500];
    if (value > range.max) return colors.warning[500];
    return colors.success[500];
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="2xl" weight="bold">Vital Signs</Text>
        <Button
          variant="primary"
          leftIcon={Plus}
          onPress={handleNewRecord}
          disabled={loading}
        >
          Record Vital Signs
        </Button>
      </View>

      {error && (
        <Text color={colors.error[500]} style={styles.error}>
          {error}
        </Text>
      )}

      <ScrollView style={styles.recordsList}>
        {loading && vitalSigns.length === 0 ? (
          <Text style={styles.emptyText}>Loading vital signs...</Text>
        ) : vitalSigns.length === 0 ? (
          <Text style={styles.emptyText}>No vital signs recorded yet</Text>
        ) : (
          vitalSigns.map((record) => (
            <Card key={record.id} variant="elevated" style={styles.recordCard}>
              <View style={styles.recordHeader}>
                <View>
                  <Text variant="sm" weight="medium">
                    Recorded by {record.recordedBy}
                  </Text>
                  <Text variant="sm" color={colors.gray[500]}>
                    {formatDate(record.recordedAt)}
                  </Text>
                </View>
              </View>

              <View style={styles.vitalsGrid}>
                <View style={styles.vitalItem}>
                  <Text variant="sm" weight="medium" color={colors.gray[500]}>
                    Blood Pressure
                  </Text>
                  <Text style={{
                    color: getStatusColor(record.bloodPressure.systolic, { min: 90, max: 140 })
                  }}>
                    {record.bloodPressure.systolic}/{record.bloodPressure.diastolic} mmHg
                  </Text>
                </View>

                <View style={styles.vitalItem}>
                  <Text variant="sm" weight="medium" color={colors.gray[500]}>
                    Heart Rate
                  </Text>
                  <Text style={{
                    color: getStatusColor(record.heartRate, { min: 60, max: 100 })
                  }}>
                    {record.heartRate} bpm
                  </Text>
                </View>

                <View style={styles.vitalItem}>
                  <Text variant="sm" weight="medium" color={colors.gray[500]}>
                    Respiratory Rate
                  </Text>
                  <Text style={{
                    color: getStatusColor(record.respiratoryRate, { min: 12, max: 20 })
                  }}>
                    {record.respiratoryRate} breaths/min
                  </Text>
                </View>

                <View style={styles.vitalItem}>
                  <Text variant="sm" weight="medium" color={colors.gray[500]}>
                    Temperature
                  </Text>
                  <Text style={{
                    color: getStatusColor(record.temperature, { min: 36.1, max: 37.2 })
                  }}>
                    {record.temperature}°C
                  </Text>
                </View>

                <View style={styles.vitalItem}>
                  <Text variant="sm" weight="medium" color={colors.gray[500]}>
                    O2 Saturation
                  </Text>
                  <Text style={{
                    color: getStatusColor(record.oxygenSaturation, { min: 95, max: 100 })
                  }}>
                    {record.oxygenSaturation}%
                  </Text>
                </View>

                {record.weight && (
                  <View style={styles.vitalItem}>
                    <Text variant="sm" weight="medium" color={colors.gray[500]}>
                      Weight
                    </Text>
                    <Text>{record.weight} kg</Text>
                  </View>
                )}

                {record.height && (
                  <View style={styles.vitalItem}>
                    <Text variant="sm" weight="medium" color={colors.gray[500]}>
                      Height
                    </Text>
                    <Text>{record.height} cm</Text>
                  </View>
                )}

                {record.bmi && (
                  <View style={styles.vitalItem}>
                    <Text variant="sm" weight="medium" color={colors.gray[500]}>
                      BMI
                    </Text>
                    <Text>{record.bmi.toFixed(1)}</Text>
                  </View>
                )}
              </View>

              {record.notes && (
                <Text style={styles.notes}>{record.notes}</Text>
              )}
            </Card>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[100],
    padding: spacing[4]
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[6]
  },
  error: {
    marginBottom: spacing[4]
  },
  recordsList: {
    flex: 1
  },
  recordCard: {
    marginBottom: spacing[4]
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing[4]
  },
  vitalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[4]
  },
  vitalItem: {
    flex: 1,
    minWidth: 150,
    gap: spacing[1]
  },
  notes: {
    marginTop: spacing[4],
    fontSize: 14,
    color: colors.gray[600]
  },
  emptyText: {
    textAlign: 'center',
    color: colors.gray[500],
    padding: spacing[4]
  }
});