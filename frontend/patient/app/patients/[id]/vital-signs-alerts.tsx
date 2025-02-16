import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Text } from '../../../components/ui/Text';
import { colors } from '../../../components/theme/colors';
import { spacing } from '../../../components/theme/spacing';
import { VitalSignsAlert } from '../../../components/alerts/VitalSignsAlert';
import vitalSignsAlertApi, { Alert } from '../../../api/vitalSignsAlertApi';

export default function VitalSignsAlertsScreen() {
  const { id } = useLocalSearchParams();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAlerts();
  }, [id]);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await vitalSignsAlertApi.getAlerts(id as string);
      setAlerts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch alerts');
    } finally {
      setLoading(false);
    }
  };

  const handleAcknowledge = async (alertId: string) => {
    try {
      setLoading(true);
      await vitalSignsAlertApi.acknowledgeAlert(alertId, 'current-user-id');
      await fetchAlerts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to acknowledge alert');
    } finally {
      setLoading(false);
    }
  };

  if (loading && alerts.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Loading alerts...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text color={colors.error[500]}>{error}</Text>
      </View>
    );
  }

  const criticalAlerts = alerts.filter(alert => alert.severity === 'critical' && !alert.acknowledged);
  const otherAlerts = alerts.filter(alert => alert.severity !== 'critical' || alert.acknowledged);

  return (
    <ScrollView style={styles.container}>
      <Text variant="2xl" weight="bold" style={styles.title}>
        Vital Signs Alerts
      </Text>

      {criticalAlerts.length > 0 && (
        <View style={styles.section}>
          <Text variant="lg" weight="semibold" style={styles.sectionTitle}>
            Critical Alerts
          </Text>
          {criticalAlerts.map(alert => (
            <VitalSignsAlert
              key={alert.id}
              alert={alert}
              onAcknowledge={() => handleAcknowledge(alert.id)}
            />
          ))}
        </View>
      )}

      {otherAlerts.length > 0 && (
        <View style={styles.section}>
          <Text variant="lg" weight="semibold" style={styles.sectionTitle}>
            Other Alerts
          </Text>
          {otherAlerts.map(alert => (
            <VitalSignsAlert
              key={alert.id}
              alert={alert}
              onAcknowledge={
                !alert.acknowledged ? () => handleAcknowledge(alert.id) : undefined
              }
            />
          ))}
        </View>
      )}

      {alerts.length === 0 && (
        <Text style={styles.emptyText}>
          No alerts found
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[100],
    padding: 16
  },
  title: {
    marginBottom: 24
  },
  section: {
    marginBottom: 24
  },
  sectionTitle: {
    marginBottom: 16
  },
  emptyText: {
    textAlign: 'center',
    color: colors.gray[500]
  }
});