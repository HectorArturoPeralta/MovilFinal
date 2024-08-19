import React from 'react';
import { StyleSheet, View, Text, ImageBackground, ScrollView, TouchableOpacity } from 'react-native';

export default function NotificationsScreen() {
  const notifications = [
    { id: 1, text: 'Su nivel de agua ha alcanzado el 80%.' },
    { id: 2, text: 'Solicitud de llenado de tinaco en proceso.' },
    { id: 3, text: 'El llenado de tinaco se ha completado.' },
  ];

  return (
    <ImageBackground source={require('../assets/images/background.jpeg')} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Notificaciones</Text>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {notifications.map((notification) => (
            <View key={notification.id} style={styles.notificationCard}>
              <Text style={styles.notificationText}>{notification.text}</Text>
            </View>
          ))}
        </ScrollView>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Marcar todas como leídas</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 28,
    color: '#fff',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  scrollContainer: {
    alignItems: 'center',
  },
  notificationCard: {
    backgroundColor: '#1C3D73',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    width: '90%',
  },
  notificationText: {
    color: '#fff',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#555',
    padding: 15,
    borderRadius: 5,
    marginBottom: 30,
    alignSelf: 'center',
    width: '80%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
});
