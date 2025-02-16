import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { ArrowLeft, Calendar, User, Ruler, Activity, ThermometerSun } from 'lucide-react-native';
import { WoundVisit, Treatment } from '../../constants/Patient';

interface VisitDetailProps {
  visit: WoundVisit;
  treatment?: Treatment;
  onBack: () => void;
  isInitialVisit?: boolean;
}

export function VisitDetail({ visit, treatment, onBack, isInitialVisit }: VisitDetailProps) {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 768;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.backButton}
        >
          <ArrowLeft size={16} color="#4b5563" />
          <Text style={styles.backButtonText}>
            Back to {isInitialVisit ? 'Wound Case' : 'Visit History'}
          </Text>
        </TouchableOpacity>
        <Text style={styles.title}>
          {isInitialVisit ? 'Initial Visit Details' : `Visit #${visit.visitNumber} Details`}
        </Text>
      </View>

      <View style={styles.grid}>
        {/* Visit Information */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Visit Information</Text>
          <View style={styles.cardContent}>
            <View style={styles.infoRow}>
              <Calendar size={20} color="#9ca3af" />
              <View style={styles.infoContent}>
                <Text style={styles.label}>Date</Text>
                <Text style={styles.value}>{visit.date}</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <User size={20} color="#9ca3af" />
              <View style={styles.infoContent}>
                <Text style={styles.label}>Provider</Text>
                <Text style={styles.value}>{visit.providerId}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Wound Measurements */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Wound Measurements</Text>
          <View style={styles.cardContent}>
            <View style={styles.infoRow}>
              <Ruler size={20} color="#9ca3af" />
              <View style={styles.infoContent}>
                <Text style={styles.label}>Dimensions</Text>
                <Text style={styles.value}>
                  {visit.dimensions.length}cm x {visit.dimensions.width}cm x {visit.dimensions.depth}cm
                </Text>
              </View>
            </View>
            {visit.hasUndermining && visit.underminingDetails && (
              <View style={styles.infoRow}>
                <Activity size={20} color="#9ca3af" />
                <View style={styles.infoContent}>
                  <Text style={styles.label}>Undermining</Text>
                  <Text style={styles.value}>
                    {visit.underminingDetails.depth}cm at {visit.underminingDetails.direction}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Wound Characteristics */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Wound Characteristics</Text>
          <View style={styles.cardContent}>
            <View style={styles.characteristicItem}>
              <Text style={styles.label}>Tissue Type</Text>
              <View style={styles.tagContainer}>
                {visit.tissueType.map((type) => (
                  <View key={type} style={styles.tag}>
                    <Text style={styles.tagText}>{type}</Text>
                  </View>
                ))}
              </View>
            </View>
            <View style={styles.characteristicItem}>
              <Text style={styles.label}>Exudate</Text>
              <Text style={styles.value}>
                {visit.exudate.amount} - {visit.exudate.type}
              </Text>
            </View>
          </View>
        </View>

        {/* Treatment Information */}
        {treatment && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Treatment</Text>
            <View style={styles.cardContent}>
              <View style={styles.treatmentItem}>
                <Text style={styles.label}>Dressing Type</Text>
                <Text style={styles.value}>{treatment.dressingType}</Text>
              </View>
              <View style={styles.treatmentItem}>
                <Text style={styles.label}>Cleansing Regimen</Text>
                <Text style={styles.value}>{treatment.cleansingRegimen}</Text>
              </View>
              {treatment.graftingProduct && (
                <View style={styles.treatmentItem}>
                  <Text style={styles.label}>Grafting Product</Text>
                  <Text style={styles.value}>
                    {treatment.graftingProduct.brand} - {treatment.graftingProduct.type}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}
      </View>

      {/* Images */}
      {visit.images.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Images</Text>
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
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    marginBottom: 24,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  backButtonText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#4b5563',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  grid: {
    gap: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 16,
  },
  cardContent: {
    gap: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoContent: {
    marginLeft: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    color: '#111827',
  },
  characteristicItem: {
    marginBottom: 12,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  tag: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1d4ed8',
  },
  treatmentItem: {
    marginBottom: 12,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  imageContainer: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});