import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import 'react-native-gesture-handler';
import DetailScreen from './src/components/DetailScreen';
import HomeScreen from './src/components/HomeScreen';
import LoginScreen from './src/components/LoginScreen';
import SearchScreen from './src/components/SearchScreen';
import { LanguageProvider } from './src/context/LanguageContext';

const Stack = createStackNavigator();

export default function App() {
  return (
    <LanguageProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Search" component={SearchScreen} />
          <Stack.Screen name="Details" component={DetailScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </LanguageProvider>
  );
}

