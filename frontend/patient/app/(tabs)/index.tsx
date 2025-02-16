import React from 'react';
import { ScrollView } from 'react-native';
import { Container } from '../../components/ui/Container';
import { Text } from '../../components/ui/Text';

export default function DashboardScreen() {
  return (
    <Container>
      <ScrollView>
        <Text variant="2xl" weight="bold">Dashboard</Text>
      </ScrollView>
    </Container>
  );
}