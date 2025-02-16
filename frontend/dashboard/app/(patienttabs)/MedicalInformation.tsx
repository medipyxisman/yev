import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { Edit2 } from 'lucide-react-native';
import { Patient } from '../../constants/Patient';

interface MedicalInformationProps {
  patient: Patient;
  onEdit: (section: string) => void;
}

export function MedicalInformation({ patient, onEdit }: MedicalInformationProps) {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 768;

  const InfoField = ({ label, value }: { label: string; value: string | React.ReactNode }) => (
    <View style={styles.infoField}>
      <Text style={styles.label}>{label}</Text>
      {typeof value === 'string' ? (
        <Text style={styles.value}>{value}</Text>
      ) : (
        value
      )}
    </View>
  );

  const SectionHeader = ({ title, section }: { title: string; section: string }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <TouchableOpacity
        onPress={() => onEdit(section)}
        style={styles.editButton}
      >
        <Edit2 size={16} color="#3b82f6" />
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Personal Information */}
      <View style={styles.section}>
        <SectionHeader title="Personal Information" section="personal" />
        <View style={[styles.grid, !isSmallScreen && styles.gridTwoColumns]}>
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
                <Text style={styles.value}>{patient.contactNumber}</Text>
                {patient.alternateNumber && (
                  <Text style={styles.alternateNumber}>
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
                <Text style={styles.value}>{patient.address.street}</Text>
                <Text style={styles.value}>
                  {patient.address.city}, {patient.address.state} {patient.address.zipCode}
                </Text>
              </View>
            }
          />
        </View>
      </View>

      {/* Insurance Information */}
      <View style={styles.section}>
        <SectionHeader title="Insurance Information" section="insurance" />
        <View style={styles.insuranceContainer}>
          <Text style={styles.insuranceType}>Primary Insurance</Text>
          <View style={[styles.grid, !isSmallScreen && styles.gridThreeColumns]}>
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
            <View style={styles.secondaryInsurance}>
              <Text style={styles.insuranceType}>Secondary Insurance</Text>
              <View style={[styles.grid, !isSmallScreen && styles.gridThreeColumns]}>
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
      </View>

      {/* Emergency Contact */}
      <View style={styles.section}>
        <SectionHeader title="Emergency Contact" section="emergency" />
        <View style={[styles.grid, !isSmallScreen && styles.gridThreeColumns]}>
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
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  editButton: {
    padding: 8,
  },
  grid: {
    gap: 16,
  },
  gridTwoColumns: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridThreeColumns: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  infoField: {
    flex: 1,
    minWidth: 250,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    color: '#111827',
  },
  alternateNumber: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  insuranceContainer: {
    gap: 16,
  },
  insuranceType: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: 8,
  },
  secondaryInsurance: {
    marginTop: 16,
  },
});