import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ImageBackground, Image, Animated, Dimensions, TouchableWithoutFeedback, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../authcontext';
import axios from 'axios';
import moment from 'moment-timezone';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { cliente, trabajador, logout } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tankData, setTankData] = useState(null);
  const slideAnim = useRef(new Animated.Value(-Dimensions.get('window').width)).current;

  useEffect(() => {
    if (!cliente && !trabajador) {
      navigation.navigate('NewLoginScreen'); // Redirigir a la pantalla de inicio de sesión si no hay sesión
    }
  }, [cliente, trabajador, navigation]);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: menuVisible ? 0 : -Dimensions.get('window').width,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [menuVisible, slideAnim]);

  useEffect(() => {
    fetchTankData();
  }, [cliente]);

  const fetchTankData = async () => {
    try {
      if (cliente) {
        const response = await axios.get('http://10.0.2.2:3001/api/tinaco', {
          params: { id_cliente: cliente.id },
        });
        setTankData(response.data[0] || null); // Asegúrate de manejar la respuesta como un array
      } else {
        setTankData(null);
      }
    } catch (error) {
      console.error('Error fetching tank data:', error);
      Alert.alert('Error', 'Hubo un error al obtener los datos del tinaco.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const handleMenuItemPress = (screenName) => {
    setMenuVisible(false);
    navigation.navigate(screenName);
  };

  const closeMenu = () => {
    if (menuVisible) {
      toggleMenu();
    }
  };

  const handleRequestFill = async () => {
    try {
      if (cliente) {
        const arizonaTime = moment.tz('America/Phoenix').format('YYYY-MM-DDTHH:mm:ss');
        const response = await axios.post('http://10.0.2.2:3001/api/mensajes', {
          id_cliente: cliente.id,
          Mensaje: 'Solicitud de llenado de tinaco',
          Fecha: moment().format('YYYY-MM-DD'),
          Hora: arizonaTime.split('T')[1],
        });

        Alert.alert('Solicitud enviada', 'Tu solicitud de llenado ha sido enviada exitosamente.');
      }
    } catch (error) {
      console.error('Error al enviar la solicitud de llenado:', error);
      Alert.alert('Error', 'Hubo un error al enviar la solicitud de llenado.');
    }
  };

  const handleLogout = () => {
    logout();
    navigation.navigate('NewLoginScreen'); // Redirigir a la pantalla de inicio de sesión
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../assets/images/background.jpeg')} style={styles.background}>
        <View style={styles.header}>
          <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
            <Image source={require('../assets/images/menu-icon.jpeg')} style={styles.menuIcon} />
          </TouchableOpacity>
        </View>
        <View style={styles.main}>
          <Text style={styles.title}>Datos del Cliente</Text>
          <View style={styles.clientInfo}>
            <Text style={styles.clientText}>{cliente?.Nombre}</Text>
          </View>
          <Text style={styles.title}>NIVEL DE AGUA</Text>
          <View style={styles.tank}>
            <Text style={styles.levelText}>Nivel: {tankData?.Nivel !== undefined ? `${tankData.Nivel}%` : 'No disponible'}</Text>
            <View style={styles.levelBarContainer}>
              <View style={[styles.levelBar, { width: `${tankData?.Nivel || 0}%` }]} />
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleRequestFill}>
          <Text style={styles.buttonText}>SOLICITAR LLENADO DE TINACO</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </ImageBackground>

      {menuVisible && (
        <TouchableWithoutFeedback onPress={closeMenu}>
          <View style={styles.overlay}>
            <Animated.View style={[styles.menuContainer, { transform: [{ translateX: slideAnim }] }]}>
              <TouchableOpacity onPress={() => handleMenuItemPress('Home')}>
                <Text style={styles.menuItem}>NIVEL DE AGUA</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleMenuItemPress('Notifications')}>
                <Text style={styles.menuItem}>NOTIFICACIONES</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleMenuItemPress('Consumption')}>
                <Text style={styles.menuItem}>CONSUMO</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleMenuItemPress('Support')}>
                <Text style={styles.menuItem}>SOPORTE</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'space-between',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  menuButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 2,
  },
  menuIcon: {
    width: 30,
    height: 30,
  },
  main: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  clientInfo: {
    marginBottom: 20,
  },
  clientText: {
    fontSize: 18,
  },
  tank: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    width: '100%',
    marginBottom: 20,
  },
  levelText: {
    fontSize: 22,
    marginBottom: 10,
  },
  levelBarContainer: {
    height: 20,
    width: '100%',
    backgroundColor: '#d3d3d3',
    borderRadius: 10,
    overflow: 'hidden',
  },
  levelBar: {
    height: '100%',
    backgroundColor: '#1E90FF',
  },
  button: {
    backgroundColor: '#1E90FF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  logoutButton: {
    backgroundColor: '#FF6347',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 18,
  },
  menuContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: Dimensions.get('window').width * 0.75,
    backgroundColor: 'white',
    paddingTop: 50,
    paddingLeft: 20,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    zIndex: 3,
  },
  menuItem: {
    fontSize: 20,
    paddingVertical: 10,
  },
});
