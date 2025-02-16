import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Image } from 'react-native';
import { Link } from 'expo-router';
import { Text } from '../../components/ui/Text';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { colors } from '../../components/theme/colors';
import { spacing } from '../../components/theme/spacing';
import { useAuth } from '../../contexts/AuthContext';
import { Picker } from '@react-native-picker/picker';

export default function RegisterScreen() {
  const { register, loading, error } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: '',
    phone: ''
  });

  const handleRegister = async () => {
    try {
      await register(formData);
    } catch (err) {
      // Error is handled by the auth context
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={{ uri: "https://raw.githubusercontent.com/stackblitz/stackblitz-images/main/medipyxis-logo.png" }}
          style={styles.logo}
          resizeMode="contain"
        />

        <Card variant="elevated" style={styles.card}>
          <Text variant="xl" weight="semibold" style={styles.title}>
            Create an account
          </Text>
          
          {error && (
            <Text color={colors.error[500]} style={styles.error}>
              {error}
            </Text>
          )}

          <View style={styles.form}>
            <View style={styles.field}>
              <Text variant="sm" weight="medium" color={colors.gray[500]}>
                First Name
              </Text>
              <TextInput
                style={styles.input}
                value={formData.firstName}
                onChangeText={(text) => setFormData(prev => ({ ...prev, firstName: text }))}
                placeholder="Enter your first name"
                placeholderTextColor={colors.gray[400]}
              />
            </View>

            <View style={styles.field}>
              <Text variant="sm" weight="medium" color={colors.gray[500]}>
                Last Name
              </Text>
              <TextInput
                style={styles.input}
                value={formData.lastName}
                onChangeText={(text) => setFormData(prev => ({ ...prev, lastName: text }))}
                placeholder="Enter your last name"
                placeholderTextColor={colors.gray[400]}
              />
            </View>

            <View style={styles.field}>
              <Text variant="sm" weight="medium" color={colors.gray[500]}>
                Email
              </Text>
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                placeholder="Enter your email"
                placeholderTextColor={colors.gray[400]}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.field}>
              <Text variant="sm" weight="medium" color={colors.gray[500]}>
                Password
              </Text>
              <TextInput
                style={styles.input}
                value={formData.password}
                onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
                placeholder="Create a password"
                placeholderTextColor={colors.gray[400]}
                secureTextEntry
              />
            </View>

            <View style={styles.field}>
              <Text variant="sm" weight="medium" color={colors.gray[500]}>
                Role
              </Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.role}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
                >
                  <Picker.Item label="Select role" value="" />
                  <Picker.Item label="Provider" value="provider" />
                  <Picker.Item label="Staff" value="staff" />
                </Picker>
              </View>
            </View>

            <View style={styles.field}>
              <Text variant="sm" weight="medium" color={colors.gray[500]}>
                Phone Number
              </Text>
              <TextInput
                style={styles.input}
                value={formData.phone}
                onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
                placeholder="Enter your phone number"
                placeholderTextColor={colors.gray[400]}
                keyboardType="phone-pad"
              />
            </View>

            <Button
              variant="primary"
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </View>

          <View style={styles.footer}>
            <Text variant="sm" color={colors.gray[500]}>
              Already have an account?{' '}
              <Link href="/login" asChild>
                <Text variant="sm" color={colors.primary[600]}>
                  Sign in
                </Text>
              </Link>
            </Text>
          </View>
        </Card>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[100],
    padding: spacing[4]
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center'
  },
  logo: {
    width: 200,
    height: 50,
    marginBottom: spacing[8]
  },
  card: {
    width: '100%'
  },
  title: {
    textAlign: 'center',
    marginBottom: spacing[6]
  },
  form: {
    gap: spacing[4]
  },
  field: {
    gap: spacing[2]
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 8,
    padding: spacing[3],
    fontSize: 14,
    color: colors.gray[900],
    backgroundColor: colors.gray[50]
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 8,
    backgroundColor: colors.gray[50],
    overflow: 'hidden'
  },
  error: {
    textAlign: 'center',
    marginBottom: spacing[4]
  },
  footer: {
    marginTop: spacing[6],
    alignItems: 'center'
  }
});