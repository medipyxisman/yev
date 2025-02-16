import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { colors } from '../../components/theme/colors';
import { spacing } from '../../components/theme/spacing';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import appointmentApi from '../../api/appointmentApi';

const appointmentTypes = [
  'initial',
  'follow-up',
  'treatment',
  'assessment'
] as const;

const durations = [
  { label: '30 minutes', value: 30 },
  { label: '45 minutes', value: 45 },
  { label: '1 hour', value: 60 },
  { label: '1.5 hours', value: 90 }
];

// Mock providers - replace with API call
const providers = [
  { id: 'p1', name: 'Dr. Smith' },
  { id: 'p2', name: 'Dr. Johnson' },
  { id: 'p3', name: 'Dr. Williams' }
];

export default function ScheduleAppointmentScreen() {
  const { patientId } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    patientId: patientId as string,
    providerId: '',
    date: '',
    time: '',
    duration: 30,
    type: 'follow-up' as typeof appointmentTypes[number],
    location: '',
    notes: '',
    woundCaseId: '',
    graftingDetails: {
      estSqcm: 0,
      graftBrand: ''
    }
  });

  useEffect(() => {
    if (formData.providerId && formData.date) {
      fetchAvailableTimeSlots();
    }
  }, [formData.providerId, formData.date]);

  const fetchAvailableTimeSlots = async () => {
    try {
      const slots = await appointmentApi.getProviderAvailability(
        formData.providerId,
        formData.date
      );
      setAvailableTimeSlots(slots);
    } catch (err) {
      console.error('Failed to fetch time slots:', err);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      // Basic validation
      if (!formData.providerId || !formData.date || !formData.time) {
        throw new Error('Please fill in all required fields');
      }

      await appointmentApi.createAppointment({
        ...formData,
        status: 'scheduled'
      });

      router.back();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to schedule appointment');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData(prev => ({
        ...prev,
        date: selectedDate.toISOString().split('T')[0],
        time: '' // Reset time when date changes
      }));
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text variant="2xl" weight="bold">Schedule Appointment</Text>
      </View>

      <Card variant="elevated" style={styles.form}>
        {error && (
          <Text color={colors.error[500]} style={styles.error}>
            {error}
          </Text>
        )}

        <View style={styles.fields}>
          <View style={styles.field}>
            <Text variant="sm" weight="medium" color={colors.gray[500]}>
              Provider *
            </Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.providerId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, providerId: value }))}
              >
                <Picker.Item label="Select provider" value="" />
                {providers.map(provider => (
                  <Picker.Item
                    key={provider.id}
                    label={provider.name}
                    value={provider.id}
                  />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.field}>
            <Text variant="sm" weight="medium" color={colors.gray[500]}>
              Date *
            </Text>
            <Button
              variant="outline"
              onPress={() => setShowDatePicker(true)}
            >
              {formData.date || 'Select date'}
            </Button>
            {showDatePicker && (
              <DateTimePicker
                value={formData.date ? new Date(formData.date) : new Date()}
                mode="date"
                onChange={handleDateChange}
                minimumDate={new Date()}
              />
            )}
          </View>

          <View style={styles.field}>
            <Text variant="sm" weight="medium" color={colors.gray[500]}>
              Time *
            </Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.time}
                onValueChange={(value) => setFormData(prev => ({ ...prev, time: value }))}
                enabled={availableTimeSlots.length > 0}
              >
                <Picker.Item label="Select time" value="" />
                {availableTimeSlots.map(slot => (
                  <Picker.Item key={slot} label={slot} value={slot} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.field}>
            <Text variant="sm" weight="medium" color={colors.gray[500]}>
              Duration
            </Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.duration}
                onValueChange={(value) => setFormData(prev => ({ ...prev, duration: value }))}
              >
                {durations.map(duration => (
                  <Picker.Item
                    key={duration.value}
                    label={duration.label}
                    value={duration.value}
                  />
                ))}
              </Picker>
            </View>
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
                {appointmentTypes.map(type => (
                  <Picker.Item
                    key={type}
                    label={type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                    value={type}
                  />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.field}>
            <Text variant="sm" weight="medium" color={colors.gray[500]}>
              Location
            </Text>
            <TextInput
              style={styles.input}
              value={formData.location}
              onChangeText={(text) => setFormData(prev => ({ ...prev, location: text }))}
              placeholder="Enter appointment location"
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

          {formData.type === 'treatment' && (
            <>
              <View style={styles.field}>
                <Text variant="sm" weight="medium" color={colors.gray[500]}>
                  Estimated Sqcm
                </Text>
                <TextInput
                  style={styles.input}
                  value={formData.graftingDetails.estSqcm.toString()}
                  onChangeText={(text) => setFormData(prev => ({
                    ...prev,
                    graftingDetails: {
                      ...prev.graftingDetails,
                      estSqcm: Number(text) || 0
                    }
                  }))}
                  keyboardType="numeric"
                  placeholder="Enter estimated square centimeters"
                  placeholderTextColor={colors.gray[400]}
                />
              </View>

              <View style={styles.field}>
                <Text variant="sm" weight="medium" color={colors.gray[500]}>
                  Graft Brand
                </Text>
                <TextInput
                  style={styles.input}
                  value={formData.graftingDetails.graftBrand}
                  onChangeText={(text) => setFormData(prev => ({
                    ...prev,
                    graftingDetails: {
                      ...prev.graftingDetails,
                      graftBrand: text
                    }
                  }))}
                  placeholder="Enter graft brand"
                  placeholderTextColor={colors.gray[400]}
                />
              </View>
            </>
          )}
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
            {loading ? 'Scheduling...' : 'Schedule Appointment'}
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
  header: {
    marginBottom: spacing[6]
  },
  form: {
    gap: spacing[8]
  },
  error: {
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
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing[3]
  }
});