// 1. React y React Native
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, Modal, TouchableWithoutFeedback } from 'react-native';

// 2. Librerías de terceros
import { getFocusedRouteNameFromRoute, useNavigation } from '@react-navigation/native';
import { Appbar, IconButton, Drawer } from 'react-native-paper';

// 3. Recursos locales (imágenes)
import logo from '../../assets/logo.jpg';
import logoroyal from '../../assets/logoroyal.png';
import { styles } from '../../styles/inicioEstilo';
import { obtenerSesion, cerrarSesion } from '../sesion/sesion';
import Prueba from '../../pages/prueba';



export default function Inicio() {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerActive, setDrawerActive] = useState('first');
  const [sesion, setSesion] = useState(null); // Nuevo estado para la sesión
  const navigation = useNavigation();

  useEffect(() => {
    const cargarSesion = async () => {
      const datosSesion = await obtenerSesion();
      setSesion(datosSesion);
    };
    cargarSesion();
  }, []);

  if (!sesion) {
    return (
      <SafeAreaView style={styles.safeArea}>  
        <View style={styles.container}>
          <Text style={styles.title}>Cargando sesión...</Text>
        </View>
      </SafeAreaView>
    );
  }
  // Extraer datos de la sesión
  let userSession;
  if(sesion && sesion.usuario){
    userSession = sesion.usuario;
    console.log('Usuario en sesión:', userSession);
  }
  // Opciones del Drawer como array
  const drawerItems = [
    { label: 'Inicio', key: 'first', icon: 'home' },
    { label: 'Reservas', key: 'second', icon: 'calendar' },
    { label: 'lis. Inventario', key: 'third', icon: 'archive' },
    { label: 'impuntualidad', key: 'quarter', icon: 'alert' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Drawer flotante */}
      <Modal
        visible={drawerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDrawerVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setDrawerVisible(false)}>
          <View style={styles.drawerOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.customDrawerContainer}>
          <Drawer.Section title="Menú">
            {drawerItems.map(item => {
              const isActive = drawerActive === item.key;
              return (
                <Drawer.Item
                  key={item.key}
                  label={item.label}
                  icon={item.icon}
                  active={isActive}
                  onPress={() => {
                    setDrawerActive(item.key);
                    setDrawerVisible(false);
                    if (item.key === 'quarter') {
                      navigation.navigate('Prueba');
                    }
                  }}
                  style={isActive ? styles.drawerItemActive : styles.drawerItem}
                  labelStyle={isActive ? styles.drawerItemLabelActive : styles.drawerItemLabel}
                />
              );
            })}
          </Drawer.Section>
        </View>
      </Modal>

      {/* Barra de navegación superior flotante */}
      <Appbar.Header style={styles.appbar}>
        <Appbar.Action
          icon={drawerVisible ? 'menu-open' : 'menu'}
          onPress={() => setDrawerVisible(true)}
          size={36}
        />
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <Image source={logoroyal} style={styles.logoBar} resizeMode="contain" />
        </View>
        <IconButton icon="account-circle" size={36} onPress={() => {}} />
      </Appbar.Header>

      {/* Contenido principal */}
      <View style={styles.container}>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.title}>¡Bienvenido a S.A.M.I app {userSession.nombre}!</Text>
        <Text style={styles.subtitle}>EU me sirvio .</Text>
        {/* Mostrar información de sesión si existe */}
        {sesion && sesion.usuario && (
          <Text style={styles.subtitle}>
            Usuario: {userSession.nombre || userSession.correo || 'Sin datos'}
          </Text>
        )}
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.buttonText}>Ir al Login</Text>
        </TouchableOpacity>
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

