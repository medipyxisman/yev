import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text } from '../../../components/ui/Text';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { colors } from '../../../components/theme/colors';
import { spacing } from '../../../components/theme/spacing';
import vitalSignsApi from '../../../api/vitalSignsApi';

export default function RecordVitalSignsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    bloodPressure: {
      systolic: '',
      diastolic: ''
    },
    heartRate: '',
    respiratoryRate: '',
    temperature: '',
    oxygenSaturation: '',
    weight: '',
    height: '',
    notes: ''
  });

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      // Basic validation
      if (!formData.bloodPressure.systolic || !formData.bloodPressure.diastolic || !formData.heartRate) {
        throw new Error('Please fill in all required fields');
      }

      const data = {
        patientId: id as string,
        recordedAt: new Date().toISOString(),
        recordedBy: 'Current User', // TODO: Get from auth context
        bloodPressure: {
          systolic: Number(formData.bloodPressure.systolic),
          diastolic: Number(formData.bloodPressure.diastolic)
        },
        heartRate: Number(formData.heartRate),
        respiratoryRate: Number(formData.respiratoryRate),
        temperature: Number(formData.temperature),
        oxygenSaturation: Number(formData.oxygenSaturation),
        weight: formData.weight ? Number(formData.weight) : undefined,
        height: formData.height ? Number(formData.height) : undefined,
        notes: formData.notes
      };

      await vitalSignsApi.recordVitalSigns(data);
      router.back();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to record vital signs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text variant="2xl" weight="bold" style={styles.title}>
        Record Vital Signs
      </Text>

      <Card variant="elevated" style={styles.form}>
        {error && (
          <Text color={colors.error[500]} style={styles.error}>
            {error}
          </Text>
        )}

        <View style={styles.section}>
          <Text variant="lg" weight="semibold" style={styles.sectionTitle}>
            Blood Pressure *
          </Text>
          <View style={styles.bpContainer}>
            <View style={styles.bpField}>
              <Text variant="sm" weight="medium" color={colors.gray[500]}>
                Systolic
              </Text>
              <TextInput
                style={styles.input}
                value={formData.bloodPressure.systolic}
                onChangeText={(text) => setFormData(prev => ({
                  ...prev,
                  bloodPressure: { ...prev.bloodPressure, systolic: text }
                }))}
                placeholder="mmHg"
                placeholderTextColor={colors.gray[400]}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.bpField}>
              <Text variant="sm" weight="medium" color={colors.gray[500]}>
                Diastolic
              </Text>
              <TextInput
                style={styles.input}
                value={formData.bloodPressure.diastolic}
                onChangeText={(text) => setFormData(prev => ({
                  ...prev,
                  bloodPressure: { ...prev.bloodPressure, diastolic: text }
                }))}
                placeholder="mmHg"
                placeholderTextColor={colors.gray[400]}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text variant="lg" weight="semibold" style={styles.sectionTitle}>
            Other Vitals
          </Text>
          <View style={styles.grid}>
            <View style={styles.field}>
              <Text variant="sm" weight="medium" color={colors.gray[500]}>
                Heart Rate *
              </Text>
              <TextInput
                style={styles.input}
                value={formData.heartRate}
                onChangeText={(text) => setFormData(prev => ({ ...prev, heartRate: text }))}
                placeholder="bpm"
                placeholderTextColor={colors.gray[400]}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.field}>
              <Text variant="sm" weight="medium" color={colors.gray[500]}>
                Respiratory Rate
              </Text>
              <TextInput
                style={styles.input}
                value={formData.respiratoryRate}
                onChangeText={(text) => setFormData(prev => ({ ...prev, respiratoryRate: text }))}
                placeholder="breaths/min"
                placeholderTextColor={colors.gray[400]}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.field}>
              <Text variant="sm" weight="medium" color={colors.gray[500]}>
                Temperature
              </Text>
              <TextInput
                style={styles.input}
                value={formData.temperature}
                onChangeText={(text) => setFormData(prev => ({ ...prev, temperature: text }))}
                placeholder="°C"
                placeholderTextColor={colors.gray[400]}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.field}>
              <Text variant="sm" weight="medium" color={colors.gray[500]}>
                O2 Saturation
              </Text>
              <TextInput
                style={styles.input}
                value={formData.oxygenSaturation}
                onChangeText={(text) => setFormData(prev => ({ ...prev, oxygenSaturation: text }))}
                placeholder="%"
                placeholderTextColor={colors.gray[400]}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text variant="lg" weight="semibold" style={styles.sectionTitle}>
            Measurements
          </Text>
          <View style={styles.grid}>
            <View style={styles.field}>
              <Text variant="sm" weight="medium" color={colors.gray[500]}>
                Weight
              </Text>
              <TextInput
                style={styles.input}
                value={formData.weight}
                onChangeText={(text) => setFormData(prev => ({ ...prev, weight: text }))}
                placeholder="kg"
                placeholderTextColor={colors.gray[400]}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.field}>
              <Text variant="sm" weight="medium" color={colors.gray[500]}>
                Height
              </Text>
              <TextInput
                style={styles.input}
                value={formData.height}
                onChangeText={(text) => setFormData(prev => ({ ...prev, height: text }))}
                placeholder="cm"
                placeholderTextColor={colors.gray[400]}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text variant="lg" weight="semibold" style={styles.sectionTitle}>
            Notes
          </Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.notes}
            onChangeText={(text) => setFormData(prev => ({ ...prev, notes: text }))}
            placeholder="Add any additional notes"
            placeholderTextColor={colors.gray[400]}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.actions}>
          <Button
            variant="outline"
            onPress={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Recording...' : 'Record Vital Signs'}
          </Button>
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[100],
    padding: spacing[4]
  },
  title: {
    marginBottom: spacing[6]
  },
  form: {
    gap: spacing[6]
  },
  error: {
    marginBottom: spacing[4]
  },
  section: {
    gap: spacing[4]
  },
  sectionTitle: {
    marginBottom: spacing[2]
  },
  bpContainer: {
    flexDirection: 'row',
    gap: spacing[4]
  },
  bpField: {
    flex: 1,
    gap: spacing[2]
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[4]
  },
  field: {
    flex: 1,
    minWidth: 200,
    gap: spacing[2]
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 8,
    padding: spacing[3],
    fontSize: 14,
    color: colors.gray[900],
    backgroundColor: colors.gray[50]
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top'
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing[3]
  }
});