import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';
import { Text } from '../ui/Text';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import type { Alert } from '../../api/vitalSignsAlertApi';

interface VitalSignsAlertProps {
  alert: Alert;
  onAcknowledge?: () => void;
}

export function VitalSignsAlert({ alert, onAcknowledge }: VitalSignsAlertProps) {
  const getAlertColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical':
        return colors.error[500];
      case 'high':
        return colors.warning[500];
      case 'low':
        return colors.primary[500];
      default:
        return colors.gray[500];
    }
  };

  const getAlertMessage = (alert: Alert) => {
    const type = alert.type.includes('.') 
      ? alert.type.split('.')[1] 
      : alert.type;
    
    const formattedType = type
      .replace(/([A-Z])/g, ' $1')
      .toLowerCase()
      .replace(/^./, str => str.toUpperCase());

    return `${formattedType} is ${alert.severity === 'high' ? 'above' : 'below'} normal range`;
  };

  const alertColor = getAlertColor(alert.severity);

  return (
    <View style={[styles.container, { borderColor: alertColor }]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <AlertTriangle size={20} color={alertColor} />
          <Text weight="medium" style={{ color: alertColor }}>
            {alert.severity === 'critical' ? 'Critical Alert' : 'Alert'}
          </Text>
        </View>
        {!alert.acknowledged && onAcknowledge && (
          <Text
            variant="sm"
            color={alertColor}
            style={styles.acknowledge}
            onPress={onAcknowledge}
          >
            Acknowledge
          </Text>
        )}
      </View>

      <Text variant="sm" style={styles.message}>
        {getAlertMessage(alert)}
      </Text>

      <View style={styles.details}>
        <Text variant="sm" color={colors.gray[500]}>
          Current: {alert.value}
        </Text>
        <Text variant="sm" color={colors.gray[500]}>
          Threshold: {alert.threshold}
        </Text>
      </View>

      {alert.acknowledged && (
        <Text variant="xs" color={colors.gray[500]} style={styles.acknowledgedText}>
          Acknowledged by {alert.acknowledgedBy} at{' '}
          {new Date(alert.acknowledgedAt!).toLocaleString()}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderLeftWidth: 4,
    padding: spacing[4],
    marginBottom: spacing[3]
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[2]
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2]
  },
  message: {
    marginBottom: spacing[2]
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing[2]
  },
  acknowledge: {
    textDecorationLine: 'underline'
  },
  acknowledgedText: {
    fontStyle: 'italic'
  }
});