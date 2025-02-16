import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text } from '../../../components/ui/Text';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { IconButton } from '../../../components/ui/IconButton';
import { colors } from '../../../components/theme/colors';
import { spacing } from '../../../components/theme/spacing';
import { Plus, Edit2, Trash2, FileText, Share2, Eye } from 'lucide-react-native';
import { Picker } from '@react-native-picker/picker';

interface EducationMaterial {
  id: string;
  title: string;
  category: 'wound_care' | 'medication' | 'nutrition' | 'exercise' | 'lifestyle' | 'other';
  format: 'pdf' | 'video' | 'link' | 'text';
  content: string;
  language: string;
  assignedDate: string;
  assignedBy: string;
  status: 'assigned' | 'viewed' | 'completed';
  dueDate?: string;
  completedDate?: string;
  notes?: string;
}

const categories = [
  'wound_care',
  'medication',
  'nutrition',
  'exercise',
  'lifestyle',
  'other'
] as const;

const formats = [
  'pdf',
  'video',
  'link',
  'text'
] as const;

const languages = [
  'English',
  'Spanish',
  'French',
  'Chinese',
  'Vietnamese',
  'Other'
];

// Mock data - replace with API call
const mockMaterials: EducationMaterial[] = [
  {
    id: '1',
    title: 'Wound Care at Home',
    category: 'wound_care',
    format: 'pdf',
    content: 'https://example.com/wound-care-guide.pdf',
    language: 'English',
    assignedDate: '2024-03-15',
    assignedBy: 'Dr. Smith',
    status: 'assigned',
    dueDate: '2024-03-22',
    notes: 'Please review before next appointment'
  },
  {
    id: '2',
    title: 'Nutrition Guidelines',
    category: 'nutrition',
    format: 'text',
    content: 'Follow these dietary guidelines to promote wound healing...',
    language: 'English',
    assignedDate: '2024-03-10',
    assignedBy: 'Dr. Johnson',
    status: 'completed',
    completedDate: '2024-03-12'
  }
];

export default function EducationScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [materials, setMaterials] = useState<EducationMaterial[]>(mockMaterials);
  const [showNewMaterial, setShowNewMaterial] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<EducationMaterial | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'wound_care' as EducationMaterial['category'],
    format: 'pdf' as EducationMaterial['format'],
    content: '',
    language: 'English',
    dueDate: '',
    notes: ''
  });

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!formData.title || !formData.content) {
        throw new Error('Please fill in all required fields');
      }

      // TODO: Replace with API call
      const newMaterial: EducationMaterial = {
        id: Math.random().toString(),
        ...formData,
        assignedDate: new Date().toISOString().split('T')[0],
        assignedBy: 'Current Provider', // TODO: Get from auth context
        status: 'assigned'
      };

      setMaterials(prev => [...prev, newMaterial]);
      setShowNewMaterial(false);
      setFormData({
        title: '',
        category: 'wound_care',
        format: 'pdf',
        content: '',
        language: 'English',
        dueDate: '',
        notes: ''
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save education material');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingMaterial) return;

    try {
      setLoading(true);
      setError(null);

      // TODO: Replace with API call
      setMaterials(prev =>
        prev.map(material =>
          material.id === editingMaterial.id
            ? { ...material, ...formData }
            : material
        )
      );

      setEditingMaterial(null);
      setFormData({
        title: '',
        category: 'wound_care',
        format: 'pdf',
        content: '',
        language: 'English',
        dueDate: '',
        notes: ''
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update education material');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (materialId: string) => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Replace with API call
      setMaterials(prev => prev.filter(material => material.id !== materialId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete education material');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async (materialId: string) => {
    // TODO: Implement sharing functionality
    console.log('Share material:', materialId);
  };

  const handleView = async (materialId: string) => {
    // TODO: Implement viewing functionality
    console.log('View material:', materialId);
  };

  const EducationMaterialForm = ({ onSubmit, onCancel }: { onSubmit: () => void; onCancel: () => void }) => (
    <Card variant="elevated" style={styles.form}>
      <View style={styles.formFields}>
        <View style={styles.field}>
          <Text variant="sm" weight="medium" color={colors.gray[500]}>
            Title *
          </Text>
          <TextInput
            style={styles.input}
            value={formData.title}
            onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
            placeholder="Enter material title"
            placeholderTextColor={colors.gray[400]}
          />
        </View>

        <View style={styles.field}>
          <Text variant="sm" weight="medium" color={colors.gray[500]}>
            Category
          </Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.category}
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
            >
              {categories.map(category => (
                <Picker.Item
                  key={category}
                  label={category.split('_').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                  value={category}
                />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.field}>
          <Text variant="sm" weight="medium" color={colors.gray[500]}>
            Format
          </Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.format}
              onValueChange={(value) => setFormData(prev => ({ ...prev, format: value }))}
            >
              {formats.map(format => (
                <Picker.Item
                  key={format}
                  label={format.toUpperCase()}
                  value={format}
                />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.field}>
          <Text variant="sm" weight="medium" color={colors.gray[500]}>
            Language
          </Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.language}
              onValueChange={(value) => setFormData(prev => ({ ...prev, language: value }))}
            >
              {languages.map(language => (
                <Picker.Item
                  key={language}
                  label={language}
                  value={language}
                />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.field}>
          <Text variant="sm" weight="medium" color={colors.gray[500]}>
            Content *
          </Text>
          {formData.format === 'text' ? (
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.content}
              onChangeText={(text) => setFormData(prev => ({ ...prev, content: text }))}
              placeholder="Enter content"
              placeholderTextColor={colors.gray[400]}
              multiline
              numberOfLines={4}
            />
          ) : (
            <TextInput
              style={styles.input}
              value={formData.content}
              onChangeText={(text) => setFormData(prev => ({ ...prev, content: text }))}
              placeholder={`Enter ${formData.format.toUpperCase()} URL`}
              placeholderTextColor={colors.gray[400]}
            />
          )}
        </View>

        <View style={styles.field}>
          <Text variant="sm" weight="medium" color={colors.gray[500]}>
            Due Date
          </Text>
          <TextInput
            style={styles.input}
            value={formData.dueDate}
            onChangeText={(text) => setFormData(prev => ({ ...prev, dueDate: text }))}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={colors.gray[400]}
          />
        </View>

        <View style={styles.field}>
          <Text variant="sm" weight="medium" color={colors.gray[500]}>
            Notes
          </Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.notes}
            onChangeText={(text) => setFormData(prev => ({ ...prev, notes: text }))}
            placeholder="Add any additional notes"
            placeholderTextColor={colors.gray[400]}
            multiline
            numberOfLines={3}
          />
        </View>
      </View>

      <View style={styles.formActions}>
        <Button
          variant="outline"
          onPress={onCancel}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onPress={onSubmit}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Material'}
        </Button>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="2xl" weight="bold">Patient Education</Text>
        <Button
          variant="primary"
          leftIcon={Plus}
          onPress={() => setShowNewMaterial(true)}
          disabled={loading}
        >
          Add Material
        </Button>
      </View>

      {error && (
        <Text color={colors.error[500]} style={styles.error}>
          {error}
        </Text>
      )}

      {showNewMaterial && (
        <EducationMaterialForm
          onSubmit={handleSave}
          onCancel={() => setShowNewMaterial(false)}
        />
      )}

      <ScrollView style={styles.materialsList}>
        {materials.map(material => (
          <Card key={material.id} variant="elevated" style={styles.materialCard}>
            {editingMaterial?.id === material.id ? (
              <EducationMaterialForm
                onSubmit={handleUpdate}
                onCancel={() => setEditingMaterial(null)}
              />
            ) : (
              <>
                <View style={styles.materialHeader}>
                  <View>
                    <Text weight="medium">{material.title}</Text>
                    <Text variant="sm" color={colors.gray[500]}>
                      {material.category.split('_').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')} - {material.format.toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.materialActions}>
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: material.status === 'completed' ? colors.success[50] : colors.gray[100] }
                    ]}>
                      <Text
                        variant="sm"
                        weight="medium"
                        color={material.status === 'completed' ? colors.success[700] : colors.gray[600]}
                      >
                        {material.status.charAt(0).toUpperCase() + material.status.slice(1)}
                      </Text>
                    </View>
                    <IconButton
                      icon={Eye}
                      size={20}
                      color={colors.primary[600]}
                      onPress={() => handleView(material.id)}
                    />
                    <IconButton
                      icon={Share2}
                      size={20}
                      color={colors.gray[500]}
                      onPress={() => handleShare(material.id)}
                    />
                    <IconButton
                      icon={Edit2}
                      size={20}
                      color={colors.gray[500]}
                      onPress={() => {
                        setEditingMaterial(material);
                        setFormData({
                          title: material.title,
                          category: material.category,
                          format: material.format,
                          content: material.content,
                          language: material.language,
                          dueDate: material.dueDate || '',
                          notes: material.notes || ''
                        });
                      }}
                    />
                    <IconButton
                      icon={Trash2}
                      size={20}
                      color={colors.error[500]}
                      onPress={() => handleDelete(material.id)}
                    />
                  </View>
                </View>

                <View style={styles.materialDetails}>
                  <View style={styles.detailRow}>
                    <Text variant="sm" weight="medium" color={colors.gray[500]}>
                      Language:
                    </Text>
                    <Text variant="sm">{material.language}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text variant="sm" weight="medium" color={colors.gray[500]}>
                      Assigned Date:
                    </Text>
                    <Text variant="sm">{material.assignedDate}</Text>
                  </View>

                  {material.dueDate && (
                    <View style={styles.detailRow}>
                      <Text variant="sm" weight="medium" color={colors.gray[500]}>
                        Due Date:
                      </Text>
                      <Text variant="sm">{material.dueDate}</Text>
                    </View>
                  )}

                  {material.completedDate && (
                    <View style={styles.detailRow}>
                      <Text variant="sm" weight="medium" color={colors.gray[500]}>
                        Completed Date:
                      </Text>
                      <Text variant="sm">{material.completedDate}</Text>
                    </View>
                  )}

                  <View style={styles.detailRow}>
                    <Text variant="sm" weight="medium" color={colors.gray[500]}>
                      Assigned By:
                    </Text>
                    <Text variant="sm">{material.assignedBy}</Text>
                  </View>

                  {material.format === 'text' && (
                    <View style={styles.content}>
                      <Text variant="sm" weight="medium" color={colors.gray[500]}>
                        Content:
                      </Text>
                      <Text variant="sm">{material.content}</Text>
                    </View>
                  )}

                  {material.notes && (
                    <View style={styles.notes}>
                      <Text variant="sm" weight="medium" color={colors.gray[500]}>
                        Notes:
                      </Text>
                      <Text variant="sm">{material.notes}</Text>
                    </View>
                  )}
                </View>
              </>
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
    backgroundColor: colors.gray[100],
    padding: spacing[4]
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[6]
  },
  error: {
    marginBottom: spacing[4]
  },
  form: {
    marginBottom: spacing[4],
    gap: spacing[6]
  },
  formFields: {
    gap: spacing[4]
  },
  field: {
    gap: spacing[2]
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 8,
    padding: spacing[3],
    fontSize: 14,
    color: colors.gray[900],
    backgroundColor: colors.gray[50]
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top'
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 8,
    backgroundColor: colors.gray[50],
    overflow: 'hidden'
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing[3]
  },
  materialsList: {
    flex: 1
  },
  materialCard: {
    marginBottom: spacing[4]
  },
  materialHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing[4]
  },
  materialActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2]
  },
  statusBadge: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: 16
  },
  materialDetails: {
    gap: spacing[3]
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  content: {
    gap: spacing[2],
    padding: spacing[3],
    backgroundColor: colors.gray[50],
    borderRadius: 8
  },
  notes: {
    gap: spacing[1]
  }
});