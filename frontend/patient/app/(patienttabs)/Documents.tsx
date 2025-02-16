import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { Upload, Eye, FileText, Image } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';

interface Document {
	id: string;
	name: string;
	type: 'pdf' | 'jpg' | 'png';
	uploadDate: string;
	uploadedBy: string;
}

const mockDocuments: Document[] = [
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

export function Documents() {
	const { width } = useWindowDimensions();
	const isSmallScreen = width < 768;

	const handleFileUpload = async () => {
		try {
			const result = await DocumentPicker.getDocumentAsync({
				type: ['application/pdf', 'image/*'],
				multiple: true,
			});

			if (result.assets) {
				console.log('Selected files:', result.assets);
			}
		} catch (error) {
			console.error('Error picking document:', error);
		}
	};

	const handlePreview = (documentId: string) => {
		console.log('Preview document:', documentId);
	};

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.title}>Documents</Text>
				<TouchableOpacity
					style={styles.uploadButton}
					onPress={handleFileUpload}
				>
					<Upload size={16} color="#fff" />
					<Text style={styles.uploadButtonText}>Upload New Document</Text>
				</TouchableOpacity>
			</View>

			<ScrollView style={styles.documentsContainer}>
				<View style={styles.tableHeader}>
					<View style={[styles.tableCell, styles.documentCell]}>
						<Text style={styles.columnHeader}>Document</Text>
					</View>
					{!isSmallScreen && (
						<>
							<View style={[styles.tableCell, styles.typeCell]}>
								<Text style={styles.columnHeader}>Type</Text>
							</View>
							<View style={[styles.tableCell, styles.dateCell]}>
								<Text style={styles.columnHeader}>Upload Date</Text>
							</View>
							<View style={[styles.tableCell, styles.uploadedByCell]}>
								<Text style={styles.columnHeader}>Uploaded By</Text>
							</View>
						</>
					)}
					<View style={[styles.tableCell, styles.actionsCell]}>
						<Text style={styles.columnHeader}>Actions</Text>
					</View>
				</View>

				{mockDocuments.map((doc) => (
					<View key={doc.id} style={styles.documentRow}>
						<View style={[styles.tableCell, styles.documentCell]}>
							<View style={styles.documentInfo}>
								{doc.type === 'pdf' ? (
									<FileText size={20} color="#9ca3af" />
								) : (
									<Image size={20} color="#9ca3af" />
								)}
								<View style={styles.documentDetails}>
									<Text style={styles.documentName}>{doc.name}</Text>
									{isSmallScreen && (
										<>
											<Text style={styles.documentMeta}>
												{doc.type.toUpperCase()} • {doc.uploadDate}
											</Text>
											<Text style={styles.documentMeta}>{doc.uploadedBy}</Text>
										</>
									)}
								</View>
							</View>
						</View>

						{!isSmallScreen && (
							<>
								<View style={[styles.tableCell, styles.typeCell]}>
									<Text style={styles.cellText}>{doc.type.toUpperCase()}</Text>
								</View>
								<View style={[styles.tableCell, styles.dateCell]}>
									<Text style={styles.cellText}>{doc.uploadDate}</Text>
								</View>
								<View style={[styles.tableCell, styles.uploadedByCell]}>
									<Text style={styles.cellText}>{doc.uploadedBy}</Text>
								</View>
							</>
						)}

						<View style={[styles.tableCell, styles.actionsCell]}>
							<TouchableOpacity
								onPress={() => handlePreview(doc.id)}
								style={styles.previewButton}
							>
								<Eye size={20} color="#3b82f6" />
							</TouchableOpacity>
						</View>
					</View>
				))}
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f3f4f6',
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 16,
	},
	title: {
		fontSize: 18,
		fontWeight: '600',
		color: '#111827',
	},
	uploadButton: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#3b82f6',
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 8,
		...Platform.select({
			ios: {
				shadowColor: '#000',
				shadowOffset: { width: 0, height: 1 },
				shadowOpacity: 0.2,
				shadowRadius: 1.41,
			},
			android: {
				elevation: 2,
			},
		}),
	},
	uploadButtonText: {
		color: '#fff',
		fontSize: 14,
		fontWeight: '500',
		marginLeft: 8,
	},
	documentsContainer: {
		backgroundColor: '#fff',
		borderRadius: 12,
		...Platform.select({
			ios: {
				shadowColor: '#000',
				shadowOffset: { width: 0, height: 1 },
				shadowOpacity: 0.2,
				shadowRadius: 1.41,
			},
			android: {
				elevation: 2,
			},
		}),
	},
	tableHeader: {
		flexDirection: 'row',
		backgroundColor: '#f9fafb',
		borderTopLeftRadius: 12,
		borderTopRightRadius: 12,
		borderBottomWidth: 1,
		borderBottomColor: '#e5e7eb',
	},
	columnHeader: {
		fontSize: 12,
		fontWeight: '500',
		color: '#6b7280',
		textTransform: 'uppercase',
	},
	tableCell: {
		padding: 16,
	},
	documentCell: {
		flex: 2,
	},
	typeCell: {
		flex: 1,
	},
	dateCell: {
		flex: 1,
	},
	uploadedByCell: {
		flex: 1,
	},
	actionsCell: {
		width: 60,
		alignItems: 'center',
	},
	documentRow: {
		flexDirection: 'row',
		borderBottomWidth: 1,
		borderBottomColor: '#e5e7eb',
	},
	documentInfo: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	documentDetails: {
		marginLeft: 12,
		flex: 1,
	},
	documentName: {
		fontSize: 14,
		color: '#111827',
	},
	documentMeta: {
		fontSize: 12,
		color: '#6b7280',
		marginTop: 2,
	},
	cellText: {
		fontSize: 14,
		color: '#374151',
	},
	previewButton: {
		padding: 8,
	},
});