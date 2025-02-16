import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text } from '../../../components/ui/Text';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { IconButton } from '../../../components/ui/IconButton';
import { colors } from '../../../components/theme/colors';
import { spacing } from '../../../components/theme/spacing';
import { Plus, Edit2, Trash2, Phone, Mail } from 'lucide-react-native';
import { Picker } from '@react-native-picker/picker';

interface CareTeamMember {
  id: string;
  name: string;
  role: string;
  specialty?: string;
  organization: string;
  phone: string;
  email: string;
  startDate: string;
  endDate?: string;
  status: 'active' | 'inactive';
  notes?: string;
  permissions: {
    canViewMedicalHistory: boolean;
    canViewVitalSigns: boolean;
    canViewLabResults: boolean;
    canViewMedications: boolean;
    canViewTreatmentPlans: boolean;
  };
}

const roles = [
  'Primary Care Physician',
  'Wound Care Specialist',
  'Nurse Practitioner',
  'Registered Nurse',
  'Physical Therapist',
  'Occupational Therapist',
  'Nutritionist',
  'Social Worker',
  'Care Coordinator',
  'Other'
];

const specialties = [
  'Wound Care',
  'Internal Medicine',
  'Family Medicine',
  'Vascular Surgery',
  'Plastic Surgery',
  'Podiatry',
  'Dermatology',
  'Other'
];

// Mock data - replace with API call
const mockCareTeam: CareTeamMember[] = [
  {
    id: '1',
    name: 'Dr. Sarah Smith',
    role: 'Primary Care Physician',
    specialty: 'Internal Medicine',
    organization: 'City Medical Center',
    phone: '(555) 123-4567',
    email: 'sarah.smith@citymed.com',
    startDate: '2024-01-01',
    status: 'active',
    permissions: {
      canViewMedicalHistory: true,
      canViewVitalSigns: true,
      canViewLabResults: true,
      canViewMedications: true,
      canViewTreatmentPlans: true
    }
  },
  {
    id: '2',
    name: 'John Davis',
    role: 'Wound Care Specialist',
    specialty: 'Wound Care',
    organization: 'Advanced Wound Care Clinic',
    phone: '(555) 987-6543',
    email: 'john.davis@awcc.com',
    startDate: '2024-02-15',
    status: 'active',
    notes: 'Weekly wound assessments',
    permissions: {
      canViewMedicalHistory: true,
      canViewVitalSigns: true,
      canViewLabResults: true,
      canViewMedications: true,
      canViewTreatmentPlans: true
    }
  }
];

export default function CareTeamScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [careTeam, setCareTeam] = useState<CareTeamMember[]>(mockCareTeam);
  const [showNewMember, setShowNewMember] = useState(false);
  const [editingMember, setEditingMember] = useState<CareTeamMember | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    role: roles[0],
    specialty: '',
    organization: '',
    phone: '',
    email: '',
    startDate: '',
    endDate: '',
    notes: '',
    permissions: {
      canViewMedicalHistory: true,
      canViewVitalSigns: true,
      canViewLabResults: true,
      canViewMedications: true,
      canViewTreatmentPlans: true
    }
  });

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!formData.name || !formData.role || !formData.startDate) {
        throw new Error('Please fill in all required fields');
      }

      // TODO: Replace with API call
      const newMember: CareTeamMember = {
        id: Math.random().toString(),
        ...formData,
        status: 'active'
      };

      setCareTeam(prev => [...prev, newMember]);
      setShowNewMember(false);
      setFormData({
        name: '',
        role: roles[0],
        specialty: '',
        organization: '',
        phone: '',
        email: '',
        startDate: '',
        endDate: '',
        notes: '',
        permissions: {
          canViewMedicalHistory: true,
          canViewVitalSigns: true,
          canViewLabResults: true,
          canViewMedications: true,
          canViewTreatmentPlans: true
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save care team member');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingMember) return;

    try {
      setLoading(true);
      setError(null);

      // TODO: Replace with API call
      setCareTeam(prev =>
        prev.map(member =>
          member.id === editingMember.id
            ? { ...member, ...formData }
            : member
        )
      );

      setEditingMember(null);
      setFormData({
        name: '',
        role: roles[0],
        specialty: '',
        organization: '',
        phone: '',
        email: '',
        startDate: '',
        endDate: '',
        notes: '',
        permissions: {
          canViewMedicalHistory: true,
          canViewVitalSigns: true,
          canViewLabResults: true,
          canViewMedications: true,
          canViewTreatmentPlans: true
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update care team member');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (memberId: string) => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Replace with API call
      setCareTeam(prev => prev.filter(member => member.id !== memberId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove care team member');
    } finally {
      setLoading(false);
    }
  };

  const CareTeamMemberForm = ({ onSubmit, onCancel }: { onSubmit: () => void; onCancel: () => void }) => (
    <Card variant="elevated" style={styles.form}>
      <View style={styles.formFields}>
        <View style={styles.field}>
          <Text variant="sm" weight="medium" color={colors.gray[500]}>
            Name *
          </Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
            placeholder="Enter provider name"
            placeholderTextColor={colors.gray[400]}
          />
        </View>

        <View style={styles.field}>
          <Text variant="sm" weight="medium" color={colors.gray[500]}>
            Role *
          </Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.role}
              onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
            >
              {roles.map(role => (
                <Picker.Item key={role} label={role} value={role} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.field}>
          <Text variant="sm" weight="medium" color={colors.gray[500]}>
            Specialty
          </Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.specialty}
              onValueChange={(value) => setFormData(prev => ({ ...prev, specialty: value }))}
            >
              <Picker.Item label="Select specialty" value="" />
              {specialties.map(specialty => (
                <Picker.Item key={specialty} label={specialty} value={specialty} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.field}>
          <Text variant="sm" weight="medium" color={colors.gray[500]}>
            Organization
          </Text>
          <TextInput
            style={styles.input}
            value={formData.organization}
            onChangeText={(text) => setFormData(prev => ({ ...prev, organization: text }))}
            placeholder="Enter organization name"
            placeholderTextColor={colors.gray[400]}
          />
        </View>

        <View style={styles.field}>
          <Text variant="sm" weight="medium" color={colors.gray[500]}>
            Phone
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

        <View style={styles.field}>
          <Text variant="sm" weight="medium" color={colors.gray[500]}>
            Permissions
          </Text>
          <View style={styles.permissions}>
            {Object.entries(formData.permissions).map(([key, value]) => (
              <View key={key} style={styles.permission}>
                <Text variant="sm">
                  {key.replace(/([A-Z])/g, ' $1')
                    .split('can')
                    .join('')
                    .trim()}
                </Text>
                <Button
                  variant={value ? 'primary' : 'outline'}
                  onPress={() => setFormData(prev => ({
                    ...prev,
                    permissions: {
                      ...prev.permissions,
                      [key]: !value
                    }
                  }))}
                >
                  {value ? 'Enabled' : 'Disabled'}
                </Button>
              </View>
            ))}
          </View>
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
          {loading ? 'Saving...' : 'Save Member'}
        </Button>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="2xl" weight="bold">Care Team</Text>
        <Button
          variant="primary"
          leftIcon={Plus}
          onPress={() => setShowNewMember(true)}
          disabled={loading}
        >
          Add Team Member
        </Button>
      </View>

      {error && (
        <Text color={colors.error[500]} style={styles.error}>
          {error}
        </Text>
      )}

      {showNewMember && (
        <CareTeamMemberForm
          onSubmit={handleSave}
          onCancel={() => setShowNewMember(false)}
        />
      )}

      <ScrollView style={styles.membersList}>
        {careTeam.map(member => (
          <Card key={member.id} variant="elevated" style={styles.memberCard}>
            {editingMember?.id === member.id ? (
              <CareTeamMemberForm
                onSubmit={handleUpdate}
                onCancel={() => setEditingMember(null)}
              />
            ) : (
              <>
                <View style={styles.memberHeader}>
                  <View>
                    <Text weight="medium">{member.name}</Text>
                    <Text variant="sm" color={colors.gray[500]}>
                      {member.role}
                      {member.specialty && ` - ${member.specialty}`}
                    </Text>
                  </View>
                  <View style={styles.memberActions}>
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: member.status === 'active' ? colors.success[50] : colors.gray[100] }
                    ]}>
                      <Text
                        variant="sm"
                        weight="medium"
                        color={member.status === 'active' ? colors.success[700] : colors.gray[600]}
                      >
                        {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                      </Text>
                    </View>
                    <IconButton
                      icon={Phone}
                      size={20}
                      color={colors.primary[600]}
                      onPress={() => {/* TODO: Implement phone call */}}
                    />
                    <IconButton
                      icon={Mail}
                      size={20}
                      color={colors.primary[600]}
                      onPress={() => {/* TODO: Implement email */}}
                    />
                    <IconButton
                      icon={Edit2}
                      size={20}
                      color={colors.gray[500]}
                      onPress={() => {
                        setEditingMember(member);
                        setFormData({
                          name: member.name,
                          role: member.role,
                          specialty: member.specialty || '',
                          organization: member.organization,
                          phone: member.phone,
                          email: member.email,
                          startDate: member.startDate,
                          endDate: member.endDate || '',
                          notes: member.notes || '',
                          permissions: member.permissions
                        });
                      }}
                    />
                    <IconButton
                      icon={Trash2}
                      size={20}
                      color={colors.error[500]}
                      onPress={() => handleDelete(member.id)}
                    />
                  </View>
                </View>

                <View style={styles.memberDetails}>
                  <View style={styles.detailRow}>
                    <Text variant="sm" weight="medium" color={colors.gray[500]}>
                      Organization:
                    </Text>
                    <Text variant="sm">{member.organization}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text variant="sm" weight="medium" color={colors.gray[500]}>
                      Phone:
                    </Text>
                    <Text variant="sm">{member.phone}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text variant="sm" weight="medium" color={colors.gray[500]}>
                      Email:
                    </Text>
                    <Text variant="sm">{member.email}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text variant="sm" weight="medium" color={colors.gray[500]}>
                      Start Date:
                    </Text>
                    <Text variant="sm">{member.startDate}</Text>
                  </View>

                  {member.endDate && (
                    <View style={styles.detailRow}>
                      <Text variant="sm" weight="medium" color={colors.gray[500]}>
                        End Date:
                      </Text>
                      <Text variant="sm">{member.endDate}</Text>
                    </View>
                  )}

                  <View style={styles.permissions}>
                    <Text variant="sm" weight="medium" color={colors.gray[500]}>
                      Permissions:
                    </Text>
                    {Object.entries(member.permissions).map(([key, value]) => (
                      <View key={key} style={styles.permission}>
                        <Text variant="sm">
                          {key.replace(/([A-Z])/g, ' $1')
                            .split('can')
                            .join('')
                            .trim()}
                        </Text>
                        <View style={[
                          styles.permissionBadge,
                          { backgroundColor: value ? colors.success[50] : colors.gray[100] }
                        ]}>
                          <Text
                            variant="sm"
                            color={value ? colors.success[700] : colors.gray[600]}
                          >
                            {value ? 'Enabled' : 'Disabled'}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>

                  {member.notes && (
                    <View style={styles.notes}>
                      <Text variant="sm" weight="medium" color={colors.gray[500]}>
                        Notes:
                      </Text>
                      <Text variant="sm">{member.notes}</Text>
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
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing[3]
  },
  membersList: {
    flex: 1
  },
  memberCard: {
    marginBottom: spacing[4]
  },
  memberHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing[4]
  },
  memberActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2]
  },
  statusBadge: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: 16
  },
  memberDetails: {
    gap: spacing[3]
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  permissions: {
    gap: spacing[2]
  },
  permission: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[1]
  },
  permissionBadge: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: 16
  },
  notes: {
    gap: spacing[1]
  }
});