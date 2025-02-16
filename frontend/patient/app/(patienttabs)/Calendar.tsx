import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { Plus, Calendar as CalendarIcon } from 'lucide-react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

interface Appointment {
	id: string;
	date: string;
	time: string;
	location: string;
	purpose: string;
	notes?: string;
	estSqcm?: number;
	graftBrand?: string;
}

const mockAppointments: Appointment[] = [
	{
		id: '1',
		date: '2024-03-20',
		time: '10:00 AM',
		location: '123 Main St, Anytown, CA 12345',
		purpose: 'Wound Check-up',
		notes: 'Regular follow-up appointment',
		estSqcm: 25,
		graftBrand: '180 Health'
	},
	{
		id: '2',
		date: '2024-03-25',
		time: '2:30 PM',
		location: '123 Main St, Anytown, CA 12345',
		purpose: 'Grafting',
		notes: 'Scheduled grafting procedure',
		estSqcm: 30,
		graftBrand: 'Reprise Medical'
	}
];

const purposeOptions = ['Consultation', 'Grafting', 'Wound Check-up'];
const graftBrandOptions = ['180 Health', 'Reprise Medical', 'NextGen'];

export function Calendar() {
	const { width } = useWindowDimensions();
	const isSmallScreen = width < 768;

	const [showNewAppointment, setShowNewAppointment] = useState(false);
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [showTimePicker, setShowTimePicker] = useState(false);
	const [newAppointment, setNewAppointment] = useState<Partial<Appointment>>({
		date: '',
		time: '',
		location: '',
		purpose: '',
		notes: '',
		estSqcm: undefined,
		graftBrand: ''
	});

	const handleSaveAppointment = () => {
		console.log('Saving appointment:', newAppointment);
		setShowNewAppointment(false);
		setNewAppointment({
			date: '',
			time: '',
			location: '',
			purpose: '',
			notes: '',
			estSqcm: undefined,
			graftBrand: ''
		});
	};

	const handleDateChange = (event: any, selectedDate?: Date) => {
		setShowDatePicker(false);
		if (selectedDate) {
			setNewAppointment({
				...newAppointment,
				date: selectedDate.toISOString().split('T')[0]
			});
		}
	};

	const handleTimeChange = (event: any, selectedTime?: Date) => {
		setShowTimePicker(false);
		if (selectedTime) {
			setNewAppointment({
				...newAppointment,
				time: selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
			});
		}
	};

	return (
		<ScrollView style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.title}>Appointments</Text>
				<TouchableOpacity
					style={styles.addButton}
					onPress={() => setShowNewAppointment(true)}
				>
					<Plus size={20} color="#fff" />
					<Text style={styles.addButtonText}>Schedule Appointment</Text>
				</TouchableOpacity>
			</View>

			{showNewAppointment && (
				<View style={styles.formCard}>
					<Text style={styles.formTitle}>New Appointment</Text>

					<View style={styles.formGrid}>
						<View style={[styles.formField, !isSmallScreen && styles.formFieldHalf]}>
							<Text style={styles.label}>Date</Text>
							<TouchableOpacity
								style={styles.input}
								onPress={() => setShowDatePicker(true)}
							>
								<Text>{newAppointment.date || 'Select date'}</Text>
							</TouchableOpacity>
							{showDatePicker && (
								<DateTimePicker
									value={new Date()}
									mode="date"
									onChange={handleDateChange}
								/>
							)}
						</View>

						<View style={[styles.formField, !isSmallScreen && styles.formFieldHalf]}>
							<Text style={styles.label}>Time</Text>
							<TouchableOpacity
								style={styles.input}
								onPress={() => setShowTimePicker(true)}
							>
								<Text>{newAppointment.time || 'Select time'}</Text>
							</TouchableOpacity>
							{showTimePicker && (
								<DateTimePicker
									value={new Date()}
									mode="time"
									onChange={handleTimeChange}
								/>
							)}
						</View>

						<View style={styles.formField}>
							<Text style={styles.label}>Location</Text>
							<TextInput
								style={styles.input}
								value={newAppointment.location}
								onChangeText={(text) => setNewAppointment({ ...newAppointment, location: text })}
								placeholder="Enter address"
							/>
						</View>

						<View style={[styles.formField, !isSmallScreen && styles.formFieldHalf]}>
							<Text style={styles.label}>Purpose</Text>
							<View style={styles.pickerContainer}>
								<Picker
									selectedValue={newAppointment.purpose}
									onValueChange={(value) => setNewAppointment({ ...newAppointment, purpose: value })}
									style={styles.picker}
								>
									<Picker.Item label="Select purpose" value="" />
									{purposeOptions.map((purpose) => (
										<Picker.Item key={purpose} label={purpose} value={purpose} />
									))}
								</Picker>
							</View>
						</View>

						<View style={[styles.formField, !isSmallScreen && styles.formFieldHalf]}>
							<Text style={styles.label}>Est. Sqcm</Text>
							<TextInput
								style={styles.input}
								value={newAppointment.estSqcm?.toString() || ''}
								onChangeText={(text) => setNewAppointment({ ...newAppointment, estSqcm: Number(text) })}
								keyboardType="numeric"
								placeholder="Enter estimated square centimeters"
							/>
						</View>

						<View style={[styles.formField, !isSmallScreen && styles.formFieldHalf]}>
							<Text style={styles.label}>Graft Brand</Text>
							<View style={styles.pickerContainer}>
								<Picker
									selectedValue={newAppointment.graftBrand}
									onValueChange={(value) => setNewAppointment({ ...newAppointment, graftBrand: value })}
									style={styles.picker}
								>
									<Picker.Item label="Select graft brand" value="" />
									{graftBrandOptions.map((brand) => (
										<Picker.Item key={brand} label={brand} value={brand} />
									))}
								</Picker>
							</View>
						</View>

						<View style={styles.formField}>
							<Text style={styles.label}>Notes</Text>
							<TextInput
								style={[styles.input, styles.textArea]}
								value={newAppointment.notes}
								onChangeText={(text) => setNewAppointment({ ...newAppointment, notes: text })}
								multiline
								numberOfLines={3}
								placeholder="Add any additional notes"
							/>
						</View>
					</View>

					<View style={styles.formActions}>
						<TouchableOpacity
							style={[styles.button, styles.cancelButton]}
							onPress={() => setShowNewAppointment(false)}
						>
							<Text style={styles.cancelButtonText}>Cancel</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[styles.button, styles.saveButton]}
							onPress={handleSaveAppointment}
						>
							<Text style={styles.saveButtonText}>Save Appointment</Text>
						</TouchableOpacity>
					</View>
				</View>
			)}

			<View style={styles.appointmentsList}>
				{mockAppointments.map((appointment) => (
					<View key={appointment.id} style={styles.appointmentCard}>
						<View style={styles.appointmentHeader}>
							<View style={styles.appointmentDateTime}>
								<CalendarIcon size={20} color="#6b7280" />
								<View style={styles.dateTimeText}>
									<Text style={styles.dateText}>{appointment.date}</Text>
									<Text style={styles.timeText}>{appointment.time}</Text>
								</View>
							</View>
							<Text style={styles.purposeText}>{appointment.purpose}</Text>
						</View>

						<View style={styles.appointmentDetails}>
							<Text style={styles.locationText}>{appointment.location}</Text>
							{appointment.estSqcm && (
								<Text style={styles.detailText}>Est. Sqcm: {appointment.estSqcm}</Text>
							)}
							{appointment.graftBrand && (
								<Text style={styles.detailText}>Graft Brand: {appointment.graftBrand}</Text>
							)}
							{appointment.notes && (
								<Text style={styles.notesText}>{appointment.notes}</Text>
							)}
						</View>
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
		marginBottom: 16,
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
	},
	addButtonText: {
		color: '#fff',
		marginLeft: 8,
		fontSize: 14,
		fontWeight: '500',
	},
	formCard: {
		backgroundColor: '#fff',
		borderRadius: 12,
		padding: 16,
		marginBottom: 16,
		...Platform.select({
			ios: {
				shadowColor: '#000',
				shadowOffset: { width: 0, height: 2 },
				shadowOpacity: 0.1,
				shadowRadius: 4,
			},
			android: {
				elevation: 3,
			},
		}),
	},
	formTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: '#111827',
		marginBottom: 16,
	},
	formGrid: {
		position: 'relative',
		gap: 16,
	},
	formField: {
		flex: 1,
	},
	formFieldHalf: {
		width: '48%',
	},
	label: {
		fontSize: 14,
		fontWeight: '500',
		color: '#374151',
		marginBottom: 4,
	},
	input: {
		height: 40,
		borderWidth: 2,
		borderColor: '#d1d5db',
		borderRadius: 6,
		paddingHorizontal: 12,
		paddingVertical: 8,
		fontSize: 14,
		color: '#111827',
		width: '100%',
	}
	,
	textArea: {
		textAlignVertical: 'top',
		...Platform.select({
			web: {
				height: 150,
			},
			default: {
				height: 80,
			}
		}),
	},
	pickerContainer: {
		borderWidth: 1,
		borderColor: '#d1d5db',
		borderRadius: 6,
		overflow: 'hidden',
		height: 40,
		justifyContent: 'center',

	},
	picker: {
		...Platform.select({
			web: {
				height: 40,
				justifyContent: 'center',
			},
			default: {
			}
		}),
	},
	formActions: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		gap: 8,
		marginTop: 16,
	},
	button: {
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 6,
	},
	cancelButton: {
		borderWidth: 1,
		borderColor: '#d1d5db',
	},
	saveButton: {
		backgroundColor: '#3b82f6',
	},
	cancelButtonText: {
		color: '#374151',
		fontSize: 14,
		fontWeight: '500',
	},
	saveButtonText: {
		color: '#fff',
		fontSize: 14,
		fontWeight: '500',
	},
	appointmentsList: {
		gap: 12,
	},
	appointmentCard: {
		backgroundColor: '#fff',
		borderRadius: 12,
		padding: 16,
		...Platform.select({
			ios: {
				shadowColor: '#000',
				shadowOffset: { width: 0, height: 2 },
				shadowOpacity: 0.1,
				shadowRadius: 4,
			},
			android: {
				elevation: 2,
			},
		}),
	},
	appointmentHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 12,
	},
	appointmentDateTime: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	dateTimeText: {
		marginLeft: 8,
	},
	dateText: {
		fontSize: 14,
		fontWeight: '500',
		color: '#111827',
	},
	timeText: {
		fontSize: 14,
		color: '#6b7280',
	},
	purposeText: {
		fontSize: 14,
		color: '#111827',
	},
	appointmentDetails: {
		gap: 4,
	},
	locationText: {
		fontSize: 14,
		color: '#374151',
	},
	detailText: {
		fontSize: 14,
		color: '#374151',
	},
	notesText: {
		fontSize: 14,
		color: '#6b7280',
		marginTop: 4,
		...Platform.select({
			default: {
				height: 40,
			},
			web: {
				height: 100,
			}
		}),
	},
});