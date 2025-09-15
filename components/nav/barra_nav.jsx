// components/navigation/AppDrawer.js
import React, { useEffect, useState } from "react";
import { View, Image, Modal, TouchableWithoutFeedback, Text, TouchableHighlight } from "react-native";
import { Appbar, Drawer, Avatar } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import logoroyal from "../../assets/logoroyal.png";
import { styles } from "../../styles/inicio/inicioEstilo";
import { obtenerSesion } from "../sesion/sesion"; // Ajusta si la ruta es distinta
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function BarraNav({ activeItemKey = "first" }) {
  // Estados
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerActive, setDrawerActive] = useState(null);
  const [sesion, setSesion] = useState(null);
  const [pressedKey, setPressedKey] = useState(null);
  const navigation = useNavigation();

  // Cargar sesión al montar
  useEffect(() => {
    const cargarSesion = async () => {
      const datosSesion = await obtenerSesion();
      setSesion(datosSesion);
    };
    cargarSesion();

    // Recuperar el último botón activo
    const cargarDrawerActive = async () => {
      const lastActive = await AsyncStorage.getItem('drawerActive');
      if (lastActive) setDrawerActive(lastActive);
    };
    cargarDrawerActive();
  }, []);

  // Mostrar mensaje de carga si no hay sesión
    if (!sesion) {
      return (
        <SafeAreaView style={styles.safeArea}>  
          <View style={styles.container}>
            <Image source={logocomplet} style={styles.logocm} resizeMode="contain" />
          </View>
        </SafeAreaView>
      );
    }

  // Iniciales del usuario
  const iniciales_nombre = sesion.usuario.nombre.slice(0, 2).toUpperCase();

  // Opciones del Drawer
  const drawerItems = [
    { label: 'Inicio', key: 'first', icon: 'home', screen: 'inicio' },
    { label: 'Reservas', key: 'second', icon: 'calendar', screen: 'reserve' },
    { label: 'lis. Inventario', key: 'third', icon: 'archive', screen: 'inventario' },
    { label: 'Impuntualidad', key: 'quarter', icon: 'clock', screen: 'llegadas_tarde' },
  ];

  // Manejar selección de ítem en Drawer
  const handleItemPress = async (item) => {
    setDrawerActive(item.key);
    await AsyncStorage.setItem('drawerActive', item.key); // Guardar el último pulsado
    setDrawerVisible(false);
    if (item.screen) {
      navigation.navigate(item.screen);
    }
  };

  return (
    <>
      {/* Drawer Modal */}
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
          <Drawer.Section title="Menú...">
            {drawerItems.map(item => (
              <TouchableHighlight
                key={item.key}
                underlayColor="rgba(0,73,137,0.5)"
                onPressIn={() => setPressedKey(item.key)}
                onPressOut={() => setPressedKey(null)}
                onPress={() => handleItemPress(item)}
                style={
                  drawerActive === item.key || pressedKey === item.key
                    ? styles.drawerItemActive
                    : styles.drawerItem
                }
              >
                <Drawer.Item
                  label={item.label}
                  icon={item.icon}
                  active={drawerActive === item.key || pressedKey === item.key}
                  style={{ backgroundColor: "transparent" }}
                  labelStyle={
                    drawerActive === item.key || pressedKey === item.key
                      ? styles.drawerItemLabelActive
                      : styles.drawerItemLabel
                  }
                />
              </TouchableHighlight>
            ))}
          </Drawer.Section>
        </View>
      </Modal>

      {/* Appbar */}
      <Appbar.Header style={styles.appbar}>
        <View style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <Appbar.Action
            icon={drawerVisible ? "menu-open" : "menu"}
            onPress={() => setDrawerVisible(true)}
            size={36}
            style={{ marginLeft: 0 }}
          />
          <View style={{
            position: 'absolute',
            left: 0, right: 0, top: 0, bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: -1
          }}>
            <Image source={logoroyal} style={styles.logoBar} resizeMode="contain" />
          </View>
          <Avatar.Text
            size={40}
            label={iniciales_nombre}
            style={{ marginRight: 9 }}
          />
        </View>
      </Appbar.Header>
    </>
  );
}
