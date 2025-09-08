// 1. React y React Native
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, Modal, TouchableWithoutFeedback } from 'react-native';

// 2. Librerías de terceros
import { useNavigation } from '@react-navigation/native';
import { Appbar, IconButton, Drawer } from 'react-native-paper';

// 3. Recursos locales (imágenes)
import logo from '../../assets/logo.jpg';
import logoroyal from '../../assets/logoroyal.png';
import { styles } from '../../styles/inicioEstilo';

export default function Inicio() {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerActive, setDrawerActive] = useState('first');
  const navigation = useNavigation();

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
                  onPress={() => { setDrawerActive(item.key); setDrawerVisible(false); }}
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
        <Text style={styles.title}>¡Bienvenido a S.A.M.I app!</Text>
        <Text style={styles.subtitle}>EU me sirvio .</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.buttonText}>Ir al Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}