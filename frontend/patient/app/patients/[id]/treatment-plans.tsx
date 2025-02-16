import React, { useState } from 'react';
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

interface TreatmentPlan {
  id: string;
  title: string;
  startDate: string;
  endDate?: string;
  status: 'active' | 'completed' | 'discontinued';
  type: 'wound_care' | 'medication' | 'therapy' | 'lifestyle';
  frequency: string;
  instructions: string;
  goals: string[];
  provider: string;
  notes?: string;
  progress?: {
    date: string;
    note: string;
    status: 'on_track' | 'needs_adjustment' | 'behind';
  }[];
}

const treatmentTypes = [
  'wound_care',
  'medication',
  'therapy',
  'lifestyle'
] as const;

const frequencies = [
  'Daily',
  'Twice daily',
  'Weekly',
  'Biweekly',
  'Monthly',
  'As needed'
];

// Mock data - replace with API call
const mockTreatmentPlans: TreatmentPlan[] = [
  {
    id: '1',
    title: 'Wound Dressing Change',
    startDate: '2024-03-01',
    status: 'active',
    type: 'wound_care',
    frequency: 'Daily',
    instructions: 'Clean wound with saline, apply prescribed ointment, cover with sterile dressing',
    goals: [
      'Prevent infection',
      'Promote healing',
      'Maintain moist wound environment'
    ],
    provider: 'Dr. Smith',
    progress: [
      {
        date: '2024-03-15',
        note: 'Wound showing signs of improvement',
        status: 'on_track'
      }
    ]
  }
];

export default function TreatmentPlansScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [treatmentPlans, setTreatmentPlans] = useState<TreatmentPlan[]>(mockTreatmentPlans);
  const [showNewPlan, setShowNewPlan] = useState(false);
  const [editingPlan, setEditingPlan] = useState<TreatmentPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    startDate: '',
    endDate: '',
    type: 'wound_care' as TreatmentPlan['type'],
    frequency: frequencies[0],
    instructions: '',
    goals: [''],
    notes: ''
  });

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!formData.title || !formData.startDate || !formData.instructions) {
        throw new Error('Please fill in all required fields');
      }

      // TODO: Replace with API call
      const newPlan: TreatmentPlan = {
        id: Math.random().toString(),
        ...formData,
        status: 'active',
        provider: 'Current Provider', // TODO: Get from auth context
        goals: formData.goals.filter(goal => goal.trim() !== '')
      };

      setTreatmentPlans(prev => [...prev, newPlan]);
      setShowNewPlan(false);
      setFormData({
        title: '',
        startDate: '',
        endDate: '',
        type: 'wound_care',
        frequency: frequencies[0],
        instructions: '',
        goals: [''],
        notes: ''
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save treatment plan');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingPlan) return;

    try {
      setLoading(true);
      setError(null);

      // TODO: Replace with API call
      setTreatmentPlans(prev =>
        prev.map(plan =>
          plan.id === editingPlan.id
            ? {
                ...plan,
                ...formData,
                goals: formData.goals.filter(goal => goal.trim() !== '')
              }
            : plan
        )
      );

      setEditingPlan(null);
      setFormData({
        title: '',
        startDate: '',
        endDate: '',
        type: 'wound_care',
        frequency: frequencies[0],
        instructions: '',
        goals: [''],
        notes: ''
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update treatment plan');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (planId: string) => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Replace with API call
      setTreatmentPlans(prev => prev.filter(plan => plan.id !== planId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete treatment plan');
    } finally {
      setLoading(false);
    }
  };

  const TreatmentPlanForm = ({ onSubmit, onCancel }: { onSubmit: () => void; onCancel: () => void }) => (
    <Card variant="elevated" style={styles.form}>
      <View style={styles.formFields}>
        <View style={styles.field}>
          <Text variant="sm" weight="medium" color={colors.gray[500]}>
            Title *
          </Text>
          <TextInput
            style={styles.input}
            value={formData.title}
            onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
            placeholder="Enter treatment plan title"
            placeholderTextColor={colors.gray[400]}
          />
        </View>

        <View style={styles.field}>
          <Text variant="sm" weight="medium" color={colors.gray[500]}>
            Type
          </Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.type}
              onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
            >
              {treatmentTypes.map(type => (
                <Picker.Item
                  key={type}
                  label={type.split('_').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                  value={type}
                />
              ))}
            </Picker>
          </View>
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
            Instructions *
          </Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.instructions}
            onChangeText={(text) => setFormData(prev => ({ ...prev, instructions: text }))}
            placeholder="Enter detailed instructions"
            placeholderTextColor={colors.gray[400]}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.field}>
          <Text variant="sm" weight="medium" color={colors.gray[500]}>
            Goals
          </Text>
          {formData.goals.map((goal, index) => (
            <View key={index} style={styles.goalInput}>
              <TextInput
                style={styles.input}
                value={goal}
                onChangeText={(text) => {
                  const newGoals = [...formData.goals];
                  newGoals[index] = text;
                  setFormData(prev => ({ ...prev, goals: newGoals }));
                }}
                placeholder="Enter goal"
                placeholderTextColor={colors.gray[400]}
              />
              {index === formData.goals.length - 1 && (
                <IconButton
                  icon={Plus}
                  size={20}
                  color={colors.primary[600]}
                  onPress={() => setFormData(prev => ({
                    ...prev,
                    goals: [...prev.goals, '']
                  }))}
                />
              )}
            </View>
          ))}
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
          {loading ? 'Saving...' : 'Save Treatment Plan'}
        </Button>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="2xl" weight="bold">Treatment Plans</Text>
        <Button
          variant="primary"
          leftIcon={Plus}
          onPress={() => setShowNewPlan(true)}
          disabled={loading}
        >
          Add Treatment Plan
        </Button>
      </View>

      {error && (
        <Text color={colors.error[500]} style={styles.error}>
          {error}
        </Text>
      )}

      {showNewPlan && (
        <TreatmentPlanForm
          onSubmit={handleSave}
          onCancel={() => setShowNewPlan(false)}
        />
      )}

      <ScrollView style={styles.plansList}>
        {treatmentPlans.map(plan => (
          <Card key={plan.id} variant="elevated" style={styles.planCard}>
            {editingPlan?.id === plan.id ? (
              <TreatmentPlanForm
                onSubmit={handleUpdate}
                onCancel={() => setEditingPlan(null)}
              />
            ) : (
              <>
                <View style={styles.planHeader}>
                  <View>
                    <Text weight="medium">{plan.title}</Text>
                    <Text variant="sm" color={colors.gray[500]}>
                      {plan.type.split('_').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')} - {plan.frequency}
                    </Text>
                  </View>
                  <View style={styles.planActions}>
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: plan.status === 'active' ? colors.success[50] : colors.gray[100] }
                    ]}>
                      <Text
                        variant="sm"
                        weight="medium"
                        color={plan.status === 'active' ? colors.success[700] : colors.gray[600]}
                      >
                        {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
                      </Text>
                    </View>
                    <IconButton
                      icon={Edit2}
                      size={20}
                      color={colors.gray[500]}
                      onPress={() => {
                        setEditingPlan(plan);
                        setFormData({
                          title: plan.title,
                          startDate: plan.startDate,
                          endDate: plan.endDate || '',
                          type: plan.type,
                          frequency: plan.frequency,
                          instructions: plan.instructions,
                          goals: [...plan.goals, ''],
                          notes: plan.notes || ''
                        });
                      }}
                    />
                    <IconButton
                      icon={Trash2}
                      size={20}
                      color={colors.error[500]}
                      onPress={() => handleDelete(plan.id)}
                    />
                  </View>
                </View>

                <View style={styles.planDetails}>
                  <View style={styles.detailSection}>
                    <Text variant="sm" weight="medium" color={colors.gray[500]}>
                      Instructions:
                    </Text>
                    <Text variant="sm">{plan.instructions}</Text>
                  </View>

                  <View style={styles.detailSection}>
                    <Text variant="sm" weight="medium" color={colors.gray[500]}>
                      Goals:
                    </Text>
                    {plan.goals.map((goal, index) => (
                      <Text key={index} variant="sm" style={styles.goal}>
                        • {goal}
                      </Text>
                    ))}
                  </View>

                  {plan.progress && plan.progress.length > 0 && (
                    <View style={styles.detailSection}>
                      <Text variant="sm" weight="medium" color={colors.gray[500]}>
                        Progress:
                      </Text>
                      {plan.progress.map((progress, index) => (
                        <View key={index} style={styles.progressItem}>
                          <View style={styles.progressHeader}>
                            <Text variant="sm" weight="medium">
                              {progress.date}
                            </Text>
                            <View style={[
                              styles.statusBadge,
                              { backgroundColor: progress.status === 'on_track' ? colors.success[50] : colors.warning[50] }
                            ]}>
                              <Text
                                variant="sm"
                                weight="medium"
                                color={progress.status === 'on_track' ? colors.success[700] : colors.warning[700]}
                              >
                                {progress.status.split('_').map(word => 
                                  word.charAt(0).toUpperCase() + word.slice(1)
                                ).join(' ')}
                              </Text>
                            </View>
                          </View>
                          <Text variant="sm">{progress.note}</Text>
                        </View>
                      ))}
                    </View>
                  )}

                  {plan.notes && (
                    <View style={styles.detailSection}>
                      <Text variant="sm" weight="medium" color={colors.gray[500]}>
                        Notes:
                      </Text>
                      <Text variant="sm">{plan.notes}</Text>
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
  goalInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2]
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing[3]
  },
  plansList: {
    flex: 1
  },
  planCard: {
    marginBottom: spacing[4]
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing[4]
  },
  planActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2]
  },
  statusBadge: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: 16
  },
  planDetails: {
    gap: spacing[4]
  },
  detailSection: {
    gap: spacing[2]
  },
  goal: {
    marginLeft: spacing[4]
  },
  progressItem: {
    gap: spacing[2],
    padding: spacing[3],
    backgroundColor: colors.gray[50],
    borderRadius: 8
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
});