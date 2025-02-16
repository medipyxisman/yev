import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text } from '../../../components/ui/Text';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { IconButton } from '../../../components/ui/IconButton';
import { colors } from '../../../components/theme/colors';
import { spacing } from '../../../components/theme/spacing';
import { Plus, Edit2, Trash2, Clock } from 'lucide-react-native';
import { Picker } from '@react-native-picker/picker';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  route: string;
  startDate: string;
  endDate?: string;
  status: 'active' | 'discontinued' | 'completed';
  prescribedBy: string;
  notes?: string;
}

const frequencies = [
  'Once daily',
  'Twice daily',
  'Three times daily',
  'Four times daily',
  'Every 4 hours',
  'Every 6 hours',
  'Every 8 hours',
  'Every 12 hours',
  'As needed',
  'Weekly'
];

const routes = [
  'Oral',
  'Topical',
  'Subcutaneous',
  'Intramuscular',
  'Intravenous',
  'Inhaled',
  'Sublingual',
  'Transdermal'
];

// Mock data - replace with API call
const mockMedications: Medication[] = [
  {
    id: '1',
    name: 'Amoxicillin',
    dosage: '500mg',
    frequency: 'Three times daily',
    route: 'Oral',
    startDate: '2024-03-01',
    status: 'active',
    prescribedBy: 'Dr. Smith'
  },
  {
    id: '2',
    name: 'Ibuprofen',
    dosage: '400mg',
    frequency: 'As needed',
    route: 'Oral',
    startDate: '2024-02-15',
    endDate: '2024-03-15',
    status: 'completed',
    prescribedBy: 'Dr. Johnson',
    notes: 'Take with food'
  }
];

export default function MedicationsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [medications, setMedications] = useState<Medication[]>(mockMedications);
  const [showNewMedication, setShowNewMedication] = useState(false);
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: frequencies[0],
    route: routes[0],
    startDate: '',
    endDate: '',
    notes: ''
  });

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!formData.name || !formData.dosage || !formData.startDate) {
        throw new Error('Please fill in all required fields');
      }

      // TODO: Replace with API call
      const newMedication: Medication = {
        id: Math.random().toString(),
        ...formData,
        status: 'active',
        prescribedBy: 'Current Provider' // TODO: Get from auth context
      };

      setMedications(prev => [...prev, newMedication]);
      setShowNewMedication(false);
      setFormData({
        name: '',
        dosage: '',
        frequency: frequencies[0],
        route: routes[0],
        startDate: '',
        endDate: '',
        notes: ''
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save medication');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingMedication) return;

    try {
      setLoading(true);
      setError(null);

      // TODO: Replace with API call
      setMedications(prev =>
        prev.map(med =>
          med.id === editingMedication.id
            ? { ...med, ...formData }
            : med
        )
      );

      setEditingMedication(null);
      setFormData({
        name: '',
        dosage: '',
        frequency: frequencies[0],
        route: routes[0],
        startDate: '',
        endDate: '',
        notes: ''
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update medication');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (medicationId: string) => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Replace with API call
      setMedications(prev => prev.filter(med => med.id !== medicationId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete medication');
    } finally {
      setLoading(false);
    }
  };

  const MedicationForm = ({ onSubmit, onCancel }: { onSubmit: () => void; onCancel: () => void }) => (
    <Card variant="elevated" style={styles.form}>
      <View style={styles.formFields}>
        <View style={styles.field}>
          <Text variant="sm" weight="medium" color={colors.gray[500]}>
            Medication Name *
          </Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
            placeholder="Enter medication name"
            placeholderTextColor={colors.gray[400]}
          />
        </View>

        <View style={styles.field}>
          <Text variant="sm" weight="medium" color={colors.gray[500]}>
            Dosage *
          </Text>
          <TextInput
            style={styles.input}
            value={formData.dosage}
            onChangeText={(text) => setFormData(prev => ({ ...prev, dosage: text }))}
            placeholder="Enter dosage"
            placeholderTextColor={colors.gray[400]}
          />
        </View>

        <View style={styles.field}>
          <Text variant="sm" weight="medium" color={colors.gray[500]}>
            Frequency
          </Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.frequency}
              onValueChange={(value) => setFormData(prev => ({ ...prev, frequency: value }))}
            >
              {frequencies.map(freq => (
                <Picker.Item key={freq} label={freq} value={freq} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.field}>
          <Text variant="sm" weight="medium" color={colors.gray[500]}>
            Route
          </Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.route}
              onValueChange={(value) => setFormData(prev => ({ ...prev, route: value }))}
            >
              {routes.map(route => (
                <Picker.Item key={route} label={route} value={route} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.field}>
          <Text variant="sm" weight="medium" color={colors.gray[500]}>
            Start Date *
          </Text>
          <TextInput
            style={styles.input}
            value={formData.startDate}
            onChangeText={(text) => setFormData(prev => ({ ...prev, startDate: text }))}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={colors.gray[400]}
          />
        </View>

        <View style={styles.field}>
          <Text variant="sm" weight="medium" color={colors.gray[500]}>
            End Date
          </Text>
          <TextInput
            style={styles.input}
            value={formData.endDate}
            onChangeText={(text) => setFormData(prev => ({ ...prev, endDate: text }))}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={colors.gray[400]}
          />
        </View>

        <View style={styles.field}>
          <Text variant="sm" weight="medium" color={colors.gray[500]}>
            Notes
          </Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.notes}
            onChangeText={(text) => setFormData(prev => ({ ...prev, notes: text }))}
            placeholder="Add any additional notes"
            placeholderTextColor={colors.gray[400]}
            multiline
            numberOfLines={3}
          />
        </View>
      </View>

      <View style={styles.formActions}>
        <Button
          variant="outline"
          onPress={onCancel}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onPress={onSubmit}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Medication'}
        </Button>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="2xl" weight="bold">Medications</Text>
        <Button
          variant="primary"
          leftIcon={Plus}
          onPress={() => setShowNewMedication(true)}
          disabled={loading}
        >
          Add Medication
        </Button>
      </View>

      {error && (
        <Text color={colors.error[500]} style={styles.error}>
          {error}
        </Text>
      )}

      {showNewMedication && (
        <MedicationForm
          onSubmit={handleSave}
          onCancel={() => setShowNewMedication(false)}
        />
      )}

      <ScrollView style={styles.medicationsList}>
        {medications.map(medication => (
          <Card key={medication.id} variant="elevated" style={styles.medicationCard}>
            {editingMedication?.id === medication.id ? (
              <MedicationForm
                onSubmit={handleUpdate}
                onCancel={() => setEditingMedication(null)}
              />
            ) : (
              <>
                <View style={styles.medicationHeader}>
                  <View>
                    <Text weight="medium">{medication.name}</Text>
                    <Text variant="sm" color={colors.gray[500]}>
                      {medication.dosage} - {medication.frequency}
                    </Text>
                  </View>
                  <View style={styles.medicationActions}>
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: medication.status === 'active' ? colors.success[50] : colors.gray[100] }
                    ]}>
                      <Text
                        variant="sm"
                        weight="medium"
                        color={medication.status === 'active' ? colors.success[700] : colors.gray[600]}
                      >
                        {medication.status.charAt(0).toUpperCase() + medication.status.slice(1)}
                      </Text>
                    </View>
                    <IconButton
                      icon={Edit2}
                      size={20}
                      color={colors.gray[500]}
                      onPress={() => {
                        setEditingMedication(medication);
                        setFormData({
                          name: medication.name,
                          dosage: medication.dosage,
                          frequency: medication.frequency,
                          route: medication.route,
                          startDate: medication.startDate,
                          endDate: medication.endDate || '',
                          notes: medication.notes || ''
                        });
                      }}
                    />
                    <IconButton
                      icon={Trash2}
                      size={20}
                      color={colors.error[500]}
                      onPress={() => handleDelete(medication.id)}
                    />
                  </View>
                </View>

                <View style={styles.medicationDetails}>
                  <View style={styles.detailRow}>
                    <Text variant="sm" weight="medium" color={colors.gray[500]}>
                      Route:
                    </Text>
                    <Text variant="sm">{medication.route}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text variant="sm" weight="medium" color={colors.gray[500]}>
                      Start Date:
                    </Text>
                    <Text variant="sm">{medication.startDate}</Text>
                  </View>

                  {medication.endDate && (
                    <View style={styles.detailRow}>
                      <Text variant="sm" weight="medium" color={colors.gray[500]}>
                        End Date:
                      </Text>
                      <Text variant="sm">{medication.endDate}</Text>
                    </View>
                  )}

                  <View style={styles.detailRow}>
                    <Text variant="sm" weight="medium" color={colors.gray[500]}>
                      Prescribed By:
                    </Text>
                    <Text variant="sm">{medication.prescribedBy}</Text>
                  </View>

                  {medication.notes && (
                    <Text variant="sm" color={colors.gray[600]} style={styles.notes}>
                      {medication.notes}
                    </Text>
                  )}
                </View>
              </>
            )}
          </Card>
        ))}
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
  form: {
    marginBottom: spacing[4],
    gap: spacing[6]
  },
  formFields: {
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
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top'
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 8,
    backgroundColor: colors.gray[50],
    overflow: 'hidden'
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing[3]
  },
  medicationsList: {
    flex: 1
  },
  medicationCard: {
    marginBottom: spacing[4]
  },
  medicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing[4]
  },
  medicationActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2]
  },
  statusBadge: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: 16
  },
  medicationDetails: {
    gap: spacing[3]
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  notes: {
    marginTop: spacing[2]
  }
});