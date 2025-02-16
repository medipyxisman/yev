import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text } from '../../../components/ui/Text';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { IconButton } from '../../../components/ui/IconButton';
import { colors } from '../../../components/theme/colors';
import { spacing } from '../../../components/theme/spacing';
import { Plus, Edit2, Trash2, AlertTriangle } from 'lucide-react-native';
import { Picker } from '@react-native-picker/picker';

interface LabResult {
  id: string;
  testName: string;
  category: 'blood' | 'urine' | 'tissue' | 'imaging' | 'other';
  date: string;
  value: string;
  unit: string;
  referenceRange?: {
    min?: number;
    max?: number;
  };
  status: 'normal' | 'abnormal' | 'critical';
  orderedBy: string;
  lab?: string;
  notes?: string;
}

const categories = [
  'blood',
  'urine',
  'tissue',
  'imaging',
  'other'
] as const;

// Common lab tests with their units and reference ranges
const commonTests = [
  {
    name: 'Hemoglobin',
    unit: 'g/dL',
    range: { min: 12, max: 16 }
  },
  {
    name: 'White Blood Cell Count',
    unit: 'K/µL',
    range: { min: 4.5, max: 11 }
  },
  {
    name: 'Platelet Count',
    unit: 'K/µL',
    range: { min: 150, max: 450 }
  },
  {
    name: 'Blood Glucose',
    unit: 'mg/dL',
    range: { min: 70, max: 100 }
  },
  {
    name: 'Creatinine',
    unit: 'mg/dL',
    range: { min: 0.6, max: 1.2 }
  }
];

// Mock data - replace with API call
const mockLabResults: LabResult[] = [
  {
    id: '1',
    testName: 'Hemoglobin',
    category: 'blood',
    date: '2024-03-15',
    value: '14.2',
    unit: 'g/dL',
    referenceRange: { min: 12, max: 16 },
    status: 'normal',
    orderedBy: 'Dr. Smith',
    lab: 'Central Lab',
    notes: 'Within normal range'
  },
  {
    id: '2',
    testName: 'Blood Glucose',
    category: 'blood',
    date: '2024-03-15',
    value: '142',
    unit: 'mg/dL',
    referenceRange: { min: 70, max: 100 },
    status: 'abnormal',
    orderedBy: 'Dr. Smith',
    lab: 'Central Lab',
    notes: 'Elevated blood glucose levels'
  }
];

export default function LabResultsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [labResults, setLabResults] = useState<LabResult[]>(mockLabResults);
  const [showNewResult, setShowNewResult] = useState(false);
  const [editingResult, setEditingResult] = useState<LabResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    testName: commonTests[0].name,
    category: 'blood' as LabResult['category'],
    date: '',
    value: '',
    unit: commonTests[0].unit,
    referenceRange: commonTests[0].range,
    lab: '',
    notes: ''
  });

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!formData.testName || !formData.date || !formData.value) {
        throw new Error('Please fill in all required fields');
      }

      // Determine status based on reference range
      let status: LabResult['status'] = 'normal';
      if (formData.referenceRange) {
        const value = parseFloat(formData.value);
        if (formData.referenceRange.min && value < formData.referenceRange.min) {
          status = 'abnormal';
        }
        if (formData.referenceRange.max && value > formData.referenceRange.max) {
          status = value > formData.referenceRange.max * 1.5 ? 'critical' : 'abnormal';
        }
      }

      // TODO: Replace with API call
      const newResult: LabResult = {
        id: Math.random().toString(),
        ...formData,
        status,
        orderedBy: 'Current Provider' // TODO: Get from auth context
      };

      setLabResults(prev => [...prev, newResult]);
      setShowNewResult(false);
      setFormData({
        testName: commonTests[0].name,
        category: 'blood',
        date: '',
        value: '',
        unit: commonTests[0].unit,
        referenceRange: commonTests[0].range,
        lab: '',
        notes: ''
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save lab result');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingResult) return;

    try {
      setLoading(true);
      setError(null);

      // TODO: Replace with API call
      setLabResults(prev =>
        prev.map(result =>
          result.id === editingResult.id
            ? { ...result, ...formData }
            : result
        )
      );

      setEditingResult(null);
      setFormData({
        testName: commonTests[0].name,
        category: 'blood',
        date: '',
        value: '',
        unit: commonTests[0].unit,
        referenceRange: commonTests[0].range,
        lab: '',
        notes: ''
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update lab result');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (resultId: string) => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Replace with API call
      setLabResults(prev => prev.filter(result => result.id !== resultId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete lab result');
    } finally {
      setLoading(false);
    }
  };

  const handleTestSelect = (testName: string) => {
    const test = commonTests.find(t => t.name === testName);
    if (test) {
      setFormData(prev => ({
        ...prev,
        testName: test.name,
        unit: test.unit,
        referenceRange: test.range
      }));
    }
  };

  const getStatusColor = (status: LabResult['status']) => {
    switch (status) {
      case 'normal':
        return colors.success[500];
      case 'abnormal':
        return colors.warning[500];
      case 'critical':
        return colors.error[500];
      default:
        return colors.gray[500];
    }
  };

  const LabResultForm = ({ onSubmit, onCancel }: { onSubmit: () => void; onCancel: () => void }) => (
    <Card variant="elevated" style={styles.form}>
      <View style={styles.formFields}>
        <View style={styles.field}>
          <Text variant="sm" weight="medium" color={colors.gray[500]}>
            Test Name *
          </Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.testName}
              onValueChange={handleTestSelect}
            >
              {commonTests.map(test => (
                <Picker.Item key={test.name} label={test.name} value={test.name} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.field}>
          <Text variant="sm" weight="medium" color={colors.gray[500]}>
            Category
          </Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.category}
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
            >
              {categories.map(category => (
                <Picker.Item
                  key={category}
                  label={category.charAt(0).toUpperCase() + category.slice(1)}
                  value={category}
                />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.field}>
          <Text variant="sm" weight="medium" color={colors.gray[500]}>
            Date *
          </Text>
          <TextInput
            style={styles.input}
            value={formData.date}
            onChangeText={(text) => setFormData(prev => ({ ...prev, date: text }))}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={colors.gray[400]}
          />
        </View>

        <View style={styles.field}>
          <Text variant="sm" weight="medium" color={colors.gray[500]}>
            Value *
          </Text>
          <View style={styles.valueContainer}>
            <TextInput
              style={[styles.input, styles.valueInput]}
              value={formData.value}
              onChangeText={(text) => setFormData(prev => ({ ...prev, value: text }))}
              placeholder="Enter value"
              placeholderTextColor={colors.gray[400]}
              keyboardType="numeric"
            />
            <Text variant="sm" color={colors.gray[500]} style={styles.unitText}>
              {formData.unit}
            </Text>
          </View>
          {formData.referenceRange && (
            <Text variant="sm" color={colors.gray[500]}>
              Reference Range: {formData.referenceRange.min} - {formData.referenceRange.max} {formData.unit}
            </Text>
          )}
        </View>

        <View style={styles.field}>
          <Text variant="sm" weight="medium" color={colors.gray[500]}>
            Lab
          </Text>
          <TextInput
            style={styles.input}
            value={formData.lab}
            onChangeText={(text) => setFormData(prev => ({ ...prev, lab: text }))}
            placeholder="Enter lab name"
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
          {loading ? 'Saving...' : 'Save Result'}
        </Button>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="2xl" weight="bold">Lab Results</Text>
        <Button
          variant="primary"
          leftIcon={Plus}
          onPress={() => setShowNewResult(true)}
          disabled={loading}
        >
          Add Lab Result
        </Button>
      </View>

      {error && (
        <Text color={colors.error[500]} style={styles.error}>
          {error}
        </Text>
      )}

      {showNewResult && (
        <LabResultForm
          onSubmit={handleSave}
          onCancel={() => setShowNewResult(false)}
        />
      )}

      <ScrollView style={styles.resultsList}>
        {labResults.map(result => (
          <Card key={result.id} variant="elevated" style={styles.resultCard}>
            {editingResult?.id === result.id ? (
              <LabResultForm
                onSubmit={handleUpdate}
                onCancel={() => setEditingResult(null)}
              />
            ) : (
              <>
                <View style={styles.resultHeader}>
                  <View>
                    <Text weight="medium">{result.testName}</Text>
                    <Text variant="sm" color={colors.gray[500]}>
                      {result.category.charAt(0).toUpperCase() + result.category.slice(1)} Test
                    </Text>
                  </View>
                  <View style={styles.resultActions}>
                    {result.status !== 'normal' && (
                      <View style={[
                        styles.statusBadge,
                        { backgroundColor: `${getStatusColor(result.status)}10` }
                      ]}>
                        <AlertTriangle size={16} color={getStatusColor(result.status)} />
                        <Text
                          variant="sm"
                          weight="medium"
                          color={getStatusColor(result.status)}
                        >
                          {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
                        </Text>
                      </View>
                    )}
                    <IconButton
                      icon={Edit2}
                      size={20}
                      color={colors.gray[500]}
                      onPress={() => {
                        setEditingResult(result);
                        setFormData({
                          testName: result.testName,
                          category: result.category,
                          date: result.date,
                          value: result.value,
                          unit: result.unit,
                          referenceRange: result.referenceRange,
                          lab: result.lab || '',
                          notes: result.notes || ''
                        });
                      }}
                    />
                    <IconButton
                      icon={Trash2}
                      size={20}
                      color={colors.error[500]}
                      onPress={() => handleDelete(result.id)}
                    />
                  </View>
                </View>

                <View style={styles.resultDetails}>
                  <View style={styles.detailRow}>
                    <Text variant="sm" weight="medium" color={colors.gray[500]}>
                      Value:
                    </Text>
                    <Text variant="sm" style={{ color: getStatusColor(result.status) }}>
                      {result.value} {result.unit}
                    </Text>
                  </View>

                  {result.referenceRange && (
                    <View style={styles.detailRow}>
                      <Text variant="sm" weight="medium" color={colors.gray[500]}>
                        Reference Range:
                      </Text>
                      <Text variant="sm">
                        {result.referenceRange.min} - {result.referenceRange.max} {result.unit}
                      </Text>
                    </View>
                  )}

                  <View style={styles.detailRow}>
                    <Text variant="sm" weight="medium" color={colors.gray[500]}>
                      Date:
                    </Text>
                    <Text variant="sm">{result.date}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text variant="sm" weight="medium" color={colors.gray[500]}>
                      Ordered By:
                    </Text>
                    <Text variant="sm">{result.orderedBy}</Text>
                  </View>

                  {result.lab && (
                    <View style={styles.detailRow}>
                      <Text variant="sm" weight="medium" color={colors.gray[500]}>
                        Lab:
                      </Text>
                      <Text variant="sm">{result.lab}</Text>
                    </View>
                  )}

                  {result.notes && (
                    <View style={styles.notes}>
                      <Text variant="sm" weight="medium" color={colors.gray[500]}>
                        Notes:
                      </Text>
                      <Text variant="sm">{result.notes}</Text>
                    </View>
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
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2]
  },
  valueInput: {
    flex: 1
  },
  unitText: {
    minWidth: 60
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
  resultsList: {
    flex: 1
  },
  resultCard: {
    marginBottom: spacing[4]
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing[4]
  },
  resultActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2]
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: 16
  },
  resultDetails: {
    gap: spacing[3]
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  notes: {
    gap: spacing[1]
  }
});