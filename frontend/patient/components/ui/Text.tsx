import React from 'react';
import { Text as RNText, StyleSheet, TextProps } from 'react-native';
import { typography } from '../theme/typography';
import { colors } from '../theme/colors';

interface CustomTextProps extends TextProps {
  variant?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  color?: string;
}

export function Text({ 
  children, 
  variant = 'base',
  weight = 'normal',
  color = colors.gray[900],
  style,
  ...props 
}: CustomTextProps) {
  return (
    <RNText 
      style={[
        styles.text,
        { fontSize: typography.sizes[variant] },
        { fontWeight: typography.weights[weight] },
        { color },
        style
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: typography.families.sans
  }
});