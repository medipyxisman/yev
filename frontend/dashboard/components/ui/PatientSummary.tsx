import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Phone, MapPin, ChevronDown } from 'lucide-react-native';
import { Picker } from '@react-native-picker/picker';
import { Patient, PatientStatus } from '../../constants/Patient';

interface PatientSummaryProps {
	patient: Patient;
	onStatusChange: (status: PatientStatus) => void;
	onCallClick: () => void;
	onDirectionsClick: () => void;
}

const statusOptions: PatientStatus[] = ['active', 'inactive', 'on-hold', 'discharged', 'archived'];

export function PatientSummary({
	patient,
	onStatusChange,
	onCallClick,
	onDirectionsClick
}: PatientSummaryProps) {
	return (
		<View style={styles.container}>
			<View style={styles.content}>
				<View style={styles.patientInfo}>
					<Text style={styles.name}>
						{patient.firstName} {patient.lastName}
					</Text>
					<Text style={styles.id}>ID: {patient.id}</Text>
				</View>

				<View style={styles.actions}>
					<View style={styles.pickerContainer}>
						<Picker
							selectedValue={patient.status}
							onValueChange={(value) => onStatusChange(value as PatientStatus)}
							style={styles.picker}
						>
							{statusOptions.map((status) => (
								<Picker.Item
									key={status}
									label={status.charAt(0).toUpperCase() + status.slice(1)}
									value={status}
									color="#374151"
								/>
							))}
						</Picker>
						{Platform.OS === 'web' && <ChevronDown style={styles.pickerIcon} size={16} color="#6b7280" />}
					</View>

					<TouchableOpacity
						onPress={onCallClick}
						style={styles.button}
					>
						<Phone size={16} color="#374151" />
						<Text style={styles.buttonText}>Call</Text>
					</TouchableOpacity>

					<TouchableOpacity
						onPress={onDirectionsClick}
						style={styles.button}
					>
						<MapPin size={16} color="#374151" />
						<Text style={styles.buttonText}>Directions</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
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
	content: {
		padding: 24,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		flexWrap: 'wrap',
		gap: 16,
	},
	patientInfo: {
		flex: 1,
		minWidth: 200,
	},
	name: {
		fontSize: 24,
		fontWeight: '700',
		color: '#111827',
	},
	id: {
		fontSize: 14,
		color: '#6b7280',
		marginTop: 4,
	},
	actions: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 16,
		flexWrap: 'wrap',
	},
	pickerContainer: {
		position: 'relative',
		borderWidth: 1,
		borderColor: '#d1d5db',
		borderRadius: 6,
		backgroundColor: '#fff',
		width: 130,
		height: 38,
		justifyContent: 'center',
	},
	picker: {
		...Platform.select({
			web: {
				height: 40,
				color: '#374151',
				paddingLeft: 12,
				paddingRight: 30,
				appearance: 'none',
				backgroundColor: 'transparent',
				border: 'none',
				outline: 'none',
			},
			default: {
			}
		}),
	},
	pickerIcon: {
		position: 'absolute',
		right: 12,
		pointerEvents: 'none',
	},
	button: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderWidth: 1,
		borderColor: '#d1d5db',
		borderRadius: 6,
		backgroundColor: '#fff',
	},
	buttonText: {
		marginLeft: 8,
		fontSize: 14,
		fontWeight: '500',
		color: '#374151',
	},
});