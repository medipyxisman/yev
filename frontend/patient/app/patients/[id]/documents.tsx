import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TextInput, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Text } from '../../../components/ui/Text';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { IconButton } from '../../../components/ui/IconButton';
import { colors } from '../../../components/theme/colors';
import { spacing } from '../../../components/theme/spacing';
import { FileText, Image as ImageIcon, Trash2, Upload, Search } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';
import documentApi, { Document } from '../../../api/documentApi';
import { Picker } from '@react-native-picker/picker';

const categories = ['medical', 'insurance', 'consent', 'other'] as const;

export default function DocumentsScreen() {
  const { id } = useLocalSearchParams();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchDocuments();
  }, [id]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      const docs = await documentApi.getDocuments(id as string);
      setDocuments(docs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        multiple: true,
        copyToCacheDirectory: true
      });

      if (!result.canceled && result.assets) {
        for (const asset of result.assets) {
          const response = await fetch(asset.uri);
          const blob = await response.blob();
          const file = new File([blob], asset.name, { type: asset.mimeType });

          await documentApi.uploadDocument(id as string, file, {
            category: 'other'
          });
        }
        await fetchDocuments();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload documents');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (documentId: string) => {
    try {
      setLoading(true);
      setError(null);
      await documentApi.deleteDocument(documentId);
      await fetchDocuments();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete document');
    } finally {
      setLoading(false);
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="2xl" weight="bold">Documents</Text>
        <Button
          variant="primary"
          leftIcon={Upload}
          onPress={handleUpload}
          disabled={loading}
        >
          Upload Documents
        </Button>
      </View>

      {error && (
        <Text color={colors.error[500]} style={styles.error}>
          {error}
        </Text>
      )}

      <View style={styles.filters}>
        <View style={styles.searchContainer}>
          <Search size={20} color={colors.gray[400]} />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search documents..."
            placeholderTextColor={colors.gray[400]}
          />
        </View>

        <View style={styles.categoryFilter}>
          <Picker
            selectedValue={selectedCategory}
            onValueChange={setSelectedCategory}
            style={styles.picker}
          >
            <Picker.Item label="All Categories" value="all" />
            {categories.map(category => (
              <Picker.Item
                key={category}
                label={category.charAt(0).toUpperCase() + category.slice(1)}
                value={category}
              />
            ))}
          </Picker>
        </View>
      </View>

      <Card variant="elevated" style={styles.documentsContainer}>
        <ScrollView>
          {loading && documents.length === 0 ? (
            <Text style={styles.emptyText}>Loading documents...</Text>
          ) : filteredDocuments.length === 0 ? (
            <Text style={styles.emptyText}>
              {searchQuery || selectedCategory !== 'all'
                ? 'No documents match your search criteria'
                : 'No documents uploaded yet'}
            </Text>
          ) : (
            filteredDocuments.map(doc => (
              <View key={doc.id} style={styles.documentRow}>
                <View style={styles.documentInfo}>
                  {doc.type.includes('pdf') ? (
                    <FileText size={24} color={colors.gray[400]} />
                  ) : (
                    <ImageIcon size={24} color={colors.gray[400]} />
                  )}
                  <View style={styles.documentDetails}>
                    <Text weight="medium">{doc.name}</Text>
                    <Text variant="sm" color={colors.gray[500]}>
                      Uploaded {new Date(doc.uploadedAt).toLocaleDateString()} by {doc.uploadedBy}
                    </Text>
                  </View>
                </View>
                <View style={styles.documentActions}>
                  <View style={styles.categoryBadge}>
                    <Text variant="sm" color={colors.primary[600]}>
                      {doc.category.charAt(0).toUpperCase() + doc.category.slice(1)}
                    </Text>
                  </View>
                  <IconButton
                    icon={Trash2}
                    size={20}
                    color={colors.error[500]}
                    onPress={() => handleDelete(doc.id)}
                  />
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </Card>
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
  filters: {
    flexDirection: 'row',
    gap: spacing[4],
    marginBottom: spacing[4]
  },
  searchContainer: {
    flex: 1,
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
    paddingVertical: spacing[2],
    marginLeft: spacing[2],
    fontSize: 14,
    color: colors.gray[900]
  },
  categoryFilter: {
    width: 200,
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 8,
    backgroundColor: colors.gray[50],
    overflow: 'hidden'
  },
  picker: {
    height: 40
  },
  documentsContainer: {
    flex: 1
  },
  documentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200]
  },
  documentInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3]
  },
  documentDetails: {
    gap: spacing[1]
  },
  documentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3]
  },
  categoryBadge: {
    backgroundColor: colors.primary[50],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: 16
  },
  emptyText: {
    textAlign: 'center',
    color: colors.gray[500],
    padding: spacing[4]
  }
});