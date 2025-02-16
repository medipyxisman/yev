import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Container } from '../../../components/ui/Container';
import { Text } from '../../../components/ui/Text';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { colors } from '../../../components/theme/colors';
import { spacing } from '../../../components/theme/spacing';
import { Edit2, Archive } from 'lucide-react-native';
import { Badge } from '../../../components/ui/Badge';
import patientApi from '../../../api/patientApi';
import type { Patient } from '../../../constants';

export default function PatientDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchPatient();
  }, [id]);

  const fetchPatient = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await patientApi.getPatientDetails(id as string);
      setPatient(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch patient details');
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async () => {
    if (!patient) return;

    try {
      setLoading(true);
      setError(null);
      await patientApi.archivePatient(patient.id);
      await fetchPatient();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to archive patient');
    } finally {
      setLoading(false);
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'warning';
      case 'archived':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading && !patient) {
    return (
      <Container>
        <Text>Loading patient details...</Text>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Text color={colors.error[500]}>{error}</Text>
        <Button variant="outline" onPress={fetchPatient}>
          Retry
        </Button>
      </Container>
    );
  }

  if (!patient) {
    return (
      <Container>
        <Text>Patient not found</Text>
      </Container>
    );
  }

  return (
    <Container>
      <ScrollView>
        <View style={styles.header}>
          <View>
            <Text variant="3xl" weight="bold">
              {patient.firstName} {patient.lastName}
            </Text>
            <Text variant="sm" color={colors.gray[500]}>
              ID: {patient.id}
            </Text>
          </View>
          <View style={styles.headerActions}>
            <Badge
              label={patient.status}
              variant={getStatusVariant(patient.status)}
            />
            <Button
              variant="outline"
              leftIcon={Edit2}
              onPress={() => setIsEditing(true)}
            >
              Edit
            </Button>
            <Button
              variant="outline"
              leftIcon={Archive}
              onPress={handleArchive}
            >
              Archive
            </Button>
          </View>
        </View>

        <View style={styles.content}>
          {/* Personal Information */}
          <Card variant="elevated" style={styles.section}>
            <Text variant="lg" weight="semibold" style={styles.sectionTitle}>
              Personal Information
            </Text>
            <View style={styles.grid}>
              <View style={styles.field}>
                <Text variant="sm" color={colors.gray[500]}>Date of Birth</Text>
                <Text>{patient.dateOfBirth}</Text>
              </View>
              <View style={styles.field}>
                <Text variant="sm" color={colors.gray[500]}>Gender</Text>
                <Text style={styles.capitalize}>{patient.gender}</Text>
              </View>
            </View>
          </Card>

          {/* Contact Information */}
          <Card variant="elevated" style={styles.section}>
            <Text variant="lg" weight="semibold" style={styles.sectionTitle}>
              Contact Information
            </Text>
            <View style={styles.grid}>
              <View style={styles.field}>
                <Text variant="sm" color={colors.gray[500]}>Phone</Text>
                <Text>{patient.phone || 'N/A'}</Text>
              </View>
              <View style={styles.field}>
                <Text variant="sm" color={colors.gray[500]}>Email</Text>
                <Text>{patient.email || 'N/A'}</Text>
              </View>
            </View>
          </Card>

          {/* Address */}
          {patient.address && (
            <Card variant="elevated" style={styles.section}>
              <Text variant="lg" weight="semibold" style={styles.sectionTitle}>
                Address
              </Text>
              <View style={styles.grid}>
                <View style={styles.field}>
                  <Text variant="sm" color={colors.gray[500]}>Street</Text>
                  <Text>{patient.address.street}</Text>
                </View>
                <View style={styles.field}>
                  <Text variant="sm" color={colors.gray[500]}>City</Text>
                  <Text>{patient.address.city}</Text>
                </View>
                <View style={styles.field}>
                  <Text variant="sm" color={colors.gray[500]}>State</Text>
                  <Text>{patient.address.state}</Text>
                </View>
                <View style={styles.field}>
                  <Text variant="sm" color={colors.gray[500]}>ZIP Code</Text>
                  <Text>{patient.address.zipCode}</Text>
                </View>
              </View>
            </Card>
          )}

          {/* Medical History */}
          {patient.medicalHistory && (
            <Card variant="elevated" style={styles.section}>
              <Text variant="lg" weight="semibold" style={styles.sectionTitle}>
                Medical History
              </Text>
              <View style={styles.grid}>
                <View style={styles.field}>
                  <Text variant="sm" color={colors.gray[500]}>Conditions</Text>
                  <View style={styles.tags}>
                    {patient.medicalHistory.conditions.map((condition, index) => (
                      <View key={index} style={styles.tag}>
                        <Text variant="sm">{condition}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                <View style={styles.field}>
                  <Text variant="sm" color={colors.gray[500]}>Allergies</Text>
                  <View style={styles.tags}>
                    {patient.medicalHistory.allergies.map((allergy, index) => (
                      <View key={index} style={styles.tag}>
                        <Text variant="sm">{allergy}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                <View style={styles.field}>
                  <Text variant="sm" color={colors.gray[500]}>Medications</Text>
                  <View style={styles.tags}>
                    {patient.medicalHistory.medications.map((medication, index) => (
                      <View key={index} style={styles.tag}>
                        <Text variant="sm">{medication}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </Card>
          )}
        </View>
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing[6]
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3]
  },
  content: {
    gap: spacing[4]
  },
  section: {
    gap: spacing[4]
  },
  sectionTitle: {
    marginBottom: spacing[2]
  },
  grid: {
    gap: spacing[4]
  },
  field: {
    gap: spacing[1]
  },
  capitalize: {
    textTransform: 'capitalize'
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2]
  },
  tag: {
    backgroundColor: colors.gray[100],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: 16
  }
});