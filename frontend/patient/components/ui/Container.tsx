import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { spacing } from '../theme/spacing';

interface ContainerProps extends ViewProps {
  children: React.ReactNode;
  padded?: boolean;
}

export function Container({ children, padded = true, style, ...props }: ContainerProps) {
  return (
    <View 
      style={[
        styles.container,
        padded && styles.padded,
        style
      ]} 
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6'
  },
  padded: {
    padding: spacing[4]
  }
});