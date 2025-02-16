import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text } from '../../../components/ui/Text';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { IconButton } from '../../../components/ui/IconButton';
import { colors } from '../../../components/theme/colors';
import { spacing } from '../../../components/theme/spacing';
import { Plus, X } from 'lucide-react-native';
import medicalHistoryApi from '../../../api/medicalHistoryApi';
import type { Patient } from '../../../constants';

export default function MedicalHistoryScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  
  // New item inputs
  const [newCondition, setNewCondition] = useState('');
  const [newAllergy, setNewAllergy] = useState('');
  const [newMedication, setNewMedication] = useState('');

  const handleAddCondition = async () => {
    if (!newCondition.trim()) return;
    try {
      setLoading(true);
      await medicalHistoryApi.addCondition(id as string, newCondition);
      setNewCondition('');
      // Refresh patient data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add condition');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCondition = async (condition: string) => {
    try {
      setLoading(true);
      await medicalHistoryApi.removeCondition(id as string, condition);
      // Refresh patient data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove condition');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAllergy = async () => {
    if (!newAllergy.trim()) return;
    try {
      setLoading(true);
      await medicalHistoryApi.addAllergy(id as string, newAllergy);
      setNewAllergy('');
      // Refresh patient data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add allergy');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAllergy = async (allergy: string) => {
    try {
      setLoading(true);
      await medicalHistoryApi.removeAllergy(id as string, allergy);
      // Refresh patient data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove allergy');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMedication = async () => {
    if (!newMedication.trim()) return;
    try {
      setLoading(true);
      await medicalHistoryApi.addMedication(id as string, newMedication);
      setNewMedication('');
      // Refresh patient data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add medication');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMedication = async (medication: string) => {
    try {
      setLoading(true);
      await medicalHistoryApi.removeMedication(id as string, medication);
      // Refresh patient data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove medication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text variant="2xl" weight="bold">Medical History</Text>
      </View>

      {error && (
        <Text color={colors.error[500]} style={styles.error}>
          {error}
        </Text>
      )}

      {/* Conditions */}
      <Card variant="elevated" style={styles.section}>
        <Text variant="lg" weight="semibold" style={styles.sectionTitle}>
          Medical Conditions
        </Text>
        
        <View style={styles.addForm}>
          <TextInput
            style={styles.input}
            value={newCondition}
            onChangeText={setNewCondition}
            placeholder="Enter medical condition"
            placeholderTextColor={colors.gray[400]}
          />
          <Button
            variant="primary"
            leftIcon={Plus}
            onPress={handleAddCondition}
            disabled={loading || !newCondition.trim()}
          >
            Add
          </Button>
        </View>

        <View style={styles.tags}>
          {patient?.medicalHistory?.conditions.map((condition, index) => (
            <View key={index} style={styles.tag}>
              <Text variant="sm">{condition}</Text>
              <IconButton
                icon={X}
                size={16}
                color={colors.gray[500]}
                onPress={() => handleRemoveCondition(condition)}
              />
            </View>
          ))}
        </View>
      </Card>

      {/* Allergies */}
      <Card variant="elevated" style={styles.section}>
        <Text variant="lg" weight="semibold" style={styles.sectionTitle}>
          Allergies
        </Text>
        
        <View style={styles.addForm}>
          <TextInput
            style={styles.input}
            value={newAllergy}
            onChangeText={setNewAllergy}
            placeholder="Enter allergy"
            placeholderTextColor={colors.gray[400]}
          />
          <Button
            variant="primary"
            leftIcon={Plus}
            onPress={handleAddAllergy}
            disabled={loading || !newAllergy.trim()}
          >
            Add
          </Button>
        </View>

        <View style={styles.tags}>
          {patient?.medicalHistory?.allergies.map((allergy, index) => (
            <View key={index} style={styles.tag}>
              <Text variant="sm">{allergy}</Text>
              <IconButton
                icon={X}
                size={16}
                color={colors.gray[500]}
                onPress={() => handleRemoveAllergy(allergy)}
              />
            </View>
          ))}
        </View>
      </Card>

      {/* Medications */}
      <Card variant="elevated" style={styles.section}>
        <Text variant="lg" weight="semibold" style={styles.sectionTitle}>
          Current Medications
        </Text>
        
        <View style={styles.addForm}>
          <TextInput
            style={styles.input}
            value={newMedication}
            onChangeText={setNewMedication}
            placeholder="Enter medication"
            placeholderTextColor={colors.gray[400]}
          />
          <Button
            variant="primary"
            leftIcon={Plus}
            onPress={handleAddMedication}
            disabled={loading || !newMedication.trim()}
          >
            Add
          </Button>
        </View>

        <View style={styles.tags}>
          {patient?.medicalHistory?.medications.map((medication, index) => (
            <View key={index} style={styles.tag}>
              <Text variant="sm">{medication}</Text>
              <IconButton
                icon={X}
                size={16}
                color={colors.gray[500]}
                onPress={() => handleRemoveMedication(medication)}
              />
            </View>
          ))}
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
  header: {
    marginBottom: spacing[6]
  },
  error: {
    marginBottom: spacing[4]
  },
  section: {
    marginBottom: spacing[4]
  },
  sectionTitle: {
    marginBottom: spacing[4]
  },
  addForm: {
    flexDirection: 'row',
    gap: spacing[3],
    marginBottom: spacing[4]
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 8,
    padding: spacing[3],
    fontSize: 14,
    color: colors.gray[900],
    backgroundColor: colors.gray[50]
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2]
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    backgroundColor: colors.gray[100],
    paddingVertical: spacing[1],
    paddingHorizontal: spacing[3],
    borderRadius: 16
  }
});