import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { FileText, Image as ImageIcon, Eye, Upload } from 'lucide-react-native';
import { Text } from '../../ui/Text';
import { Card } from '../../ui/Card';
import { IconButton } from '../../ui/IconButton';
import { Button } from '../../ui/Button';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import * as DocumentPicker from 'expo-document-picker';

// Mock data - replace with API call
const mockDocuments = [
  {
    id: '1',
    name: 'Initial Assessment Report',
    type: 'pdf',
    uploadDate: '2024-03-15',
    uploadedBy: 'Dr. Smith'
  },
  {
    id: '2',
    name: 'Wound Photo - Left Leg',
    type: 'jpg',
    uploadDate: '2024-03-14',
    uploadedBy: 'Nurse Johnson'
  }
];

interface DocumentsProps {
  patientId: string;
}

export function Documents({ patientId }: DocumentsProps) {
  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        multiple: true,
      });

      if (result.assets) {
        // TODO: Handle file upload to server
        console.log('Selected files:', result.assets);
      }
    } catch (error) {
      console.error('Error picking document:', error);
    }
  };

  const handlePreview = (documentId: string) => {
    // TODO: Implement document preview
    console.log('Preview document:', documentId);
  };

  const DocumentIcon = ({ type }: { type: string }) => {
    if (type === 'pdf') {
      return <FileText size={20} color={colors.gray[400]} />;
    }
    return <ImageIcon size={20} color={colors.gray[400]} />;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="xl" weight="semibold">Documents</Text>
        <Button
          onPress={handleFileUpload}
          leftIcon={Upload}
          variant="primary"
        >
          Upload Document
        </Button>
      </View>

      <Card variant="elevated" style={styles.table}>
        <View style={styles.tableHeader}>
          <View style={[styles.tableCell, styles.documentCell]}>
            <Text variant="sm" weight="medium" color={colors.gray[500]}>Document</Text>
          </View>
          <View style={[styles.tableCell, styles.typeCell]}>
            <Text variant="sm" weight="medium" color={colors.gray[500]}>Type</Text>
          </View>
          <View style={[styles.tableCell, styles.dateCell]}>
            <Text variant="sm" weight="medium" color={colors.gray[500]}>Upload Date</Text>
          </View>
          <View style={[styles.tableCell, styles.uploadedByCell]}>
            <Text variant="sm" weight="medium" color={colors.gray[500]}>Uploaded By</Text>
          </View>
          <View style={[styles.tableCell, styles.actionsCell]}>
            <Text variant="sm" weight="medium" color={colors.gray[500]}>Actions</Text>
          </View>
        </View>

        <ScrollView>
          {mockDocuments.map(doc => (
            <View key={doc.id} style={styles.tableRow}>
              <View style={[styles.tableCell, styles.documentCell]}>
                <View style={styles.documentInfo}>
                  <DocumentIcon type={doc.type} />
                  <Text style={styles.documentName}>{doc.name}</Text>
                </View>
              </View>
              <View style={[styles.tableCell, styles.typeCell]}>
                <Text style={styles.cellText}>{doc.type.toUpperCase()}</Text>
              </View>
              <View style={[styles.tableCell, styles.dateCell]}>
                <Text style={styles.cellText}>{doc.uploadDate}</Text>
              </View>
              <View style={[styles.tableCell, styles.uploadedByCell]}>
                <Text style={styles.cellText}>{doc.uploadedBy}</Text>
              </View>
              <View style={[styles.tableCell, styles.actionsCell]}>
                <IconButton
                  icon={Eye}
                  size={20}
                  color={colors.primary[600]}
                  onPress={() => handlePreview(doc.id)}
                />
              </View>
            </View>
          ))}
        </ScrollView>
      </Card>
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
  table: {
    flex: 1
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
    backgroundColor: colors.gray[50]
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200]
  },
  tableCell: {
    padding: spacing[4]
  },
  documentCell: {
    flex: 2
  },
  typeCell: {
    width: 100
  },
  dateCell: {
    width: 120
  },
  uploadedByCell: {
    width: 150
  },
  actionsCell: {
    width: 80,
    alignItems: 'center'
  },
  documentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3]
  },
  documentName: {
    color: colors.gray[900]
  },
  cellText: {
    color: colors.gray[700]
  }
});