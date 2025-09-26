// 1. Importaciones principales
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { getFocusedRouteNameFromRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Appbar, IconButton, Drawer } from 'react-native-paper';

// 2. Recursos locales (imágenes y estilos)
import logo from '../../assets/logo.jpg';
import logocomplet from '../../assets/logocomplet.png';
import { styles } from '../../styles/inicio/inicioEstilo';
import BarraNav from '../../components/nav/barra_nav'; // Barra de navegación personalizada
import { useSesion } from '../../hookes/useSesion';

// 3. Componente principal de la pantalla de inicio
export default function Inicio() {
  // --- Estados locales ---
  // Hook personalizado para obtener la sesión del usuario
  const sesion = useSesion();
  const navigation = useNavigation();

  // --- Mostrar pantalla de carga si no hay sesión ---
  // Si la sesión aún no está disponible, muestra el logo de carga
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
  // Si existe la sesión y el usuario, extrae los datos del usuario
  let userSession;
  if (sesion && sesion.usuario) {
    userSession = sesion.usuario;
  }

  // --- Renderizado principal ---
  // Muestra la barra de navegación y el mensaje de bienvenida con el nombre del usuario
  return (
    <SafeAreaView style={styles.safeArea}>
      <BarraNav/>{/* Barra de navegación personalizada */}
      
      {/* Contenido principal de bienvenida */}
      <View style={[styles.container, { justifyContent: 'flex-start', marginTop: 20 }]}>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.title}>¡Bienvenido a S.A.M.I app!</Text>
        <Text style={styles.title}>{userSession.nombre}</Text>
      </View>
    </SafeAreaView>
  );
}

