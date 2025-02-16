import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { spacing } from '../theme/spacing';

interface IconButtonProps {
  icon: LucideIcon;
  size?: number;
  color?: string;
  onPress: () => void;
  style?: ViewStyle;
}

export function IconButton({ icon: Icon, size = 24, color, onPress, style }: IconButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Icon size={size} color={color} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: spacing[2],
    borderRadius: 8
  }
});