import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, useWindowDimensions, Platform } from 'react-native';
import { Activity, Users, FileText, TrendingUp, Heart } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Picker } from '@react-native-picker/picker';

// Define the navigation types
type RootStackParamList = {
	PatientDetails: { id: number };
	Patients: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Define component prop types
interface StatCardProps {
	icon: React.ElementType;
	title: string;
	value: string;
	change?: string;
	color?: string;
	onPress?: () => void;
}

interface ActivityItemProps {
	icon: React.ElementType;
	title: string;
	time: string;
	onPress: () => void;
}

interface AppointmentItemProps {
	name: string;
	details: string;
	onPress: () => void;
}

const Dashboard = () => {
	const { width } = useWindowDimensions();
	const navigation = useNavigation<NavigationProp>();
	const [selectedOutlet, setSelectedOutlet] = React.useState('all');
	const [selectedTimeframe, setSelectedTimeframe] = React.useState('month');
	const [isLoading, setIsLoading] = React.useState(false);

	// Responsive breakpoints
	const isSmallScreen = width < 640;
	const isMediumScreen = width >= 640 && width < 1024;
	const isLargeScreen = width >= 1024;

	// Calculate dynamic grid columns based on screen size
	const getStatCardWidth = () => {
		if (isLargeScreen) return { width: (width - 96) / 4 };
		if (isMediumScreen) return { width: (width - 64) / 2 };
		return { width: width - 32 };
	};

	const StatCard: React.FC<StatCardProps> = ({
		icon: Icon,
		title,
		value,
		change,
		color = '#3b82f6',
		onPress
	}) => (
		<TouchableOpacity
			style={[styles.statCard, getStatCardWidth(), onPress && styles.pressable]}
			onPress={onPress}
			activeOpacity={onPress ? 0.7 : 1}
		>
			<View style={styles.statContent}>
				<View style={styles.statInfo}>
					<Text style={styles.statTitle}>{title}</Text>
					<Text style={styles.statValue}>{value}</Text>
					{change && (
						<View style={styles.changeContainer}>
							<Text style={[
								styles.changeText,
								{ color: change.startsWith('+') ? '#059669' : '#dc2626' }
							]}>
								{change}
							</Text>
							<Text style={styles.changeCompare}> vs last month</Text>
						</View>
					)}
				</View>
				<View style={[styles.iconContainer, { backgroundColor: `${color}10` }]}>
					<Icon size={24} color={color} />
				</View>
			</View>
		</TouchableOpacity>
	);

	const ActivityItem: React.FC<ActivityItemProps> = ({ icon: Icon, title, time, onPress }) => (
		<TouchableOpacity
			style={styles.activityItem}
			onPress={onPress}
			activeOpacity={0.7}
		>
			<View style={styles.activityContent}>
				<View style={styles.activityIcon}>
					<Icon size={20} color="#3b82f6" />
				</View>
				<View style={styles.activityInfo}>
					<Text style={styles.activityTitle}>{title}</Text>
					<Text style={styles.activityTime}>{time}</Text>
				</View>
			</View>
			<TouchableOpacity
				onPress={onPress}
				style={styles.viewButton}
			>
				<Text style={styles.viewButtonText}>View</Text>
			</TouchableOpacity>
		</TouchableOpacity>
	);

	const AppointmentItem: React.FC<AppointmentItemProps> = ({ name, details, onPress }) => (
		<TouchableOpacity
			style={styles.appointmentItem}
			onPress={onPress}
			activeOpacity={0.7}
		>
			<View style={styles.appointmentContent}>
				<View style={styles.avatar} />
				<View style={styles.appointmentInfo}>
					<Text style={styles.appointmentName}>{name}</Text>
					<Text style={styles.appointmentDetails}>{details}</Text>
				</View>
			</View>
			<View style={[
				styles.appointmentActions,
				isSmallScreen && styles.appointmentActionsStacked
			]}>
				<TouchableOpacity
					onPress={() => {/* Handle accept */ }}
					style={styles.actionButton}
				>
					<Text style={styles.acceptButtonText}>Accept</Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => {/* Handle reschedule */ }}
					style={styles.actionButton}
				>
					<Text style={styles.rescheduleButtonText}>Reschedule</Text>
				</TouchableOpacity>
			</View>
		</TouchableOpacity>
	);

	return (
		<ScrollView style={styles.container}>
			<View style={[styles.content, isLargeScreen && styles.contentWide]}>
				<View style={styles.header}>
					<View style={styles.welcomeContainer}>
						<Heart size={32} color="#3b82f6" strokeWidth={2} />
						<View style={styles.welcomeText}>
							<Text style={styles.title}>Welcome back</Text>
							<Text style={styles.subtitle}>Here's what's happening with your practice today.</Text>
						</View>
					</View>

					<View style={[
						styles.filters,
						!isSmallScreen && styles.filtersRow
					]}>
						<View style={[
							styles.pickerContainer,
							!isSmallScreen && styles.pickerWide
						]}>
							<Picker
								selectedValue={selectedOutlet}
								onValueChange={setSelectedOutlet}
								style={styles.picker}
							>
								<Picker.Item label="All Outlets" value="all" />
								<Picker.Item label="Main Clinic" value="main" />
								<Picker.Item label="Branch Office" value="branch" />
							</Picker>
						</View>

						<View style={[
							styles.timeframeButtons,
							!isSmallScreen && styles.timeframeButtonsWide
						]}>
							{['Today', 'Week', 'Month'].map((period) => (
								<TouchableOpacity
									key={period.toLowerCase()}
									style={[
										styles.timeframeButton,
										selectedTimeframe === period.toLowerCase() && styles.timeframeButtonActive
									]}
									onPress={() => setSelectedTimeframe(period.toLowerCase())}
								>
									<Text style={[
										styles.timeframeButtonText,
										selectedTimeframe === period.toLowerCase() && styles.timeframeButtonTextActive
									]}>
										{period}
									</Text>
								</TouchableOpacity>
							))}
						</View>
					</View>
				</View>

				<View style={styles.statsGrid}>
					<StatCard
						icon={Activity}
						title="Active Cases"
						value="124"
						change="+12.5%"
						color="#3b82f6"
						onPress={() => navigation.navigate('Patients')}
					/>
					<StatCard
						icon={Users}
						title="Total Patients"
						value="1,429"
						change="+4.3%"
						color="#059669"
						onPress={() => navigation.navigate('Patients')}
					/>
					<StatCard
						icon={FileText}
						title="Reports Generated"
						value="89"
						change="+22.4%"
						color="#7c3aed"
					/>
					<StatCard
						icon={TrendingUp}
						title="Recovery Rate"
						value="94%"
						change="+2.1%"
						color="#f97316"
					/>
				</View>

				<View style={[
					styles.gridContainer,
					!isSmallScreen && styles.gridContainerWide
				]}>
					<View style={[styles.card, !isSmallScreen && styles.cardHalf]}>
						<Text style={styles.cardTitle}>Recent Activity</Text>
						{[1, 2, 3].map((i) => (
							<ActivityItem
								key={i}
								icon={Users}
								title="New patient registered"
								time="2 minutes ago"
								onPress={() => navigation.navigate('PatientDetails', { id: i })}
							/>
						))}
					</View>

					<View style={[styles.card, !isSmallScreen && styles.cardHalf]}>
						<Text style={styles.cardTitle}>Upcoming Appointments</Text>
						{[1, 2, 3].map((i) => (
							<AppointmentItem
								key={i}
								name="Sarah Wilson"
								details="Dental Checkup • 2:00 PM"
								onPress={() => navigation.navigate('PatientDetails', { id: i })}
							/>
						))}
					</View>
				</View>
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f3f4f6',
	},
	content: {
		padding: 16,
	},
	contentWide: {
		maxWidth: 1280,
		alignSelf: 'center',
		width: '100%',
	},
	header: {
		marginBottom: 24,
	},
	welcomeContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 16,
	},
	welcomeText: {
		marginLeft: 12,
		marginTop: 25,
	},
	title: {
		fontSize: 24,
		fontWeight: '600',
		color: '#111827',
	},
	subtitle: {
		fontSize: 14,
		color: '#6b7280',
		marginTop: 4,
	},
	filters: {
		marginTop: 16,
		gap: 8,
	},
	filtersRow: {
		flexDirection: 'row',
		gap: 16,
	},
	pickerContainer: {
		backgroundColor: 'white',
		borderRadius: 8,
		borderWidth: 1,
		borderColor: '#e5e7eb',
	},
	pickerWide: {
		flex: 1,
	},
	picker: {
		height: 50,
		alignItems: 'center',
		...Platform.select({
			web: {
				paddingHorizontal: 8,
				outline: 'none',
			},
		}),
	},
	timeframeButtons: {
		flexDirection: 'row',
		justifyContent: 'center',
		backgroundColor: 'white',
		borderRadius: 8,
		borderWidth: 1,
		borderColor: '#e5e7eb',
	},
	timeframeButtonsWide: {
		flex: 1,
		maxWidth: 300,
	},
	timeframeButton: {
		flex: 1,
		paddingVertical: 8,
		alignContent: 'center',
		alignItems: 'center',
		justifyContent: 'center'
	},
	timeframeButtonActive: {
		backgroundColor: '#111827',
		borderRadius: 8,
	},
	timeframeButtonText: {
		fontSize: 14,
		color: '#6b7280',
	},
	timeframeButtonTextActive: {
		color: 'white',
	},
	statsGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 16,
		marginBottom: 24,
	},
	statCard: {
		backgroundColor: 'white',
		borderRadius: 16,
		padding: 16,
		borderWidth: 1,
		borderColor: '#f3f4f6',
	},
	pressable: {
		...Platform.select({
			web: {
				cursor: 'pointer',
				transition: 'transform 0.2s',
				':hover': {
					transform: 'translateY(-2px)',
				},
			},
			default: {
				elevation: 1,
			},
		}),
	},
	statContent: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
	},
	statInfo: {
		flex: 1,
		marginRight: 12,
	},
	statTitle: {
		fontSize: 14,
		color: '#6b7280',
		fontWeight: '500',
	},
	statValue: {
		fontSize: 24,
		fontWeight: '600',
		color: '#111827',
		marginTop: 8,
	},
	changeContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 8,
		flexWrap: 'wrap',
	},
	changeText: {
		fontSize: 14,
		fontWeight: '500',
	},
	changeCompare: {
		fontSize: 14,
		color: '#6b7280',
	},
	iconContainer: {
		padding: 12,
		borderRadius: 12,
	},
	gridContainer: {
		gap: 16,
	},
	gridContainerWide: {
		flexDirection: 'row',
	},
	card: {
		backgroundColor: 'white',
		borderRadius: 16,
		padding: 16,
		borderWidth: 1,
		borderColor: '#f3f4f6',
	},
	cardHalf: {
		flex: 1,
	},
	cardTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: '#111827',
		marginBottom: 16,
	},
	activityItem: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: '#f3f4f6',
	},
	activityContent: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1,
	},
	activityIcon: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: '#eff6ff',
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 12,
	},
	activityInfo: {
		flex: 1,
	},
	activityTitle: {
		fontSize: 14,
		fontWeight: '500',
		color: '#111827',
	},
	activityTime: {
		fontSize: 14,
		color: '#6b7280',
	},
	viewButton: {
		padding: 8,
	},
	viewButtonText: {
		color: '#3b82f6',
		fontSize: 14,
	},
	appointmentItem: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: '#f3f4f6',
		flexWrap: 'wrap',
		gap: 8,
	},
	appointmentContent: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1,
	},
	appointmentInfo: {
		flex: 1,
	},
	avatar: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: '#f3f4f6',
		marginRight: 12,
	},
	appointmentName: {
		fontSize: 14,
		fontWeight: '500',
		color: '#111827',
	},
	appointmentDetails: {
		fontSize: 14,
		color: '#6b7280',
	},
	appointmentActions: {
		flexDirection: 'row',
		gap: 8,
	},
	appointmentActionsStacked: {
		flexDirection: 'column',
		width: '100%',
	},
	actionButton: {
		padding: 8,
	},
	acceptButtonText: {
		color: '#3b82f6',
		fontSize: 14,
	},
	rescheduleButtonText: {
		color: '#6b7280',
		fontSize: 14,
	},
});

export default Dashboard;