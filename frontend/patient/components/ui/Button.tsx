import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { Text } from './Text';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

interface ButtonProps {
  children: string;
  onPress: () => void;
  variant?: ButtonVariant;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const variantStyles: Record<ButtonVariant, { 
  container: ViewStyle;
  text: TextStyle;
  icon: string;
}> = {
  primary: {
    container: {
      backgroundColor: colors.primary[600]
    },
    text: {
      color: 'white'
    },
    icon: 'white'
  },
  secondary: {
    container: {
      backgroundColor: colors.gray[100]
    },
    text: {
      color: colors.gray[900]
    },
    icon: colors.gray[900]
  },
  outline: {
    container: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.gray[300]
    },
    text: {
      color: colors.gray[900]
    },
    icon: colors.gray[900]
  },
  ghost: {
    container: {
      backgroundColor: 'transparent'
    },
    text: {
      color: colors.gray[900]
    },
    icon: colors.gray[900]
  }
};

export function Button({ 
  children,
  onPress,
  variant = 'primary',
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  disabled = false,
  style,
  textStyle
}: ButtonProps) {
  const { container, text, icon } = variantStyles[variant];

  return (
    <TouchableOpacity
      style={[
        styles.button,
        container,
        disabled && styles.disabled,
        style
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {LeftIcon && <LeftIcon size={20} color={icon} style={styles.leftIcon} />}
      <Text
        weight="medium"
        style={[text, textStyle]}
      >
        {children}
      </Text>
      {RightIcon && <RightIcon size={20} color={icon} style={styles.rightIcon} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[4],
    borderRadius: 8,
    minHeight: 40
  },
  disabled: {
    opacity: 0.5
  },
  leftIcon: {
    marginRight: spacing[2]
  },
  rightIcon: {
    marginLeft: spacing[2]
  }
});