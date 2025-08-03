import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import TabNavigatorPortfolio from './TabNavigatorPortfolio';
import TabNavigatorSupervisor from './TabNavigatorSupervisor';

const Stack = createNativeStackNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="TabNavigatorPortfolio" component={TabNavigatorPortfolio} />
        <Stack.Screen name="TabNavigatorSupervisor" component={TabNavigatorSupervisor} />
      </Stack.Navigator>
    </NavigationContainer>
  );
} 