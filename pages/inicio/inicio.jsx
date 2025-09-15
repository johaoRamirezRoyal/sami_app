// 1. Importaciones principales
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, Modal, TouchableWithoutFeedback } from 'react-native';
import { getFocusedRouteNameFromRoute, useNavigation } from '@react-navigation/native';
import { Appbar, IconButton, Drawer } from 'react-native-paper';

// 2. Recursos locales (imágenes y estilos)
import logo from '../../assets/logo.jpg';
import logocomplet from '../../assets/logocomplet.png';
import { styles } from '../../styles/inicio/inicioEstilo';
import { obtenerSesion, cerrarSesion } from '../../components/sesion/sesion';
import BarraNav from '../../components/nav/barra_nav'; // <--- Agrega esta línea

// 3. Componente principal de la pantalla de inicio
export default function Inicio() {
  // --- Estados locales ---
  const [sesion, setSesion] = useState(null); // Estado de la sesión de usuario
  const navigation = useNavigation();

  // --- Efecto para cargar la sesión al montar el componente ---
  useEffect(() => {
    const cargarSesion = async () => {
      const datosSesion = await obtenerSesion();
      setSesion(datosSesion);
    };
    cargarSesion();
  }, []);

  // --- Mostrar pantalla de carga si no hay sesión ---
  if (!sesion) {
    return (
      <SafeAreaView style={styles.safeArea}>  
        <View style={styles.container}>
          <Image source={logocomplet} style={styles.logocm} resizeMode="contain" />
        </View>
      </SafeAreaView>
    );
  }

  // --- Extraer datos del usuario de la sesión ---
  let userSession;
  if (sesion && sesion.usuario) {
    userSession = sesion.usuario;
    console.log('Usuario en sesión:', userSession);
  }


  // --- Renderizado principal ---
  return (
    <SafeAreaView style={styles.safeArea}>
      <BarraNav/>{/* Barra de navegación personalizada */}
      

      {/* Contenido principal de bienvenida */}
      <View style={styles.container}>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.title}>¡Bienvenido a S.A.M.I app {userSession.nombre}!</Text>
        {/* Botón para cerrar sesión */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#d32f2f', marginTop: 10 }]}
          onPress={async () => {
            await cerrarSesion();
            setSesion(null);
            navigation.navigate('Login');
          }}
        >
          <Text style={styles.buttonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

