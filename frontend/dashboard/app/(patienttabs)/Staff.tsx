import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Edit2, Check, X } from 'lucide-react-native';
import { Picker } from '@react-native-picker/picker';
import { Patient } from '../../constants/Patient';

interface StaffProps {
	patient: Patient;
	onUpdate: (field: keyof Patient['assignedStaff'], value: string) => void;
}

const mockStaffList = {
	providers: ['Dr. Smith', 'Dr. Johnson', 'Dr. Williams'],
	bdReps: ['Bob Johnson', 'Sarah Miller', 'Mike Davis'],
	physicians: ['Dr. Brown', 'Dr. Wilson', 'Dr. Taylor']
};

export function Staff({ patient, onUpdate }: StaffProps) {
	const [editing, setEditing] = useState<keyof Patient['assignedStaff'] | null>(null);
	const [tempValue, setTempValue] = useState('');

	const handleEdit = (field: keyof Patient['assignedStaff']) => {
		setEditing(field);
		setTempValue(patient.assignedStaff[field]);
	};

	const handleSave = () => {
		if (editing) {
			onUpdate(editing, tempValue);
			setEditing(null);
		}
	};

	const handleCancel = () => {
		setEditing(null);
		setTempValue('');
	};

	const getStaffOptions = (field: keyof Patient['assignedStaff']) => {
		switch (field) {
			case 'provider':
				return mockStaffList.providers;
			case 'bdRep':
				return mockStaffList.bdReps;
			case 'referringPhysician':
				return mockStaffList.physicians;
			default:
				return [];
		}
	};

	const StaffField = ({
		title,
		field,
		value
	}: {
		title: string;
		field: keyof Patient['assignedStaff'];
		value: string;
	}) => (
		<View style={styles.fieldContainer}>
			<View style={styles.fieldContent}>
				<View style={styles.fieldTitleContainer}>
					<Text style={styles.fieldTitle}>{title}</Text>
					{editing === field ? (
						<View style={styles.pickerContainer}>
							<Picker
								selectedValue={tempValue}
								onValueChange={setTempValue}
								style={styles.picker}
							>
								{getStaffOptions(field).map((option) => (
									<Picker.Item key={option} label={option} value={option} />
								))}
							</Picker>
						</View>
					) : (
						<Text style={styles.fieldValue}>{value}</Text>
					)}
				</View>
				<View style={styles.actions}>
					{editing === field ? (
						<>
							<TouchableOpacity
								onPress={handleSave}
								style={styles.actionButton}
							>
								<Check size={20} color="#059669" />
							</TouchableOpacity>
							<TouchableOpacity
								onPress={handleCancel}
								style={styles.actionButton}
							>
								<X size={20} color="#dc2626" />
							</TouchableOpacity>
						</>
					) : (
						<TouchableOpacity
							onPress={() => handleEdit(field)}
							style={styles.actionButton}
						>
							<Edit2 size={20} color="#3b82f6" />
						</TouchableOpacity>
					)}
				</View>
			</View>
		</View>
	);

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Assigned Staff</Text>

			<View style={styles.card}>
				<StaffField
					title="Provider"
					field="provider"
					value={patient.assignedStaff.provider}
				/>
				<StaffField
					title="Business Development Representative"
					field="bdRep"
					value={patient.assignedStaff.bdRep}
				/>
				<StaffField
					title="Referring Physician"
					field="referringPhysician"
					value={patient.assignedStaff.referringPhysician}
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f3f4f6',
	},
	title: {
		fontSize: 18,
		fontWeight: '600',
		color: '#111827',
		marginBottom: 16,
	},
	card: {
		backgroundColor: 'white',
		borderRadius: 12,
		overflow: 'hidden',
		...Platform.select({
			ios: {
				shadowColor: '#000',
				shadowOffset: { width: 0, height: 1 },
				shadowOpacity: 0.1,
				shadowRadius: 2,
			},
			android: {
				elevation: 2,
			},
		}),
	},
	fieldContainer: {
		borderBottomWidth: 1,
		borderBottomColor: '#e5e7eb',
	},
	fieldContent: {
		padding: 16,
		flexDirection: 'row',
		// justifyContent: 'space-between',
		// alignItems: 'center',
	},
	fieldTitle: {
		fontSize: 14,
		fontWeight: '500',
		color: '#6b7280',
		marginBottom: 4,
	},
	fieldValue: {
		fontSize: 14,
		color: '#111827',
	},
	fieldTitleContainer: {
		...Platform.select({
			web: {
				flex: 1
			},
			default: {
				flex: 1,
			}
		}),
	},
	pickerContainer: {
		borderWidth: 1,
		borderColor: '#d1d5db',
		borderRadius: 6,
		marginTop: 4,
		backgroundColor: '#fff',
	},
	picker: {
		...Platform.select({
			web: {
				height: 40,
				width: "100%",
			},
			default: {
				width: "100%",
			}
		}),
	},
	actions: {
		flexDirection: 'row',
		gap: 8,
	},
	actionButton: {
		padding: 8,
	},
});