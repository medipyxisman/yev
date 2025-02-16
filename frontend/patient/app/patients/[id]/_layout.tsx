import { Stack, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { Text } from '../../../components/ui/Text';

export default function PatientDetailsLayout() {
  const { id } = useLocalSearchParams();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: `Patient #${id}`,
          headerShown: true
        }}
      />
    </Stack>
  );
}