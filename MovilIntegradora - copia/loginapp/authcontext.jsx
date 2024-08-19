import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

// Crear el contexto
const AuthContext = createContext();

// Crear el proveedor del contexto
export function AuthProvider({ children }) {
  const [cliente, setCliente] = useState(null);
  const [trabajador, setTrabajador] = useState(null);

  // Método para iniciar sesión como cliente
  const loginCliente = async (correo, contraseña) => {
    try {
      const response = await axios.post('http://10.0.2.2:3001/api/cliente/login', { correo, contraseña });
      const { data } = response;

      // Verifica si el cliente está activo
      if (data.Estado === 'Activo') {
        setCliente(data); // Suponiendo que 'data' es el cliente con la información
      } else {
        throw new Error('Cuenta inactiva');
      }
    } catch (error) {
      console.error('Error al iniciar sesión como cliente:', error);
      throw error;
    }
  };

  // Método para iniciar sesión como trabajador
  const loginTrabajador = async (rfc, contraseña) => {
    try {
      const response = await axios.post('http://10.0.2.2:3001/api/trabajador/login', { rfc, contraseña });
      const { data } = response;
      setTrabajador(data); // Suponiendo que 'data' es el trabajador con la información
    } catch (error) {
      console.error('Error al iniciar sesión como trabajador:', error);
      throw error;
    }
  };

  // Método para cerrar sesión
  const logout = () => {
    setCliente(null);
    setTrabajador(null);
  };

  return (
    <AuthContext.Provider value={{ cliente, trabajador, loginCliente, loginTrabajador, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para usar el contexto
export function useAuth() {
  return useContext(AuthContext);
}
