import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { Plus, ChevronDown, ChevronUp, Archive, Clock, Eye } from 'lucide-react-native';
import { WoundCase, WoundVisit, Treatment } from '../../constants/Patient';
import { VisitHistory } from '../visits/VisitHistory';
import { VisitDetail } from '../visits/VisitDetail';

const mockWoundCases: WoundCase[] = [
	{
		id: 'WC-20240101-001',
		patientId: 'P12345',
		description: 'Venous Ulcer – Left Leg',
		visitCount: 3,
		isArchived: false,
		createdAt: '2024-01-01',
		allergies: ['Penicillin', 'Latex'],
		chronicConditions: ['Diabetes', 'Hypertension'],
		smokingStatus: 'no',
		medications: ['Metformin', 'Aspirin'],
		supportSystem: 'Lives with spouse, daily assistance',
		psychosocialFactors: 'Good compliance with treatment plan',
		location: 'Left Lower Leg',
		type: 'Venous Ulcer',
		etiology: 'Venous Insufficiency',
		dimensions: {
			length: 5.2,
			width: 3.1,
			depth: 0.5
		},
		hasUndermining: false
	}
];

const mockVisits: WoundVisit[] = [
	{
		id: 'V1',
		woundCaseId: 'WC-20240101-001',
		visitNumber: 1,
		date: '2024-01-01',
		providerId: 'Dr. Smith',
		dimensions: {
			length: 5.2,
			width: 3.1,
			depth: 0.5
		},
		hasUndermining: false,
		tissueType: ['Granulation', 'Slough'],
		exudate: {
			amount: 'moderate',
			type: 'serous'
		},
		periwoundCondition: ['Edema'],
		infectionSigns: [],
		painLevel: 3,
		images: ['https://source.unsplash.com/featured/?medical,wound'],
	},
	{
		id: 'V2',
		woundCaseId: 'WC-20240101-001',
		visitNumber: 2,
		date: '2024-01-15',
		providerId: 'Dr. Smith',
		dimensions: {
			length: 4.8,
			width: 2.9,
			depth: 0.4
		},
		hasUndermining: false,
		tissueType: ['Granulation'],
		exudate: {
			amount: 'light',
			type: 'serous'
		},
		periwoundCondition: ['Improving'],
		infectionSigns: [],
		painLevel: 2,
		images: ['https://source.unsplash.com/featured/?medical,healing'],
	}
];

const mockTreatments: Record<string, Treatment> = {
	V1: {
		id: 'T1',
		visitId: 'V1',
		woundCaseId: 'WC-20240101-001',
		date: '2024-01-01',
		providerId: 'Dr. Smith',
		dressingType: 'Foam',
		cleansingRegimen: 'Saline wash',
		therapies: ['Compression'],
		medications: ['Silver Sulfadiazine'],
		offloadingStrategies: 'Pressure relief boot',
		billing: {
			cptCodes: ['97597'],
			icd10Codes: ['L89.153']
		}
	}
};

export function WoundCases({ patientId }: { patientId: string }) {
	const { width } = useWindowDimensions();
	const isSmallScreen = width < 768;

	const [showNewCase, setShowNewCase] = useState(false);
	const [expandedCase, setExpandedCase] = useState<string | null>(null);
	const [currentStep, setCurrentStep] = useState(1);
	const [viewMode, setViewMode] = useState<'list' | 'history' | 'visit'>('list');
	const [selectedVisit, setSelectedVisit] = useState<string | null>(null);
	const [selectedCase, setSelectedCase] = useState<string | null>(null);
	const [newCase, setNewCase] = useState<Partial<WoundCase>>({
		patientId,
		isArchived: false,
		createdAt: new Date().toISOString().split('T')[0]
	});

	const handleToggleCase = (caseId: string) => {
		setExpandedCase(expandedCase === caseId ? null : caseId);
	};

	const handleArchiveCase = (caseId: string) => {
		console.log('Archive case:', caseId);
	};

	const handleViewVisit = (caseId: string, type: 'initial' | 'history') => {
		setSelectedCase(caseId);
		if (type === 'initial') {
			const initialVisit = mockVisits.find(v => v.woundCaseId === caseId && v.visitNumber === 1);
			if (initialVisit) {
				setSelectedVisit(initialVisit.id);
				setViewMode('visit');
			}
		} else {
			setViewMode('history');
		}
	};

	const handleVisitSelect = (visitId: string) => {
		setSelectedVisit(visitId);
		setViewMode('visit');
	};

	const handleBack = () => {
		if (viewMode === 'visit') {
			if (selectedVisit === mockVisits[0].id) {
				setViewMode('list');
			} else {
				setViewMode('history');
			}
			setSelectedVisit(null);
		} else {
			setViewMode('list');
			setSelectedCase(null);
		}
	};

	const handleSaveCase = () => {
		console.log('Save case:', newCase);
		setShowNewCase(false);
		setCurrentStep(1);
		setNewCase({
			patientId,
			isArchived: false,
			createdAt: new Date().toISOString().split('T')[0]
		});
	};

	if (viewMode === 'history') {
		return (
			<VisitHistory
				woundCaseId={selectedCase!}
				visits={mockVisits.filter(v => v.woundCaseId === selectedCase)}
				onBack={handleBack}
				onVisitSelect={handleVisitSelect}
			/>
		);
	}

	if (viewMode === 'visit') {
		const visit = mockVisits.find(v => v.id === selectedVisit);
		const treatment = mockTreatments[selectedVisit!];
		if (!visit) return null;

		return (
			<VisitDetail
				visit={visit}
				treatment={treatment}
				onBack={handleBack}
				isInitialVisit={visit.visitNumber === 1}
			/>
		);
	}

	return (
		<ScrollView style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.title}>Wound Cases</Text>
				<TouchableOpacity
					style={styles.addButton}
					onPress={() => setShowNewCase(true)}
				>
					<Plus size={16} color="#fff" />
					<Text style={styles.addButtonText}>Start New Wound Case</Text>
				</TouchableOpacity>
			</View>

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Open Cases</Text>
				{mockWoundCases
					.filter((woundCase) => !woundCase.isArchived)
					.map((woundCase) => (
						<View key={woundCase.id} style={styles.caseCard}>
							<TouchableOpacity
								style={styles.caseHeader}
								onPress={() => handleToggleCase(woundCase.id)}
							>
								<View style={styles.caseInfo}>
									<View>
										<Text style={styles.caseTitle}>{woundCase.description}</Text>
										<Text style={styles.caseId}>Case ID: {woundCase.id}</Text>
									</View>
									<View style={styles.visitBadge}>
										<Clock size={12} color="#1d4ed8" />
										<Text style={styles.visitCount}>{woundCase.visitCount} Visits</Text>
									</View>
								</View>
								<View style={styles.caseActions}>
									<TouchableOpacity
										onPress={(e) => {
											e.stopPropagation();
											handleArchiveCase(woundCase.id);
										}}
										style={styles.actionButton}
									>
										<Archive size={20} color="#9ca3af" />
									</TouchableOpacity>
									{expandedCase === woundCase.id ? (
										<ChevronUp size={20} color="#9ca3af" />
									) : (
										<ChevronDown size={20} color="#9ca3af" />
									)}
								</View>
							</TouchableOpacity>

							{expandedCase === woundCase.id && (
								<View style={styles.caseDetails}>
									<View style={styles.detailsGrid}>
										<View style={styles.detailItem}>
											<Text style={styles.detailLabel}>Location & Type</Text>
											<Text style={styles.detailValue}>
												{woundCase.location} - {woundCase.type}
											</Text>
										</View>
										<View style={styles.detailItem}>
											<Text style={styles.detailLabel}>Dimensions</Text>
											<Text style={styles.detailValue}>
												{woundCase.dimensions.length}cm x {woundCase.dimensions.width}cm x {woundCase.dimensions.depth}cm
											</Text>
										</View>
									</View>
									<View style={styles.buttonGroup}>
										<TouchableOpacity
											style={styles.button}
											onPress={() => handleViewVisit(woundCase.id, 'initial')}
										>
											<Eye size={16} color="#374151" />
											<Text style={styles.buttonText}>View Initial Visit</Text>
										</TouchableOpacity>
										<TouchableOpacity
											style={styles.button}
											onPress={() => handleViewVisit(woundCase.id, 'history')}
										>
											<Clock size={16} color="#374151" />
											<Text style={styles.buttonText}>View Visit History</Text>
										</TouchableOpacity>
									</View>
								</View>
							)}
						</View>
					))}
			</View>

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Archived Cases</Text>
				{mockWoundCases
					.filter((woundCase) => woundCase.isArchived)
					.map((woundCase) => (
						<View key={woundCase.id} style={[styles.caseCard, styles.archivedCard]}>
							{/* Similar structure as active cases but with muted styling */}
						</View>
					))}
			</View>
		</ScrollView>
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
		marginBottom: 24,
	},
	title: {
		fontSize: 18,
		fontWeight: '600',
		color: '#111827',
	},
	addButton: {
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
	addButtonText: {
		color: '#fff',
		fontSize: 14,
		fontWeight: '500',
		marginLeft: 8,
	},
	section: {
		marginBottom: 24,
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: '500',
		color: '#4b5563',
		marginBottom: 12,
	},
	caseCard: {
		backgroundColor: '#fff',
		borderRadius: 12,
		marginBottom: 12,
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
	archivedCard: {
		backgroundColor: '#f9fafb',
		opacity: 0.75,
	},
	caseHeader: {
		padding: 16,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	caseInfo: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
	},
	caseTitle: {
		fontSize: 14,
		fontWeight: '500',
		color: '#111827',
	},
	caseId: {
		fontSize: 12,
		color: '#6b7280',
	},
	visitBadge: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#dbeafe',
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 12,
		marginLeft: 12,
	},
	visitCount: {
		fontSize: 12,
		fontWeight: '500',
		color: '#1d4ed8',
		marginLeft: 4,
	},
	caseActions: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
	},
	actionButton: {
		padding: 4,
	},
	caseDetails: {
		paddingHorizontal: 16,
		paddingBottom: 16,
	},
	detailsGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		marginBottom: 16,
		gap: 16,
	},
	detailItem: {
		flex: 1,
		minWidth: 200,
	},
	detailLabel: {
		fontSize: 12,
		fontWeight: '500',
		color: '#4b5563',
		marginBottom: 4,
	},
	detailValue: {
		fontSize: 14,
		color: '#374151',
	},
	buttonGroup: {
		flexDirection: 'row',
		gap: 12,
		flexWrap: 'wrap',
	},
	button: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#fff',
		borderWidth: 1,
		borderColor: '#d1d5db',
		borderRadius: 6,
		paddingHorizontal: 12,
		paddingVertical: 8,
		...Platform.select({
			ios: {
				shadowColor: '#000',
				shadowOffset: { width: 0, height: 1 },
				shadowOpacity: 0.05,
				shadowRadius: 1,
			},
			android: {
				elevation: 1,
			},
		}),
	},
	buttonText: {
		fontSize: 14,
		fontWeight: '500',
		color: '#374151',
		marginLeft: 8,
	},
});