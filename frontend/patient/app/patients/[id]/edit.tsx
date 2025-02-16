import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text } from '../../../components/ui/Text';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { colors } from '../../../components/theme/colors';
import { spacing } from '../../../components/theme/spacing';
import { Picker } from '@react-native-picker/picker';
import patientApi from '../../../api/patientApi';
import type { Patient, UpdatePatientRequest } from '../../../constants';

export default function EditPatientScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [formData, setFormData] = useState<UpdatePatientRequest>({});

  useEffect(() => {
    fetchPatient();
  }, [id]);

  const fetchPatient = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await patientApi.getPatientDetails(id as string);
      setPatient(data);
      setFormData({
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        phone: data.phone,
        email: data.email,
        address: data.address
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch patient details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!patient) return;

    try {
      setLoading(true);
      setError(null);

      // Basic validation
      if (!formData.firstName || !formData.lastName || !formData.dateOfBirth) {
        throw new Error('Please fill in all required fields');
      }

      await patientApi.updatePatient(patient.id, formData);
      router.back();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update patient');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !patient) {
    return (
      <View style={styles.container}>
        <Text>Loading patient details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text color={colors.error[500]}>{error}</Text>
        <Button variant="outline" onPress={fetchPatient}>
          Retry
        </Button>
      </View>
    );
  }

  if (!patient) {
    return (
      <View style={styles.container}>
        <Text>Patient not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text variant="2xl" weight="bold">Edit Patient</Text>
      </View>

      <Card variant="elevated" style={styles.form}>
        {error && (
          <Text color={colors.error[500]} style={styles.error}>
            {error}
          </Text>
        )}

        <View style={styles.section}>
          <Text variant="lg" weight="semibold" style={styles.sectionTitle}>
            Personal Information
          </Text>
          <View style={styles.fields}>
            <View style={styles.field}>
              <Text variant="sm" weight="medium" color={colors.gray[500]}>
                First Name *
              </Text>
              <TextInput
                style={styles.input}
                value={formData.firstName}
                onChangeText={(text) => setFormData(prev => ({ ...prev, firstName: text }))}
                placeholder="Enter first name"
                placeholderTextColor={colors.gray[400]}
              />
            </View>

            <View style={styles.field}>
              <Text variant="sm" weight="medium" color={colors.gray[500]}>
                Last Name *
              </Text>
              <TextInput
                style={styles.input}
                value={formData.lastName}
                onChangeText={(text) => setFormData(prev => ({ ...prev, lastName: text }))}
                placeholder="Enter last name"
                placeholderTextColor={colors.gray[400]}
              />
            </View>

            <View style={styles.field}>
              <Text variant="sm" weight="medium" color={colors.gray[500]}>
                Date of Birth *
              </Text>
              <TextInput
                style={styles.input}
                value={formData.dateOfBirth}
                onChangeText={(text) => setFormData(prev => ({ ...prev, dateOfBirth: text }))}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.gray[400]}
              />
            </View>

            <View style={styles.field}>
              <Text variant="sm" weight="medium" color={colors.gray[500]}>
                Gender
              </Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.gender}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
                >
                  <Picker.Item label="Male" value="male" />
                  <Picker.Item label="Female" value="female" />
                  <Picker.Item label="Other" value="other" />
                </Picker>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text variant="lg" weight="semibold" style={styles.sectionTitle}>
            Contact Information
          </Text>
          <View style={styles.fields}>
            <View style={styles.field}>
              <Text variant="sm" weight="medium" color={colors.gray[500]}>
                Phone Number
              </Text>
              <TextInput
                style={styles.input}
                value={formData.phone}
                onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
                placeholder="Enter phone number"
                placeholderTextColor={colors.gray[400]}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.field}>
              <Text variant="sm" weight="medium" color={colors.gray[500]}>
                Email
              </Text>
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                placeholder="Enter email address"
                placeholderTextColor={colors.gray[400]}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text variant="lg" weight="semibold" style={styles.sectionTitle}>
            Address
          </Text>
          <View style={styles.fields}>
            <View style={styles.field}>
              <Text variant="sm" weight="medium" color={colors.gray[500]}>
                Street Address
              </Text>
              <TextInput
                style={styles.input}
                value={formData.address?.street}
                onChangeText={(text) => setFormData(prev => ({
                  ...prev,
                  address: { ...prev.address, street: text }
                }))}
                placeholder="Enter street address"
                placeholderTextColor={colors.gray[400]}
              />
            </View>

            <View style={styles.field}>
              <Text variant="sm" weight="medium" color={colors.gray[500]}>
                City
              </Text>
              <TextInput
                style={styles.input}
                value={formData.address?.city}
                onChangeText={(text) => setFormData(prev => ({
                  ...prev,
                  address: { ...prev.address, city: text }
                }))}
                placeholder="Enter city"
                placeholderTextColor={colors.gray[400]}
              />
            </View>

            <View style={styles.field}>
              <Text variant="sm" weight="medium" color={colors.gray[500]}>
                State
              </Text>
              <TextInput
                style={styles.input}
                value={formData.address?.state}
                onChangeText={(text) => setFormData(prev => ({
                  ...prev,
                  address: { ...prev.address, state: text }
                }))}
                placeholder="Enter state"
                placeholderTextColor={colors.gray[400]}
              />
            </View>

            <View style={styles.field}>
              <Text variant="sm" weight="medium" color={colors.gray[500]}>
                ZIP Code
              </Text>
              <TextInput
                style={styles.input}
                value={formData.address?.zipCode}
                onChangeText={(text) => setFormData(prev => ({
                  ...prev,
                  address: { ...prev.address, zipCode: text }
                }))}
                placeholder="Enter ZIP code"
                placeholderTextColor={colors.gray[400]}
                keyboardType="numeric"
              />
            </View>
          </View>
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
            {loading ? 'Saving...' : 'Save Changes'}
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
  section: {
    gap: spacing[4]
  },
  sectionTitle: {
    marginBottom: spacing[2]
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 8,
    backgroundColor: colors.gray[50],
    overflow: 'hidden'
  },
  error: {
    marginBottom: spacing[4]
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing[3]
  }
});