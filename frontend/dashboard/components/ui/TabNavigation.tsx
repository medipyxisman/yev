import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Platform } from 'react-native';
import { Stethoscope, FileText, MessageSquare, Calendar, Users, Ban as Bandage } from 'lucide-react-native';

export type TabId = 'medical' | 'documents' | 'chat' | 'calendar' | 'staff' | 'wounds';

interface Tab {
	id: TabId;
	label: string;
	icon: React.ElementType;
}

interface TabNavigationProps {
	activeTab: TabId;
	onTabChange: (tabId: TabId) => void;
}

const tabs: Tab[] = [
	{ id: 'medical', label: 'Medical Information', icon: Stethoscope },
	{ id: 'documents', label: 'Documents', icon: FileText },
	{ id: 'chat', label: 'Chat', icon: MessageSquare },
	{ id: 'calendar', label: 'Calendar', icon: Calendar },
	{ id: 'staff', label: 'Staff', icon: Users },
	{ id: 'wounds', label: 'Wound Cases', icon: Bandage },
];

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
	return (
		<View style={styles.container}>
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={styles.scrollContent}
			>
				{tabs.map((tab) => {
					const Icon = tab.icon;
					const isActive = activeTab === tab.id;

					return (
						<TouchableOpacity
							key={tab.id}
							onPress={() => onTabChange(tab.id)}
							style={[
								styles.tab,
								isActive && styles.tabActive
							]}
						>
							<Icon
								size={20}
								color={isActive ? '#4B4FA3' : '#9ca3af'}
							/>
							<Text style={[
								styles.tabText,
								isActive && styles.tabTextActive
							]}>
								{tab.label}
							</Text>
						</TouchableOpacity>
					);
				})}
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		borderBottomWidth: 1,
		borderBottomColor: '#e5e7eb',
		backgroundColor: '#fff',
	},
	scrollContent: {
		flexGrow: 1,
		paddingHorizontal: 16,
	},
	tab: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 16,
		paddingHorizontal: 4,
		marginRight: 32,
		borderBottomWidth: 2,
		borderBottomColor: 'transparent',
	},
	tabActive: {
		borderBottomColor: '#4B4FA3',
	},
	tabText: {
		marginLeft: 8,
		fontSize: 14,
		fontWeight: '500',
		color: '#6b7280',
	},
	tabTextActive: {
		color: '#4B4FA3',
	},
});