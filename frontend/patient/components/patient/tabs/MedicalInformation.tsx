import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Edit2 } from 'lucide-react-native';
import { Text } from '../../ui/Text';
import { Card } from '../../ui/Card';
import { spacing } from '../../theme/spacing';
import { colors } from '../../theme/colors';
import { IconButton } from '../../ui/IconButton';

interface MedicalInformationProps {
  patient: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    contactNumber: string;
    alternateNumber?: string;
    email: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
    };
    insurance: {
      primary: {
        provider: string;
        groupId: string;
        memberId: string;
      };
      secondary?: {
        provider: string;
        groupId: string;
        memberId: string;
      };
    };
    emergencyContact: {
      name: string;
      relationship: string;
      phoneNumber: string;
    };
  };
  onEdit: (section: string) => void;
}

export function MedicalInformation({ patient, onEdit }: MedicalInformationProps) {
  const InfoSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <Card style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text variant="lg" weight="semibold">{title}</Text>
        <IconButton
          icon={Edit2}
          size={20}
          color={colors.primary[600]}
          onPress={() => onEdit(title.toLowerCase())}
        />
      </View>
      {children}
    </Card>
  );

  const InfoField = ({ label, value }: { label: string; value: string | React.ReactNode }) => (
    <View style={styles.field}>
      <Text variant="sm" color={colors.gray[500]}>{label}</Text>
      {typeof value === 'string' ? (
        <Text>{value}</Text>
      ) : (
        value
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <InfoSection title="Personal Information">
        <View style={styles.grid}>
          <InfoField
            label="Full Name"
            value={`${patient.firstName} ${patient.lastName}`}
          />
          <InfoField
            label="Date of Birth"
            value={patient.dateOfBirth}
          />
          <InfoField
            label="Gender"
            value={patient.gender}
          />
          <InfoField
            label="Contact Number"
            value={
              <View>
                <Text>{patient.contactNumber}</Text>
                {patient.alternateNumber && (
                  <Text variant="sm" color={colors.gray[500]}>
                    Alt: {patient.alternateNumber}
                  </Text>
                )}
              </View>
            }
          />
          <InfoField
            label="Email"
            value={patient.email}
          />
          <InfoField
            label="Address"
            value={
              <View>
                <Text>{patient.address.street}</Text>
                <Text>{`${patient.address.city}, ${patient.address.state} ${patient.address.zipCode}`}</Text>
              </View>
            }
          />
        </View>
      </InfoSection>

      <InfoSection title="Insurance Information">
        <View>
          <Text variant="sm" weight="medium" color={colors.gray[500]} style={styles.subsectionTitle}>
            Primary Insurance
          </Text>
          <View style={styles.grid}>
            <InfoField
              label="Provider"
              value={patient.insurance.primary.provider}
            />
            <InfoField
              label="Group ID"
              value={patient.insurance.primary.groupId}
            />
            <InfoField
              label="Member ID"
              value={patient.insurance.primary.memberId}
            />
          </View>

          {patient.insurance.secondary && (
            <View style={styles.subsection}>
              <Text variant="sm" weight="medium" color={colors.gray[500]} style={styles.subsectionTitle}>
                Secondary Insurance
              </Text>
              <View style={styles.grid}>
                <InfoField
                  label="Provider"
                  value={patient.insurance.secondary.provider}
                />
                <InfoField
                  label="Group ID"
                  value={patient.insurance.secondary.groupId}
                />
                <InfoField
                  label="Member ID"
                  value={patient.insurance.secondary.memberId}
                />
              </View>
            </View>
          )}
        </View>
      </InfoSection>

      <InfoSection title="Emergency Contact">
        <View style={styles.grid}>
          <InfoField
            label="Name"
            value={patient.emergencyContact.name}
          />
          <InfoField
            label="Relationship"
            value={patient.emergencyContact.relationship}
          />
          <InfoField
            label="Phone Number"
            value={patient.emergencyContact.phoneNumber}
          />
        </View>
      </InfoSection>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  section: {
    marginBottom: spacing[4]
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[4]
  },
  grid: {
    gap: spacing[4]
  },
  field: {
    gap: spacing[1]
  },
  subsection: {
    marginTop: spacing[6]
  },
  subsectionTitle: {
    marginBottom: spacing[4]
  }
});