import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, ImageBackground, Alert } from 'react-native';
import { useAuth } from '../authcontext';
import moment from 'moment-timezone';

export default function SupportScreen() {
  const { cliente, trabajador } = useAuth();
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [showRecommendationForm, setShowRecommendationForm] = useState(false);
  const [inputText, setInputText] = useState('');

  const getCurrentDateTime = () => {
    const currentDateTime = moment.tz('America/Phoenix'); // Zona horaria de Arizona
    return currentDateTime.format(); // Formato ISO 8601
  };

  const getCurrentTime = () => {
    const currentTime = moment.tz('America/Phoenix'); // Zona horaria de Arizona
    return currentTime.format('HH:mm:ss'); // Formato de hora local
  };

  const handleSendFeedback = async () => {
    const idCliente = cliente?.id || 'Desconocido';
    const fecha = getCurrentDateTime();
    const hora = getCurrentTime();

    try {
      const response = await fetch('http://10.0.2.2:3001/api/mensajes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_cliente: idCliente,
          Mensaje: inputText,
          Fecha: fecha,
          Hora: hora,
        }),
      });

      if (response.ok) {
        Alert.alert('Éxito', 'Feedback enviado con éxito.');
        setShowFeedbackForm(false);
        setInputText('');
      } else {
        const errorResponse = await response.json();
        console.error('Error al enviar feedback:', errorResponse);
        Alert.alert('Error', `Hubo un problema al enviar el feedback: ${errorResponse.message}`);
      }
    } catch (error) {
      console.error('Error de red al enviar feedback:', error);
      Alert.alert('Error', 'Hubo un problema al enviar el feedback.');
    }
  };

  const handleSendRecommendation = async () => {
    const idCliente = cliente?.id || 'Desconocido';
    const fecha = getCurrentDateTime();
    const hora = getCurrentTime();

    try {
      const response = await fetch('http://10.0.2.2:3001/api/mensajes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_cliente: idCliente,
          Mensaje: inputText,
          Fecha: fecha,
          Hora: hora,
        }),
      });

      if (response.ok) {
        Alert.alert('Éxito', 'Recomendación enviada con éxito.');
        setShowRecommendationForm(false);
        setInputText('');
      } else {
        const errorResponse = await response.json();
        console.error('Error al enviar recomendación:', errorResponse);
        Alert.alert('Error', `Hubo un problema al enviar la recomendación: ${errorResponse.message}`);
      }
    } catch (error) {
      console.error('Error de red al enviar recomendación:', error);
      Alert.alert('Error', 'Hubo un problema al enviar la recomendación.');
    }
  };

  return (
    <ImageBackground source={require('../assets/images/background.jpeg')} style={styles.background}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>SOPORTE</Text>
        </View>
        {!showFeedbackForm && !showRecommendationForm && (
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.button} onPress={() => setShowFeedbackForm(true)}>
              <Text style={styles.buttonText}>ENVIAR COMENTARIOS</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => setShowRecommendationForm(true)}>
              <Text style={styles.buttonText}>RECOMENDACIONES</Text>
            </TouchableOpacity>
          </View>
        )}
        {showFeedbackForm && (
          <View style={styles.formContainer}>
            <Text style={styles.label}>Ingrese sus comentarios:</Text>
            <TextInput
              style={styles.input}
              multiline
              numberOfLines={4}
              onChangeText={setInputText}
              value={inputText}
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSendFeedback}>
              <Text style={styles.sendButtonText}>Enviar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowFeedbackForm(false)}>
              <Text style={styles.sendButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        )}
        {showRecommendationForm && (
          <View style={styles.formContainer}>
            <Text style={styles.label}>Ingrese sus recomendaciones:</Text>
            <TextInput
              style={styles.input}
              multiline
              numberOfLines={4}
              onChangeText={setInputText}
              value={inputText}
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSendRecommendation}>
              <Text style={styles.sendButtonText}>Enviar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowRecommendationForm(false)}>
              <Text style={styles.sendButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#555',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  formContainer: {
    width: '100%',
  },
  label: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    textAlignVertical: 'top',
    borderColor: '#000',
    borderWidth: 1, // Bordes negros
  },
  sendButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  cancelButton: {
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
});
