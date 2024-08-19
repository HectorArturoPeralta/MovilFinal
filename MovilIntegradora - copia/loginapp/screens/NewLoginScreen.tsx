import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function NewLoginScreen() {
  const navigation = useNavigation();

  return (
    <ImageBackground source={require('../assets/images/background.jpeg')} style={styles.background}>
      <View style={styles.container}>
        <Image source={require('../assets/images/logo.png')} style={styles.logo} />
        <Text style={styles.title}>Inicie sesión como:</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('LoginCliente')}>
          <Text style={styles.buttonText}>CLIENTE</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('LoginTrabajador')}>
          <Text style={styles.buttonText}>TRABAJADOR</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 50,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    marginBottom: 20,
  },
  button: {
    width: '60%',
    padding: 10,
    backgroundColor: '#1E90FF',
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default NewLoginScreen;
