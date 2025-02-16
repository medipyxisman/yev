import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Image } from 'react-native';
import { Link } from 'expo-router';
import { Text } from '../../components/ui/Text';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { colors } from '../../components/theme/colors';
import { spacing } from '../../components/theme/spacing';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginScreen() {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await login(email, password);
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
            Welcome back
          </Text>
          
          {error && (
            <Text color={colors.error[500]} style={styles.error}>
              {error}
            </Text>
          )}

          <View style={styles.form}>
            <View style={styles.field}>
              <Text variant="sm" weight="medium" color={colors.gray[500]}>
                Email
              </Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
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
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor={colors.gray[400]}
                secureTextEntry
              />
            </View>

            <Button
              variant="primary"
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </View>

          <View style={styles.footer}>
            <Text variant="sm" color={colors.gray[500]}>
              Don't have an account?{' '}
              <Link href="/register" asChild>
                <Text variant="sm" color={colors.primary[600]}>
                  Sign up
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
  error: {
    textAlign: 'center',
    marginBottom: spacing[4]
  },
  footer: {
    marginTop: spacing[6],
    alignItems: 'center'
  }
});