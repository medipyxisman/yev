import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Container } from '../../components/ui/Container';
import { Text } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { spacing } from '../../components/theme/spacing';
import { colors } from '../../components/theme/colors';
import { Search, Plus } from 'lucide-react-native';
import patientApi from '../../api/patientApi';
import type { Patient } from '../../constants';

export default function PatientsScreen() {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const filtered = patients.filter(patient => 
        patient.firstName.toLowerCase().includes(query) ||
        patient.lastName.toLowerCase().includes(query) ||
        patient.email?.toLowerCase().includes(query) ||
        patient.phone?.includes(query)
      );
      setFilteredPatients(filtered);
    } else {
      setFilteredPatients(patients);
    }
  }, [searchQuery, patients]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await patientApi.getPatients();
      setPatients(data);
      setFilteredPatients(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch patients');
    } finally {
      setLoading(false);
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'warning';
      case 'archived':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading && patients.length === 0) {
    return (
      <Container>
        <Text>Loading patients...</Text>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Text color={colors.error[500]}>{error}</Text>
        <Button variant="outline" onPress={fetchPatients}>
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container>
      <View style={styles.header}>
        <Text variant="2xl" weight="bold">Patients</Text>
        <Button
          variant="primary"
          leftIcon={Plus}
          onPress={() => router.push('/patients/new')}
        >
          Add Patient
        </Button>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color={colors.gray[400]} />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search patients..."
            placeholderTextColor={colors.gray[400]}
          />
        </View>
      </View>

      <ScrollView style={styles.list}>
        {filteredPatients.map(patient => (
          <Card 
            key={patient.id}
            variant="elevated"
            style={styles.card}
            onPress={() => router.push(`/patients/${patient.id}`)}
          >
            <View style={styles.cardHeader}>
              <Text variant="lg" weight="semibold">
                {patient.firstName} {patient.lastName}
              </Text>
              <Badge 
                label={patient.status}
                variant={getStatusVariant(patient.status)}
              />
            </View>

            <View style={styles.cardContent}>
              <View style={styles.infoRow}>
                <Text variant="sm" color={colors.gray[500]}>Email:</Text>
                <Text variant="sm">{patient.email || 'N/A'}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text variant="sm" color={colors.gray[500]}>Phone:</Text>
                <Text variant="sm">{patient.phone || 'N/A'}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text variant="sm" color={colors.gray[500]}>Date of Birth:</Text>
                <Text variant="sm">{patient.dateOfBirth}</Text>
              </View>
            </View>
          </Card>
        ))}

        {filteredPatients.length === 0 && (
          <View style={styles.emptyState}>
            <Text color={colors.gray[500]}>
              {searchQuery ? 'No patients found matching your search.' : 'No patients added yet.'}
            </Text>
          </View>
        )}
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[6]
  },
  searchContainer: {
    marginBottom: spacing[4]
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[50],
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 8,
    paddingHorizontal: spacing[3]
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing[3],
    marginLeft: spacing[2],
    fontSize: 14,
    color: colors.gray[900]
  },
  list: {
    flex: 1
  },
  card: {
    marginBottom: spacing[4]
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[4]
  },
  cardContent: {
    gap: spacing[2]
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing[8]
  }
});