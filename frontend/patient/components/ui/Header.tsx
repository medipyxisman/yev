import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Menu } from 'lucide-react-native';

export function Header() {
	return (
		<View style={styles.container}>
			<View style={styles.content}>
				<Image
					source={{ uri: "https://raw.githubusercontent.com/stackblitz/stackblitz-images/main/medipyxis-logo.png" }}
					style={styles.logo}
					resizeMode="contain"
				/>
				<TouchableOpacity
					style={styles.menuButton}
					onPress={() => {/* Handle menu press */ }}
					activeOpacity={0.7}
				>
					<Menu size={24} color="#9ca3af" />
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#fff',
		borderBottomWidth: 1,
		borderBottomColor: '#e5e7eb',
		position: 'relative',
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
	content: {
		maxWidth: 1280,
		marginHorizontal: 'auto',
		paddingHorizontal: 16,
		height: 64,
		flexDirection: 'row',
		alignItems: 'center',
	},
	logo: {
		height: 32,
		width: 120,
	},
	menuButton: {
		position: 'absolute',
		right: -130,
		padding: 8,
		borderRadius: 6,
		backgroundColor: 'transparent',
	},
});