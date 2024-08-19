// src/screens/LoginTrabajador.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ImageBackground, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../authcontext';

function LoginTrabajador() {
  const navigation = useNavigation();
  const { loginTrabajador } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await loginTrabajador(email, password); // Llama al método de inicio de sesión del contexto

      // Verificar si la autenticación fue exitosa
      if (email && password) { // Puedes agregar más lógica de verificación si es necesario
        alert('¡Inicio de sesión exitoso!');
        navigation.navigate('HomeWorkScreen'); // Navegar a la pantalla de inicio después de iniciar sesión
      } else {
        alert('Credenciales inválidas');
      }
    } catch (error) {
      console.error('Error de inicio de sesión:', error);
      alert('Error de inicio de sesión, por favor intenta de nuevo.');
    }
  };

  return (
    <ImageBackground source={require('../assets/images/background.jpeg')} style={styles.background}>
      <View style={styles.container}>
        <Image source={require('../assets/images/logo.png')} style={styles.logo} />
        <Text style={styles.title}>Bienvenido Trabajador</Text>
        <TextInput
          style={styles.input}
          placeholder="RFC"
          keyboardType="email-address"
          onChangeText={setEmail}
          value={email}
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          secureTextEntry
          onChangeText={setPassword}
          value={password}
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
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
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#000', // Contorno negro
  },
  button: {
    width: '80%',
    padding: 10,
    backgroundColor: '#1E90FF',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default LoginTrabajador;
