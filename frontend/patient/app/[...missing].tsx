import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
import { Container } from '../components/ui/Container';
import { Text } from '../components/ui/Text';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <Container style={styles.container}>
        <Text variant="2xl" weight="bold">Page Not Found</Text>
        <Link href="/" style={styles.link}>
          <Text color="#3b82f6">Go back home</Text>
        </Link>
      </Container>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  link: {
    marginTop: 16
  }
});