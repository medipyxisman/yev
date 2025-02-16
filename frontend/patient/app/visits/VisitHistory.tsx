import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { ArrowLeft, Calendar as CalendarIcon } from 'lucide-react-native';
import { WoundVisit } from '../../constants/Patient';

interface VisitHistoryProps {
	woundCaseId: string;
	visits: WoundVisit[];
	onBack: () => void;
	onVisitSelect: (visitId: string) => void;
}

export function VisitHistory({ woundCaseId, visits, onBack, onVisitSelect }: VisitHistoryProps) {
	const { width } = useWindowDimensions();
	const isSmallScreen = width < 768;
	const isMediumScreen = width >= 768 && width < 1024;
	const isLargeScreen = width >= 1024;

	const getGridColumns = () => {
		if (isLargeScreen) return 3;
		if (isMediumScreen) return 2;
		return 1;
	};

	const getCardWidth = () => {
		const columns = getGridColumns();
		const gap = 16;
		const padding = 32;
		const availableWidth = width - padding;
		return (availableWidth - (gap * (columns - 1))) / columns;
	};

	return (
		<ScrollView style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity
					onPress={onBack}
					style={styles.backButton}
				>
					<ArrowLeft size={16} color="#4b5563" />
					<Text style={styles.backButtonText}>Back to Wound Case</Text>
				</TouchableOpacity>
				<Text style={styles.title}>Visit History</Text>
			</View>

			<View style={styles.grid}>
				{visits.map((visit) => (
					<TouchableOpacity
						key={visit.id}
						style={[styles.card, { width: isSmallScreen ? '100%' : getCardWidth() }]}
						onPress={() => onVisitSelect(visit.id)}
					>
						<View style={styles.cardContent}>
							<View style={styles.iconContainer}>
								<CalendarIcon size={24} color="#3b82f6" />
							</View>
							<View style={styles.visitInfo}>
								<Text style={styles.visitNumber}>Visit #{visit.visitNumber}</Text>
								<Text style={styles.visitDate}>{visit.date}</Text>
								<View style={styles.dimensions}>
									<Text style={styles.dimensionsText}>
										Dimensions: {visit.dimensions.length}cm x {visit.dimensions.width}cm x {visit.dimensions.depth}cm
									</Text>
								</View>
								{visit.images[0] && (
									<View style={styles.imageContainer}>
										<Image
											source={{ uri: visit.images[0] }}
											style={styles.image}
											resizeMode="cover"
										/>
									</View>
								)}
							</View>
						</View>
					</TouchableOpacity>
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
	backButton: {
		flexDirection: 'row',
		alignItems: 'center',
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
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 16,
		paddingHorizontal: 16,
	},
	card: {
		backgroundColor: '#fff',
		borderRadius: 12,
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
	cardContent: {
		padding: 16,
		flexDirection: 'row',
	},
	iconContainer: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: '#eff6ff',
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 16,
	},
	visitInfo: {
		flex: 1,
	},
	visitNumber: {
		fontSize: 14,
		fontWeight: '500',
		color: '#111827',
	},
	visitDate: {
		fontSize: 14,
		color: '#6b7280',
		marginTop: 2,
	},
	dimensions: {
		marginTop: 8,
	},
	dimensionsText: {
		fontSize: 14,
		color: '#4b5563',
	},
	imageContainer: {
		marginTop: 8,
		height: 128,
		borderRadius: 8,
		overflow: 'hidden',
	},
	image: {
		width: '100%',
		height: '100%',
	},
});