// index.tsx
import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from './App';  // Adjust path if needed

export default function Index() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome to City-ζen</Text>
      <Button title="Go to Report" onPress={() => navigation.navigate('report')} />
    </View>
  );
}
