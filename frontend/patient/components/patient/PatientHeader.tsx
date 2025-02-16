import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../ui/Text';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { spacing } from '../theme/spacing';
import { colors } from '../theme/colors';

interface PatientHeaderProps {
  patient: {
    firstName: string;
    lastName: string;
    status: string;
    dateOfBirth: string;
    metrics: {
      daysSinceLastVisit: number;
      woundStatus: string;
      patientSatisfaction: number;
    };
  };
}

export function PatientHeader({ patient }: PatientHeaderProps) {
  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'success';
      case 'on hold':
        return 'warning';
      case 'inactive':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text variant="3xl" weight="bold">
            {patient.firstName} {patient.lastName}
          </Text>
          <Text variant="sm" color={colors.gray[500]}>
            DOB: {patient.dateOfBirth}
          </Text>
        </View>
        <Badge
          label={patient.status}
          variant={getStatusVariant(patient.status)}
        />
      </View>

      <View style={styles.metrics}>
        <Card style={styles.metric}>
          <Text variant="sm" color={colors.gray[500]}>Days Since Last Visit</Text>
          <Text variant="xl" weight="semibold">{patient.metrics.daysSinceLastVisit}</Text>
        </Card>

        <Card style={styles.metric}>
          <Text variant="sm" color={colors.gray[500]}>Wound Status</Text>
          <Text variant="xl" weight="semibold" style={{ textTransform: 'capitalize' }}>
            {patient.metrics.woundStatus}
          </Text>
        </Card>

        <Card style={styles.metric}>
          <Text variant="sm" color={colors.gray[500]}>Patient Satisfaction</Text>
          <Text variant="xl" weight="semibold">{patient.metrics.patientSatisfaction}/5</Text>
        </Card>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing[4],
    gap: spacing[6],
    backgroundColor: colors.gray[50]
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  metrics: {
    flexDirection: 'row',
    gap: spacing[4]
  },
  metric: {
    flex: 1,
    gap: spacing[1]
  }
});