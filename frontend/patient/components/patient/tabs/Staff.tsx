import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Edit2, Check, X } from 'lucide-react-native';
import { Text } from '../../ui/Text';
import { Card } from '../../ui/Card';
import { IconButton } from '../../ui/IconButton';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Picker } from '@react-native-picker/picker';

// Mock data - replace with API call
const mockStaffList = {
  providers: ['Dr. Smith', 'Dr. Johnson', 'Dr. Williams'],
  bdReps: ['Bob Johnson', 'Sarah Miller', 'Mike Davis'],
  physicians: ['Dr. Brown', 'Dr. Wilson', 'Dr. Taylor']
};

interface StaffProps {
  patientId: string;
  assignedStaff: {
    provider: string;
    bdRep: string;
    referringPhysician: string;
  };
  onUpdate: (field: 'provider' | 'bdRep' | 'referringPhysician', value: string) => void;
}

export function Staff({ patientId, assignedStaff, onUpdate }: StaffProps) {
  const [editing, setEditing] = useState<'provider' | 'bdRep' | 'referringPhysician' | null>(null);
  const [tempValue, setTempValue] = useState('');

  const handleEdit = (field: 'provider' | 'bdRep' | 'referringPhysician') => {
    setEditing(field);
    setTempValue(assignedStaff[field]);
  };

  const handleSave = () => {
    if (editing) {
      onUpdate(editing, tempValue);
      setEditing(null);
    }
  };

  const handleCancel = () => {
    setEditing(null);
    setTempValue('');
  };

  const getStaffOptions = (field: 'provider' | 'bdRep' | 'referringPhysician') => {
    switch (field) {
      case 'provider':
        return mockStaffList.providers;
      case 'bdRep':
        return mockStaffList.bdReps;
      case 'referringPhysician':
        return mockStaffList.physicians;
      default:
        return [];
    }
  };

  const StaffField = ({
    title,
    field,
    value
  }: {
    title: string;
    field: 'provider' | 'bdRep' | 'referringPhysician';
    value: string;
  }) => (
    <Card style={styles.fieldCard}>
      <View style={styles.fieldContent}>
        <View style={styles.fieldInfo}>
          <Text variant="sm" weight="medium" color={colors.gray[500]}>
            {title}
          </Text>
          {editing === field ? (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={tempValue}
                onValueChange={setTempValue}
                style={styles.picker}
              >
                {getStaffOptions(field).map((option) => (
                  <Picker.Item key={option} label={option} value={option} />
                ))}
              </Picker>
            </View>
          ) : (
            <Text>{value}</Text>
          )}
        </View>
        <View style={styles.actions}>
          {editing === field ? (
            <>
              <IconButton
                icon={Check}
                size={20}
                color={colors.success[500]}
                onPress={handleSave}
              />
              <IconButton
                icon={X}
                size={20}
                color={colors.error[500]}
                onPress={handleCancel}
              />
            </>
          ) : (
            <IconButton
              icon={Edit2}
              size={20}
              color={colors.primary[600]}
              onPress={() => handleEdit(field)}
            />
          )}
        </View>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text variant="xl" weight="semibold" style={styles.title}>
        Assigned Staff
      </Text>

      <View style={styles.fields}>
        <StaffField
          title="Provider"
          field="provider"
          value={assignedStaff.provider}
        />
        <StaffField
          title="Business Development Representative"
          field="bdRep"
          value={assignedStaff.bdRep}
        />
        <StaffField
          title="Referring Physician"
          field="referringPhysician"
          value={assignedStaff.referringPhysician}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacing[6]
  },
  title: {
    marginBottom: spacing[2]
  },
  fields: {
    gap: spacing[4]
  },
  fieldCard: {
    padding: spacing[4]
  },
  fieldContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  fieldInfo: {
    flex: 1,
    gap: spacing[1]
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 8,
    backgroundColor: colors.gray[50],
    overflow: 'hidden',
    marginTop: spacing[2]
  },
  picker: {
    width: '100%'
  },
  actions: {
    flexDirection: 'row',
    gap: spacing[2]
  }
});