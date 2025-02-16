import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text } from '../../../components/ui/Text';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { IconButton } from '../../../components/ui/IconButton';
import { colors } from '../../../components/theme/colors';
import { spacing } from '../../../components/theme/spacing';
import { Calendar, Clock, MapPin, X } from 'lucide-react-native';
import appointmentApi, { Appointment } from '../../../api/appointmentApi';
import { Picker } from '@react-native-picker/picker';

const statusFilters = [
  'all',
  'scheduled',
  'confirmed',
  'completed',
  'cancelled',
  'no-show'
] as const;

export default function AppointmentsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<typeof statusFilters[number]>('all');

  useEffect(() => {
    fetchAppointments();
  }, [id]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await appointmentApi.getAppointments(id as string);
      setAppointments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (appointmentId: string) => {
    try {
      setLoading(true);
      setError(null);
      await appointmentApi.cancelAppointment(appointmentId);
      await fetchAppointments();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel appointment');
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments = appointments.filter(
    appointment => statusFilter === 'all' || appointment.status === statusFilter
  );

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'scheduled':
        return colors.primary[600];
      case 'confirmed':
        return colors.success[500];
      case 'completed':
        return colors.gray[500];
      case 'cancelled':
        return colors.error[500];
      case 'no-show':
        return colors.warning[500];
      default:
        return colors.gray[500];
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="2xl" weight="bold">Appointments</Text>
        <Button
          variant="primary"
          onPress={() => router.push('/(modals)/schedule-appointment')}
        >
          Schedule Appointment
        </Button>
      </View>

      {error && (
        <Text color={colors.error[500]} style={styles.error}>
          {error}
        </Text>
      )}

      <View style={styles.filters}>
        <View style={styles.filterContainer}>
          <Text variant="sm" weight="medium" color={colors.gray[500]}>
            Status
          </Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={statusFilter}
              onValueChange={setStatusFilter}
              style={styles.picker}
            >
              {statusFilters.map(status => (
                <Picker.Item
                  key={status}
                  label={status === 'all' ? 'All Appointments' : status.charAt(0).toUpperCase() + status.slice(1)}
                  value={status}
                />
              ))}
            </Picker>
          </View>
        </View>
      </View>

      <ScrollView style={styles.appointmentsList}>
        {loading && appointments.length === 0 ? (
          <Text style={styles.emptyText}>Loading appointments...</Text>
        ) : filteredAppointments.length === 0 ? (
          <Text style={styles.emptyText}>
            {statusFilter !== 'all'
              ? `No ${statusFilter} appointments found`
              : 'No appointments scheduled'}
          </Text>
        ) : (
          filteredAppointments.map(appointment => (
            <Card key={appointment.id} variant="elevated" style={styles.appointmentCard}>
              <View style={styles.appointmentHeader}>
                <View style={styles.dateTimeContainer}>
                  <Calendar size={20} color={colors.gray[400]} />
                  <View style={styles.dateTime}>
                    <Text weight="medium">{appointment.date}</Text>
                    <View style={styles.timeContainer}>
                      <Clock size={16} color={colors.gray[400]} />
                      <Text variant="sm" color={colors.gray[600]}>
                        {appointment.time} ({appointment.duration} min)
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: `${getStatusColor(appointment.status)}10` }
                ]}>
                  <Text
                    variant="sm"
                    weight="medium"
                    color={getStatusColor(appointment.status)}
                  >
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </Text>
                </View>
              </View>

              <View style={styles.appointmentDetails}>
                <View style={styles.detailRow}>
                  <Text variant="sm" weight="medium" color={colors.gray[500]}>
                    Type:
                  </Text>
                  <Text variant="sm">
                    {appointment.type.charAt(0).toUpperCase() + appointment.type.slice(1)}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text variant="sm" weight="medium" color={colors.gray[500]}>
                    Provider:
                  </Text>
                  <Text variant="sm">{appointment.providerId}</Text>
                </View>

                <View style={styles.locationContainer}>
                  <MapPin size={16} color={colors.gray[400]} />
                  <Text variant="sm" color={colors.gray[600]}>
                    {appointment.location}
                  </Text>
                </View>

                {appointment.notes && (
                  <Text variant="sm" color={colors.gray[500]} style={styles.notes}>
                    {appointment.notes}
                  </Text>
                )}

                {appointment.type === 'treatment' && appointment.graftingDetails && (
                  <View style={styles.graftingDetails}>
                    <Text variant="sm" weight="medium" color={colors.gray[500]}>
                      Grafting Details:
                    </Text>
                    <Text variant="sm">
                      {appointment.graftingDetails.estSqcm} sqcm - {appointment.graftingDetails.graftBrand}
                    </Text>
                  </View>
                )}
              </View>

              {appointment.status === 'scheduled' && (
                <View style={styles.actions}>
                  <Button
                    variant="outline"
                    leftIcon={X}
                    onPress={() => handleCancel(appointment.id)}
                  >
                    Cancel Appointment
                  </Button>
                </View>
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
  filters: {
    marginBottom: spacing[4]
  },
  filterContainer: {
    gap: spacing[2]
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 8,
    backgroundColor: colors.gray[50],
    overflow: 'hidden'
  },
  picker: {
    height: 40
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
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[3]
  },
  dateTime: {
    gap: spacing[1]
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1]
  },
  statusBadge: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: 16
  },
  appointmentDetails: {
    gap: spacing[3]
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2]
  },
  notes: {
    marginTop: spacing[2]
  },
  graftingDetails: {
    gap: spacing[1],
    marginTop: spacing[2]
  },
  actions: {
    marginTop: spacing[4],
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  emptyText: {
    textAlign: 'center',
    color: colors.gray[500],
    padding: spacing[4]
  }
});