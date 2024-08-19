import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import DetailsScreen from './screens/DetailsScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import ConsumptionScreen from './screens/ConsumptionScreen';
import SupportScreen from './screens/SupportScreen';
import 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';

enableScreens();

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Details" component={DetailsScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="Consumption" component={ConsumptionScreen} />
        <Stack.Screen name="Support" component={SupportScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
