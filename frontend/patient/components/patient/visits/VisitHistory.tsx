import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ArrowLeft, Calendar as CalendarIcon } from 'lucide-react-native';
import { Text } from '../../ui/Text';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

interface Visit {
  id: string;
  visitNumber: number;
  date: string;
  dimensions: {
    length: number;
    width: number;
    depth: number;
  };
  images: string[];
}

interface VisitHistoryProps {
  woundCaseId: string;
  visits: Visit[];
  onBack: () => void;
  onVisitSelect: (visitId: string) => void;
}

export function VisitHistory({ woundCaseId, visits, onBack, onVisitSelect }: VisitHistoryProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button
          variant="ghost"
          leftIcon={ArrowLeft}
          onPress={onBack}
        >
          Back to Wound Case
        </Button>
        <Text variant="xl" weight="semibold">Visit History</Text>
      </View>

      <ScrollView style={styles.visitList}>
        {visits.map((visit) => (
          <Card
            key={visit.id}
            variant="elevated"
            style={styles.visitCard}
            onPress={() => onVisitSelect(visit.id)}
          >
            <View style={styles.visitContent}>
              <View style={styles.iconContainer}>
                <CalendarIcon size={24} color={colors.primary[600]} />
              </View>
              <View style={styles.visitInfo}>
                <Text weight="medium">Visit #{visit.visitNumber}</Text>
                <Text variant="sm" color={colors.gray[500]}>{visit.date}</Text>
                <View style={styles.dimensions}>
                  <Text variant="sm" color={colors.gray[600]}>
                    Dimensions: {visit.dimensions.length}cm x {visit.dimensions.width}cm x {visit.dimensions.depth}cm
                  </Text>
                </View>
                {visit.images[0] && (
                  <View style={styles.imagePreview}>
                    <Text variant="sm" color={colors.primary[600]}>
                      {visit.images.length} image{visit.images.length !== 1 ? 's' : ''} attached
                    </Text>
                  </View>
                )}
              </View>
            </View>
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
    gap: spacing[4]
  },
  visitList: {
    flex: 1
  },
  visitCard: {
    marginBottom: spacing[4]
  },
  visitContent: {
    flexDirection: 'row',
    gap: spacing[4]
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center'
  },
  visitInfo: {
    flex: 1,
    gap: spacing[2]
  },
  dimensions: {
    marginTop: spacing[1]
  },
  imagePreview: {
    marginTop: spacing[2]
  }
});