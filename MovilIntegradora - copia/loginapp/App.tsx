import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import NewLoginScreen from './screens/NewLoginScreen';
import LoginCliente from './screens/LoginCliente';
import LoginTrabajador from './screens/LoginTrabajador';
import HomeScreen from './screens/HomeScreen';
import DetailsScreen from './screens/DetailsScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import ConsumptionScreen from './screens/ConsumptionScreen';
import SupportScreen from './screens/SupportScreen';
import { AuthProvider } from './authcontext';
import HomeWorkScreen from './screens/HomeWorkScreen';

const Stack = createStackNavigator();

function InitialHomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('NewLoginScreen')}>
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="NewLoginScreen">
          <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="NewLoginScreen" component={NewLoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="LoginCliente" component={LoginCliente} />
          <Stack.Screen name="LoginTrabajador" component={LoginTrabajador} />
          <Stack.Screen name="InitialHomeScreen" component={InitialHomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="DetailsScreen" component={DetailsScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Details" component={DetailsScreen} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
          <Stack.Screen name="Consumption" component={ConsumptionScreen} />
          <Stack.Screen name="Support" component={SupportScreen} />
          <Stack.Screen name="HomeWorkScreen" component={HomeWorkScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: '80%',
    padding: 10,
    backgroundColor: '#003366',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
