import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput } from 'react-native';
import { Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react-native';
import { Text } from '../../ui/Text';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

interface Appointment {
  id: string;
  date: string;
  time: string;
  location: string;
  purpose: string;
  notes?: string;
  estSqcm?: number;
  graftBrand?: string;
}

// Mock data - replace with API call
const mockAppointments: Appointment[] = [
  {
    id: '1',
    date: '2024-03-20',
    time: '10:00 AM',
    location: '123 Main St, Anytown, CA 12345',
    purpose: 'Wound Check-up',
    notes: 'Regular follow-up appointment',
    estSqcm: 25,
    graftBrand: '180 Health'
  },
  {
    id: '2',
    date: '2024-03-25',
    time: '2:30 PM',
    location: '123 Main St, Anytown, CA 12345',
    purpose: 'Grafting',
    notes: 'Scheduled grafting procedure',
    estSqcm: 30,
    graftBrand: 'Reprise Medical'
  }
];

const purposeOptions = ['Consultation', 'Grafting', 'Wound Check-up'];
const graftBrandOptions = ['180 Health', 'Reprise Medical', 'NextGen'];

interface CalendarProps {
  patientId: string;
}

export function Calendar({ patientId }: CalendarProps) {
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [newAppointment, setNewAppointment] = useState<Partial<Appointment>>({
    date: '',
    time: '',
    location: '',
    purpose: '',
    notes: '',
    estSqcm: undefined,
    graftBrand: ''
  });

  const handleSaveAppointment = () => {
    // TODO: Save appointment to server
    console.log('Saving appointment:', newAppointment);
    setShowNewAppointment(false);
    setNewAppointment({
      date: '',
      time: '',
      location: '',
      purpose: '',
      notes: '',
      estSqcm: undefined,
      graftBrand: ''
    });
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setNewAppointment({
        ...newAppointment,
        date: selectedDate.toISOString().split('T')[0]
      });
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setNewAppointment({
        ...newAppointment,
        time: selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="xl" weight="semibold">Appointments</Text>
        <Button
          onPress={() => setShowNewAppointment(true)}
          variant="primary"
        >
          Schedule Appointment
        </Button>
      </View>

      {showNewAppointment && (
        <Card variant="elevated" style={styles.form}>
          <Text variant="lg" weight="semibold" style={styles.formTitle}>
            New Appointment
          </Text>

          <View style={styles.formGrid}>
            <View style={styles.formField}>
              <Text variant="sm" weight="medium" color={colors.gray[500]}>
                Date
              </Text>
              <Button
                variant="outline"
                onPress={() => setShowDatePicker(true)}
              >
                {newAppointment.date || 'Select date'}
              </Button>
              {showDatePicker && (
                <DateTimePicker
                  value={new Date()}
                  mode="date"
                  onChange={handleDateChange}
                />
              )}
            </View>

            <View style={styles.formField}>
              <Text variant="sm" weight="medium" color={colors.gray[500]}>
                Time
              </Text>
              <Button
                variant="outline"
                onPress={() => setShowTimePicker(true)}
              >
                {newAppointment.time || 'Select time'}
              </Button>
              {showTimePicker && (
                <DateTimePicker
                  value={new Date()}
                  mode="time"
                  onChange={handleTimeChange}
                />
              )}
            </View>

            <View style={styles.formField}>
              <Text variant="sm" weight="medium" color={colors.gray[500]}>
                Location
              </Text>
              <TextInput
                style={styles.input}
                value={newAppointment.location}
                onChangeText={(text) => setNewAppointment({ ...newAppointment, location: text })}
                placeholder="Enter address"
                placeholderTextColor={colors.gray[400]}
              />
            </View>

            <View style={styles.formField}>
              <Text variant="sm" weight="medium" color={colors.gray[500]}>
                Purpose
              </Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={newAppointment.purpose}
                  onValueChange={(value) => setNewAppointment({ ...newAppointment, purpose: value })}
                >
                  <Picker.Item label="Select purpose" value="" />
                  {purposeOptions.map((purpose) => (
                    <Picker.Item key={purpose} label={purpose} value={purpose} />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={styles.formField}>
              <Text variant="sm" weight="medium" color={colors.gray[500]}>
                Est. Sqcm
              </Text>
              <TextInput
                style={styles.input}
                value={newAppointment.estSqcm?.toString()}
                onChangeText={(text) => setNewAppointment({ ...newAppointment, estSqcm: Number(text) })}
                keyboardType="numeric"
                placeholder="Enter estimated square centimeters"
                placeholderTextColor={colors.gray[400]}
              />
            </View>

            <View style={styles.formField}>
              <Text variant="sm" weight="medium" color={colors.gray[500]}>
                Graft Brand
              </Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={newAppointment.graftBrand}
                  onValueChange={(value) => setNewAppointment({ ...newAppointment, graftBrand: value })}
                >
                  <Picker.Item label="Select graft brand" value="" />
                  {graftBrandOptions.map((brand) => (
                    <Picker.Item key={brand} label={brand} value={brand} />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={styles.formField}>
              <Text variant="sm" weight="medium" color={colors.gray[500]}>
                Notes
              </Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={newAppointment.notes}
                onChangeText={(text) => setNewAppointment({ ...newAppointment, notes: text })}
                multiline
                numberOfLines={3}
                placeholder="Add any additional notes"
                placeholderTextColor={colors.gray[400]}
              />
            </View>
          </View>

          <View style={styles.formActions}>
            <Button
              variant="outline"
              onPress={() => setShowNewAppointment(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onPress={handleSaveAppointment}
            >
              Save Appointment
            </Button>
          </View>
        </Card>
      )}

      <ScrollView style={styles.appointmentsList}>
        {mockAppointments.map((appointment) => (
          <Card key={appointment.id} variant="elevated" style={styles.appointmentCard}>
            <View style={styles.appointmentHeader}>
              <View style={styles.appointmentInfo}>
                <View style={styles.dateTimeContainer}>
                  <CalendarIcon size={20} color={colors.gray[400]} />
                  <View style={styles.dateTime}>
                    <Text weight="medium">{appointment.date}</Text>
                    <Text variant="sm" color={colors.gray[500]}>{appointment.time}</Text>
                  </View>
                </View>
                <Text variant="lg" weight="medium">{appointment.purpose}</Text>
              </View>
            </View>

            <View style={styles.appointmentDetails}>
              <View style={styles.detailRow}>
                <MapPin size={16} color={colors.gray[400]} />
                <Text color={colors.gray[600]}>{appointment.location}</Text>
              </View>
              {appointment.estSqcm && (
                <Text variant="sm" color={colors.gray[600]}>
                  Est. Sqcm: {appointment.estSqcm}
                </Text>
              )}
              {appointment.graftBrand && (
                <Text variant="sm" color={colors.gray[600]}>
                  Graft Brand: {appointment.graftBrand}
                </Text>
              )}
              {appointment.notes && (
                <Text variant="sm" color={colors.gray[500]} style={styles.notes}>
                  {appointment.notes}
                </Text>
              )}
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacing[6]
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  form: {
    gap: spacing[6]
  },
  formTitle: {
    marginBottom: spacing[4]
  },
  formGrid: {
    gap: spacing[4]
  },
  formField: {
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
  appointmentsList: {
    flex: 1
  },
  appointmentCard: {
    marginBottom: spacing[4]
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing[4]
  },
  appointmentInfo: {
    flex: 1,
    gap: spacing[2]
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3]
  },
  dateTime: {
    gap: spacing[1]
  },
  appointmentDetails: {
    gap: spacing[2]
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2]
  },
  notes: {
    marginTop: spacing[2]
  }
});