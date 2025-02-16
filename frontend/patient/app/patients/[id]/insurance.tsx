import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TextInput } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Text } from '../../../components/ui/Text';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { colors } from '../../../components/theme/colors';
import { spacing } from '../../../components/theme/spacing';
import insuranceApi from '../../../api/insuranceApi';
import type { Patient, Insurance } from '../../../constants';

export default function InsuranceScreen() {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [primaryInsurance, setPrimaryInsurance] = useState<Insurance>({
    provider: '',
    policyNumber: '',
    groupNumber: '',
    primary: true
  });
  const [secondaryInsurance, setSecondaryInsurance] = useState<Insurance>({
    provider: '',
    policyNumber: '',
    groupNumber: '',
    primary: false
  });

  useEffect(() => {
    if (patient?.insurance) {
      if (patient.insurance.primary) {
        setPrimaryInsurance(patient.insurance.primary);
      }
      if (patient.insurance.secondary) {
        setSecondaryInsurance(patient.insurance.secondary);
      }
    }
  }, [patient]);

  const handleUpdatePrimary = async () => {
    try {
      setLoading(true);
      setError(null);
      await insuranceApi.updatePrimaryInsurance(id as string, primaryInsurance);
      // Refresh patient data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update primary insurance');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSecondary = async () => {
    try {
      setLoading(true);
      setError(null);
      await insuranceApi.updateSecondaryInsurance(id as string, secondaryInsurance);
      // Refresh patient data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update secondary insurance');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSecondary = async () => {
    try {
      setLoading(true);
      setError(null);
      await insuranceApi.removeSecondaryInsurance(id as string);
      setSecondaryInsurance({
        provider: '',
        policyNumber: '',
        groupNumber: '',
        primary: false
      });
      // Refresh patient data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove secondary insurance');
    } finally {
      setLoading(false);
    }
  };

  const InsuranceForm = ({ 
    title,
    insurance,
    setInsurance,
    onSave,
    onRemove,
    isPrimary = false
  }: {
    title: string;
    insurance: Insurance;
    setInsurance: (insurance: Insurance) => void;
    onSave: () => void;
    onRemove?: () => void;
    isPrimary?: boolean;
  }) => (
    <Card variant="elevated" style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text variant="lg" weight="semibold">{title}</Text>
        {!isPrimary && onRemove && (
          <Button
            variant="outline"
            onPress={onRemove}
            disabled={loading}
          >
            Remove
          </Button>
        )}
      </View>

      <View style={styles.fields}>
        <View style={styles.field}>
          <Text variant="sm" weight="medium" color={colors.gray[500]}>
            Provider
          </Text>
          <TextInput
            style={styles.input}
            value={insurance.provider}
            onChangeText={(text) => setInsurance({ ...insurance, provider: text })}
            placeholder="Enter insurance provider"
            placeholderTextColor={colors.gray[400]}
          />
        </View>

        <View style={styles.field}>
          <Text variant="sm" weight="medium" color={colors.gray[500]}>
            Policy Number
          </Text>
          <TextInput
            style={styles.input}
            value={insurance.policyNumber}
            onChangeText={(text) => setInsurance({ ...insurance, policyNumber: text })}
            placeholder="Enter policy number"
            placeholderTextColor={colors.gray[400]}
          />
        </View>

        <View style={styles.field}>
          <Text variant="sm" weight="medium" color={colors.gray[500]}>
            Group Number
          </Text>
          <TextInput
            style={styles.input}
            value={insurance.groupNumber}
            onChangeText={(text) => setInsurance({ ...insurance, groupNumber: text })}
            placeholder="Enter group number"
            placeholderTextColor={colors.gray[400]}
          />
        </View>

        <Button
          variant="primary"
          onPress={onSave}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </View>
    </Card>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text variant="2xl" weight="bold">Insurance Information</Text>
      </View>

      {error && (
        <Text color={colors.error[500]} style={styles.error}>
          {error}
        </Text>
      )}

      <InsuranceForm
        title="Primary Insurance"
        insurance={primaryInsurance}
        setInsurance={setPrimaryInsurance}
        onSave={handleUpdatePrimary}
        isPrimary
      />

      <InsuranceForm
        title="Secondary Insurance"
        insurance={secondaryInsurance}
        setInsurance={setSecondaryInsurance}
        onSave={handleUpdateSecondary}
        onRemove={handleRemoveSecondary}
      />
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
  error: {
    marginBottom: spacing[4]
  },
  section: {
    marginBottom: spacing[4]
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[4]
  },
  fields: {
    gap: spacing[4]
  },
  field: {
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
  }
});