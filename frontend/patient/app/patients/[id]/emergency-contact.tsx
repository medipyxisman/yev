import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TextInput } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Text } from '../../../components/ui/Text';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { colors } from '../../../components/theme/colors';
import { spacing } from '../../../components/theme/spacing';
import emergencyContactApi from '../../../api/emergencyContactApi';
import type { Patient, EmergencyContact } from '../../../constants';

export default function EmergencyContactScreen() {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [formData, setFormData] = useState<EmergencyContact>({
    name: '',
    relationship: '',
    phoneNumber: ''
  });

  useEffect(() => {
    if (patient?.emergencyContact) {
      setFormData(patient.emergencyContact);
    }
  }, [patient]);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      setError(null);

      // Basic validation
      if (!formData.name || !formData.relationship || !formData.phoneNumber) {
        throw new Error('Please fill in all required fields');
      }

      await emergencyContactApi.updateEmergencyContact(id as string, formData);
      // Refresh patient data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update emergency contact');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    try {
      setLoading(true);
      setError(null);
      await emergencyContactApi.removeEmergencyContact(id as string);
      setFormData({
        name: '',
        relationship: '',
        phoneNumber: ''
      });
      // Refresh patient data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove emergency contact');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text variant="2xl" weight="bold">Emergency Contact</Text>
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
              Full Name *
            </Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
              placeholder="Enter contact name"
              placeholderTextColor={colors.gray[400]}
            />
          </View>

          <View style={styles.field}>
            <Text variant="sm" weight="medium" color={colors.gray[500]}>
              Relationship *
            </Text>
            <TextInput
              style={styles.input}
              value={formData.relationship}
              onChangeText={(text) => setFormData(prev => ({ ...prev, relationship: text }))}
              placeholder="Enter relationship"
              placeholderTextColor={colors.gray[400]}
            />
          </View>

          <View style={styles.field}>
            <Text variant="sm" weight="medium" color={colors.gray[500]}>
              Phone Number *
            </Text>
            <TextInput
              style={styles.input}
              value={formData.phoneNumber}
              onChangeText={(text) => setFormData(prev => ({ ...prev, phoneNumber: text }))}
              placeholder="Enter phone number"
              placeholderTextColor={colors.gray[400]}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <View style={styles.actions}>
          <Button
            variant="outline"
            onPress={handleRemove}
            disabled={loading}
          >
            Remove Contact
          </Button>
          <Button
            variant="primary"
            onPress={handleUpdate}
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
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing[3]
  }
});