import React from 'react';
import { View, StyleSheet, ViewProps, Pressable } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'default' | 'elevated';
}

export function Card({ children, onPress, variant = 'default', style, ...props }: CardProps) {
  const Wrapper = onPress ? Pressable : View;

  return (
    <Wrapper
      style={[
        styles.card,
        variant === 'elevated' && styles.elevated,
        style
      ]}
      onPress={onPress}
      {...props}
    >
      {children}
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.gray[50],
    borderRadius: 12,
    padding: spacing[4],
    borderWidth: 1,
    borderColor: colors.gray[200]
  },
  elevated: {
    shadowColor: colors.gray[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  }
});