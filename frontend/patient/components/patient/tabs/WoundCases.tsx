import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Plus, ChevronDown, ChevronUp, Archive, Clock, Eye } from 'lucide-react-native';
import { Text } from '../../ui/Text';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { IconButton } from '../../ui/IconButton';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { useRouter } from 'expo-router';

// Mock data for demonstration
const mockWoundCases = [
  {
    id: 'WC-20240101-001',
    description: 'Venous Ulcer – Left Leg',
    visitCount: 3,
    isArchived: false,
    dimensions: {
      length: 5.2,
      width: 3.1,
      depth: 0.5
    },
    location: 'Left Lower Leg',
    type: 'Venous Ulcer'
  }
];

interface WoundCasesProps {
  patientId: string;
}

export function WoundCases({ patientId }: WoundCasesProps) {
  const router = useRouter();
  const [expandedCase, setExpandedCase] = useState<string | null>(null);

  const handleToggleCase = (caseId: string) => {
    setExpandedCase(expandedCase === caseId ? null : caseId);
  };

  const handleArchiveCase = (caseId: string) => {
    // TODO: Implement archive functionality
    console.log('Archive case:', caseId);
  };

  const handleViewVisit = (caseId: string, type: 'initial' | 'history') => {
    // TODO: Implement visit view navigation
    console.log('View visit:', { caseId, type });
  };

  const handleNewCase = () => {
    router.push('/(modals)/new-wound-case');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="xl" weight="semibold">Wound Cases</Text>
        <Button
          variant="primary"
          leftIcon={Plus}
          onPress={handleNewCase}
        >
          Start New Wound Case
        </Button>
      </View>

      <ScrollView style={styles.casesList}>
        {mockWoundCases.map((woundCase) => (
          <Card
            key={woundCase.id}
            variant="elevated"
            style={styles.caseCard}
          >
            <View style={styles.caseHeader}>
              <TouchableOpacity
                style={styles.caseTitle}
                onPress={() => handleToggleCase(woundCase.id)}
              >
                <View style={styles.caseTitleContent}>
                  <View>
                    <Text weight="medium">{woundCase.description}</Text>
                    <Text variant="sm" color={colors.gray[500]}>
                      Case ID: {woundCase.id}
                    </Text>
                  </View>
                  <View style={styles.visitBadge}>
                    <Clock size={12} color={colors.primary[700]} />
                    <Text 
                      variant="sm" 
                      weight="medium"
                      color={colors.primary[700]}
                    >
                      {woundCase.visitCount} Visits
                    </Text>
                  </View>
                </View>
                {expandedCase === woundCase.id ? (
                  <ChevronUp size={20} color={colors.gray[400]} />
                ) : (
                  <ChevronDown size={20} color={colors.gray[400]} />
                )}
              </TouchableOpacity>
              <IconButton
                icon={Archive}
                size={20}
                color={colors.gray[400]}
                onPress={() => handleArchiveCase(woundCase.id)}
              />
            </View>

            {expandedCase === woundCase.id && (
              <View style={styles.caseDetails}>
                <View style={styles.detailsGrid}>
                  <View style={styles.detailItem}>
                    <Text variant="sm" weight="medium" color={colors.gray[500]}>
                      Location & Type
                    </Text>
                    <Text>
                      {woundCase.location} - {woundCase.type}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text variant="sm" weight="medium" color={colors.gray[500]}>
                      Dimensions
                    </Text>
                    <Text>
                      {woundCase.dimensions.length}cm x {woundCase.dimensions.width}cm x {woundCase.dimensions.depth}cm
                    </Text>
                  </View>
                </View>

                <View style={styles.actions}>
                  <Button
                    variant="outline"
                    leftIcon={Eye}
                    onPress={() => handleViewVisit(woundCase.id, 'initial')}
                  >
                    View Initial Visit
                  </Button>
                  <Button
                    variant="outline"
                    leftIcon={Clock}
                    onPress={() => handleViewVisit(woundCase.id, 'history')}
                  >
                    View Visit History
                  </Button>
                </View>
              </View>
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
    gap: spacing[6]
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  casesList: {
    flex: 1
  },
  caseCard: {
    marginBottom: spacing[4]
  },
  caseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2]
  },
  caseTitle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[2]
  },
  caseTitleContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: spacing[4]
  },
  visitBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    backgroundColor: colors.primary[50],
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: 12
  },
  caseDetails: {
    marginTop: spacing[4],
    gap: spacing[4]
  },
  detailsGrid: {
    gap: spacing[4]
  },
  detailItem: {
    gap: spacing[1]
  },
  actions: {
    flexDirection: 'row',
    gap: spacing[3]
  }
});