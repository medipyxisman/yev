import React from 'react';
import { View, Text, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { Calendar, Activity, Star } from 'lucide-react-native';
import { Patient } from '../../constants/Patient';

interface MetricsDashboardProps {
	metrics: Patient['metrics'];
}

export function MetricsDashboard({ metrics }: MetricsDashboardProps) {
	const { width } = useWindowDimensions();
	const isSmallScreen = width < 768;

	const getWoundStatusColor = (status: string) => {
		switch (status) {
			case 'improving':
				return '#059669';
			case 'stable':
				return '#2563eb';
			case 'critical':
				return '#dc2626';
			case 'stagnant':
				return '#d97706';
			default:
				return '#4b5563';
		}
	};

	const MetricCard = ({
		icon: Icon,
		title,
		value,
		color = '#3b82f6'
	}: {
		icon: React.ElementType;
		title: string;
		value: string;
		color?: string;
	}) => (
		<View style={[
			styles.card,
			isSmallScreen ? styles.cardFullWidth : styles.cardThird
		]}>
			<View style={styles.cardContent}>
				<Icon size={32} color={color} />
				<View style={styles.metricInfo}>
					<Text style={styles.metricTitle}>{title}</Text>
					<Text style={styles.metricValue}>{value}</Text>
				</View>
			</View>
		</View>
	);

	return (
		<View style={styles.container}>
			<View style={styles.grid}>
				<MetricCard
					icon={Calendar}
					title="Days Since Last Visit"
					value={metrics.daysSinceLastVisit.toString()}
				/>
				<MetricCard
					icon={Activity}
					title="Overall Wound Status"
					value={metrics.woundStatus.charAt(0).toUpperCase() + metrics.woundStatus.slice(1)}
					color={getWoundStatusColor(metrics.woundStatus)}
				/>
				<MetricCard
					icon={Star}
					title="Patient Satisfaction"
					value={`${metrics.patientSatisfaction.toFixed(1)}/5`}
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginTop: 24,
	},
	grid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 16,
	},
	card: {
		backgroundColor: '#fff',
		borderRadius: 12,
		padding: 24,
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
	cardFullWidth: {
		width: '100%',
	},
	cardThird: {
		flex: 1,
		minWidth: 250,
	},
	cardContent: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	metricInfo: {
		marginLeft: 16,
		flex: 1,
	},
	metricTitle: {
		fontSize: 14,
		fontWeight: '500',
		color: '#6b7280',
	},
	metricValue: {
		marginTop: 4,
		fontSize: 24,
		fontWeight: '600',
		color: '#111827',
	},
});