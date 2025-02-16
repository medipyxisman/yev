import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput, Platform } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Text } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { colors } from '../../components/theme/colors';
import { spacing } from '../../components/theme/spacing';
import { Picker } from '@react-native-picker/picker';
import woundCaseApi from '../../api/woundCaseApi';

const woundTypes = [
  'Pressure Ulcer',
  'Diabetic Ulcer',
  'Venous Ulcer',
  'Arterial Ulcer',
  'Surgical Wound',
  'Traumatic Wound'
];

const locations = [
  'Left Lower Leg',
  'Right Lower Leg',
  'Left Foot',
  'Right Foot',
  'Sacrum',
  'Left Hip',
  'Right Hip',
  'Other'
];

export default function NewWoundCaseScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    description: '',
    location: '',
    type: '',
    etiology: '',
    dimensions: {
      length: '',
      width: '',
      depth: ''
    },
    hasUndermining: false,
    underminingDetails: {
      depth: '',
      direction: ''
    },
    allergies: '',
    chronicConditions: '',
    smokingStatus: 'no',
    medications: '',
    supportSystem: '',
    psychosocialFactors: ''
  });

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validate required fields
      if (!formData.location || !formData.type || !formData.description) {
        throw new Error('Please fill in all required fields');
      }

      // Convert dimensions to numbers
      const dimensions = {
        length: parseFloat(formData.dimensions.length) || 0,
        width: parseFloat(formData.dimensions.width) || 0,
        depth: parseFloat(formData.dimensions.depth) || 0
      };

      // Prepare data for API
      const woundData = {
        patient: 'current-patient-id', // TODO: Get from context or props
        location: formData.location,
        type: formData.type.toLowerCase().replace(' ', '_') as any,
        identifiedDate: new Date().toISOString(),
        initialMeasurements: dimensions,
        etiology: formData.etiology,
        notes: formData.description
      };

      await woundCaseApi.createWoundCase(woundData);
      router.back();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create wound case');
    } finally {
      setLoading(false);
    }
  };

  const updateDimension = (field: 'length' | 'width' | 'depth', value: string) => {
    setFormData(prev => ({
      ...prev,
      dimensions: {
        ...prev.dimensions,
        [field]: value
      }
    }));
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'New Wound Case',
          headerRight: () => (
            <Button
              variant="ghost"
              onPress={() => router.back()}
            >
              Cancel
            </Button>
          )
        }}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card variant="elevated" style={styles.form}>
          {error && (
            <Text color={colors.error[500]} style={styles.error}>
              {error}
            </Text>
          )}

          {/* Basic Information */}
          <View style={styles.section}>
            <Text variant="lg" weight="semibold" style={styles.sectionTitle}>
              Basic Information
            </Text>
            <View style={styles.fields}>
              <View style={styles.field}>
                <Text variant="sm" weight="medium" color={colors.gray[500]}>
                  Description
                </Text>
                <TextInput
                  style={styles.input}
                  value={formData.description}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
                  placeholder="Enter wound description"
                  placeholderTextColor={colors.gray[400]}
                />
              </View>

              <View style={styles.field}>
                <Text variant="sm" weight="medium" color={colors.gray[500]}>
                  Location
                </Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    style={styles.picker}
                    selectedValue={formData.location}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, location: value }))}
                  >
                    <Picker.Item label="Select location" value="" />
                    {locations.map((location) => (
                      <Picker.Item key={location} label={location} value={location} />
                    ))}
                  </Picker>
                </View>
              </View>

              <View style={styles.field}>
                <Text variant="sm" weight="medium" color={colors.gray[500]}>
                  Wound Type
                </Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    style={styles.picker}
                    selectedValue={formData.type}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                  >
                    <Picker.Item label="Select wound type" value="" />
                    {woundTypes.map((type) => (
                      <Picker.Item key={type} label={type} value={type} />
                    ))}
                  </Picker>
                </View>
              </View>

              <View style={styles.field}>
                <Text variant="sm" weight="medium" color={colors.gray[500]}>
                  Etiology
                </Text>
                <TextInput
                  style={styles.input}
                  value={formData.etiology}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, etiology: text }))}
                  placeholder="Enter wound etiology"
                  placeholderTextColor={colors.gray[400]}
                />
              </View>
            </View>
          </View>

          {/* Measurements */}
          <View style={styles.section}>
            <Text variant="lg" weight="semibold" style={styles.sectionTitle}>
              Measurements
            </Text>
            <View style={styles.fields}>
              <View style={styles.dimensionsGrid}>
                <View style={styles.field}>
                  <Text variant="sm" weight="medium" color={colors.gray[500]}>
                    Length (cm)
                  </Text>
                  <TextInput
                    style={styles.input}
                    value={formData.dimensions.length}
                    onChangeText={(text) => updateDimension('length', text)}
                    keyboardType="decimal-pad"
                    placeholder="0.0"
                    placeholderTextColor={colors.gray[400]}
                  />
                </View>

                <View style={styles.field}>
                  <Text variant="sm" weight="medium" color={colors.gray[500]}>
                    Width (cm)
                  </Text>
                  <TextInput
                    style={styles.input}
                    value={formData.dimensions.width}
                    onChangeText={(text) => updateDimension('width', text)}
                    keyboardType="decimal-pad"
                    placeholder="0.0"
                    placeholderTextColor={colors.gray[400]}
                  />
                </View>

                <View style={styles.field}>
                  <Text variant="sm" weight="medium" color={colors.gray[500]}>
                    Depth (cm)
                  </Text>
                  <TextInput
                    style={styles.input}
                    value={formData.dimensions.depth}
                    onChangeText={(text) => updateDimension('depth', text)}
                    keyboardType="decimal-pad"
                    placeholder="0.0"
                    placeholderTextColor={colors.gray[400]}
                  />
                </View>
              </View>
            </View>
          </View>
        </Card>

        <View style={styles.actions}>
          <Button
            variant="primary"
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Wound Case'}
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[100]
  },
  scrollContent: {
    padding: spacing[4],
    gap: spacing[4]
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
  dimensionsGrid: {
    flexDirection: 'row',
    gap: spacing[4]
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
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: '#fff',
    overflow: 'hidden',
    height: 40
  },
  picker: {
    height: 40,
    ...Platform.select({
      web: {
        paddingHorizontal: 8,
        outline: 'none'
      },
      ios: {
        marginTop: -8
      },
      android: {
        marginTop: -4
      }
    })
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing[3]
  },
  error: {
    marginBottom: spacing[4]
  }
});