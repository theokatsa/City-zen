import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Login from './login';  // Adjust path if needed
import Home from './home';    // Adjust path if needed
import Report from './report';

// Define your routes and their params here
export type RootStackParamList = {
  login: undefined;
  home: undefined;
  report: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState<string | null>(null);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        setUserToken(token);
      } catch (e) {
        console.error('Error reading token', e);
      } finally {
        setIsLoading(false);
      }
    };

    checkToken();
  }, []);

  if (isLoading) {
    // Render null or a splash/loading screen here while checking AsyncStorage
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {userToken == null ? (
          // User is not logged in
          <Stack.Screen name="login" component={Login} />
        ) : (
          // User is logged in
          <>
            <Stack.Screen name="home" component={Home} />
            <Stack.Screen name="report" component={Report} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
