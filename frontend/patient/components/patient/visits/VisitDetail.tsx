import React from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { ArrowLeft, Calendar, User, Ruler, Activity, ThermometerSun } from 'lucide-react-native';
import { Text } from '../../ui/Text';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

interface Visit {
  id: string;
  visitNumber: number;
  date: string;
  providerId: string;
  dimensions: {
    length: number;
    width: number;
    depth: number;
  };
  hasUndermining: boolean;
  underminingDetails?: {
    depth: number;
    direction: string;
  };
  tissueType: string[];
  exudate: {
    amount: string;
    type: string;
  };
  periwoundCondition: string[];
  infectionSigns: string[];
  painLevel: number;
  images: string[];
}

interface Treatment {
  id: string;
  visitId: string;
  dressingType: string;
  cleansingRegimen: string;
  therapies: string[];
  medications: string[];
  offloadingStrategies: string;
  graftingProduct?: {
    brand: string;
    type: string;
  };
}

interface VisitDetailProps {
  visit: Visit;
  treatment?: Treatment;
  onBack: () => void;
  isInitialVisit?: boolean;
}

export function VisitDetail({ visit, treatment, onBack, isInitialVisit }: VisitDetailProps) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Button
          variant="ghost"
          leftIcon={ArrowLeft}
          onPress={onBack}
        >
          Back to {isInitialVisit ? 'Wound Case' : 'Visit History'}
        </Button>
        <Text variant="xl" weight="semibold">
          {isInitialVisit ? 'Initial Visit Details' : `Visit #${visit.visitNumber} Details`}
        </Text>
      </View>

      <View style={styles.content}>
        {/* Visit Information */}
        <Card variant="elevated" style={styles.section}>
          <Text variant="lg" weight="semibold" style={styles.sectionTitle}>
            Visit Information
          </Text>
          <View style={styles.grid}>
            <View style={styles.infoRow}>
              <Calendar size={20} color={colors.gray[400]} />
              <View style={styles.infoContent}>
                <Text variant="sm" weight="medium" color={colors.gray[500]}>Date</Text>
                <Text>{visit.date}</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <User size={20} color={colors.gray[400]} />
              <View style={styles.infoContent}>
                <Text variant="sm" weight="medium" color={colors.gray[500]}>Provider</Text>
                <Text>{visit.providerId}</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Wound Measurements */}
        <Card variant="elevated" style={styles.section}>
          <Text variant="lg" weight="semibold" style={styles.sectionTitle}>
            Wound Measurements
          </Text>
          <View style={styles.grid}>
            <View style={styles.infoRow}>
              <Ruler size={20} color={colors.gray[400]} />
              <View style={styles.infoContent}>
                <Text variant="sm" weight="medium" color={colors.gray[500]}>Dimensions</Text>
                <Text>
                  {visit.dimensions.length}cm x {visit.dimensions.width}cm x {visit.dimensions.depth}cm
                </Text>
              </View>
            </View>
            {visit.hasUndermining && visit.underminingDetails && (
              <View style={styles.infoRow}>
                <Activity size={20} color={colors.gray[400]} />
                <View style={styles.infoContent}>
                  <Text variant="sm" weight="medium" color={colors.gray[500]}>Undermining</Text>
                  <Text>
                    {visit.underminingDetails.depth}cm at {visit.underminingDetails.direction}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </Card>

        {/* Wound Characteristics */}
        <Card variant="elevated" style={styles.section}>
          <Text variant="lg" weight="semibold" style={styles.sectionTitle}>
            Wound Characteristics
          </Text>
          <View style={styles.grid}>
            <View style={styles.characteristicItem}>
              <Text variant="sm" weight="medium" color={colors.gray[500]}>Tissue Type</Text>
              <View style={styles.tagContainer}>
                {visit.tissueType.map((type) => (
                  <View key={type} style={styles.tag}>
                    <Text variant="sm" weight="medium" color={colors.primary[600]}>
                      {type}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
            <View style={styles.characteristicItem}>
              <Text variant="sm" weight="medium" color={colors.gray[500]}>Exudate</Text>
              <Text>
                {visit.exudate.amount} - {visit.exudate.type}
              </Text>
            </View>
          </View>
        </Card>

        {/* Treatment Information */}
        {treatment && (
          <Card variant="elevated" style={styles.section}>
            <Text variant="lg" weight="semibold" style={styles.sectionTitle}>
              Treatment
            </Text>
            <View style={styles.grid}>
              <View style={styles.treatmentItem}>
                <Text variant="sm" weight="medium" color={colors.gray[500]}>Dressing Type</Text>
                <Text>{treatment.dressingType}</Text>
              </View>
              <View style={styles.treatmentItem}>
                <Text variant="sm" weight="medium" color={colors.gray[500]}>Cleansing Regimen</Text>
                <Text>{treatment.cleansingRegimen}</Text>
              </View>
              {treatment.graftingProduct && (
                <View style={styles.treatmentItem}>
                  <Text variant="sm" weight="medium" color={colors.gray[500]}>Grafting Product</Text>
                  <Text>
                    {treatment.graftingProduct.brand} - {treatment.graftingProduct.type}
                  </Text>
                </View>
              )}
            </View>
          </Card>
        )}

        {/* Images */}
        {visit.images.length > 0 && (
          <Card variant="elevated" style={styles.section}>
            <Text variant="lg" weight="semibold" style={styles.sectionTitle}>
              Images
            </Text>
            <View style={styles.imageGrid}>
              {visit.images.map((image, index) => (
                <View key={index} style={styles.imageContainer}>
                  <Image
                    source={{ uri: image }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                </View>
              ))}
            </View>
          </Card>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    gap: spacing[4],
    marginBottom: spacing[6]
  },
  content: {
    gap: spacing[4]
  },
  section: {
    gap: spacing[4]
  },
  sectionTitle: {
    marginBottom: spacing[2]
  },
  grid: {
    gap: spacing[4]
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3]
  },
  infoContent: {
    flex: 1,
    gap: spacing[1]
  },
  characteristicItem: {
    gap: spacing[2]
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2]
  },
  tag: {
    backgroundColor: colors.primary[50],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: 12
  },
  treatmentItem: {
    gap: spacing[1]
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[4]
  },
  imageContainer: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden'
  },
  image: {
    width: '100%',
    height: '100%'
  }
});