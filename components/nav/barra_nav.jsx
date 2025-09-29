import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Image,
  Modal,
  TouchableWithoutFeedback,
  TouchableHighlight,
  TouchableOpacity,
  Text,
  Animated,
  Easing,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Appbar, Avatar } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import logoroyal from "../../assets/logoroyal.png";
import logocomplet from "../../assets/logocomplet.png";
import { styles } from "../../styles/inicio/inicioEstilo";
import { obtenerSesion, cerrarSesion } from "../../components/sesion/sesion";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

// Componente principal de la barra de navegación
export default function BarraNav({ activeItemKey = "first" }) {
  // Estados para controlar visibilidad de los drawers y sesión
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [bottomDrawerVisible, setBottomDrawerVisible] = useState(false);
  const [drawerActive, setDrawerActive] = useState(null);
  const [sesion, setSesion] = useState(null);
  const [pressedKey, setPressedKey] = useState(null);
  const navigation = useNavigation();

  // Elementos del menú lateral
  const drawerItems = [
    { label: "Inicio", key: "first", icon: "home", screen: "inicio" },
    { label: "Reservas", key: "second", icon: "calendar", screen: "reserve" },
    { label: "lis. Inventario", key: "third", icon: "archive", screen: "inventario" },
    { label: "Reportes", key: "fifth", icon: "file-chart", screen: "reportes" },
    { label: "Impuntualidad", key: "quarter", icon: "clock", screen: "llegadas_tarde" },
  ];

  // Referencia para animaciones de los items del drawer
  const animatedValuesRef = useRef({});

  // Asegura que cada item tenga su Animated.Value
  useEffect(() => {
    drawerItems.forEach((item) => {
      if (!animatedValuesRef.current[item.key]) {
        animatedValuesRef.current[item.key] = new Animated.Value(0);
      }
    });
  }, [drawerItems]);

  // Animación para el drawer inferior
  const bottomDrawerAnim = useRef(new Animated.Value(0)).current;
  const [internalVisible, setInternalVisible] = useState(false);

  // Cargar sesión y último item activo al montar el componente
  useEffect(() => {
    const cargarSesion = async () => {
      const datosSesion = await obtenerSesion();
      setSesion(datosSesion);
    };
    cargarSesion();

    const cargarDrawerActive = async () => {
      const lastActive = await AsyncStorage.getItem("drawerActive");
      if (lastActive) setDrawerActive(lastActive);
    };
    cargarDrawerActive();
  }, []);

  // Animación de resaltado de items del drawer
  useEffect(() => {
    drawerItems.forEach((item) => {
      const isHighlighted = drawerActive === item.key || pressedKey === item.key;
      Animated.timing(animatedValuesRef.current[item.key], {
        toValue: isHighlighted ? 1 : 0,
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start();
    });
  }, [drawerActive, pressedKey]);

  // Animación de aparición/desaparición del drawer inferior
  useEffect(() => {
    if (bottomDrawerVisible) {
      setInternalVisible(true);
      Animated.spring(bottomDrawerAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 6,
        tension: 50,
      }).start();
    } else {
      Animated.timing(bottomDrawerAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start(() => {
        setInternalVisible(false);
      });
    }
  }, [bottomDrawerVisible]);

  // Si no hay sesión, mostrar solo el logo
  if (!sesion) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Image source={logocomplet} style={styles.logocm} resizeMode="contain" />
        </View>
      </SafeAreaView>
    );
  }

  // Obtener iniciales del usuario para el avatar
  const userSession = sesion.usuario;
  const iniciales_nombre = userSession.nombre.slice(0, 2).toUpperCase();

  // Manejar selección de item del drawer lateral
  const handleItemPress = async (item) => {
    setDrawerActive(item.key);
    await AsyncStorage.setItem("drawerActive", item.key);
    setDrawerVisible(false);
    if (item.screen) navigation.navigate(item.screen);
  };

  // Interpolaciones para animaciones del drawer inferior
  const translateY = bottomDrawerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [500, 0],
  });

  const overlayOpacity = bottomDrawerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.3],
  });

  return (
    <>
      {/* Drawer lateral */}
      <Modal
        visible={drawerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDrawerVisible(false)}
      >
        {/* Fondo oscuro al abrir el drawer */}
        <TouchableWithoutFeedback onPress={() => setDrawerVisible(false)}>
          <View style={styles.drawerOverlay} />
        </TouchableWithoutFeedback>

        {/* Contenedor del drawer lateral */}
        <View style={[styles.customDrawerContainer, { width: "75%" }]}>
          <View style={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 8 }}>
            <Text style={{ fontSize: 28, color: "#004989", fontWeight: "bold" }}>Menú</Text>
            <View style={{ height: 2, backgroundColor: "#e0e0e0", marginTop: 8 }} />
          </View>

          {/* Renderizado de los items del drawer lateral */}
          {drawerItems.map((item) => {
            const animatedValue = animatedValuesRef.current[item.key];
            const backgroundColor = animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: ["transparent", "#004989"],
            });
            const textColor = animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: ["#004989", "#fff"],
            });

            return (
              <TouchableHighlight
                key={item.key}
                underlayColor="transparent"
                onPressIn={() => setPressedKey(item.key)}
                onPressOut={() => setPressedKey(null)}
                onPress={() => handleItemPress(item)}
                style={{ borderRadius: 30, overflow: "hidden" }}
              >
                <Animated.View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    backgroundColor,
                  }}
                >
                  <Animated.Text style={{ color: textColor }}>
                    <Icon name={item.icon} size={24} />
                  </Animated.Text>
                  <Animated.Text
                    style={{
                      color: textColor,
                      fontWeight: "bold",
                      fontSize: 18,
                      marginLeft: 16,
                    }}
                  >
                    {item.label}
                  </Animated.Text>
                </Animated.View>
              </TouchableHighlight>
            );
          })}
        </View>
      </Modal>

      {/* Barra superior de la app */}
      <Appbar.Header style={styles.appbar }>
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          {/* Botón para abrir el drawer lateral */}
          <Appbar.Action
            icon={drawerVisible ? "menu-open" : "menu"}
            onPress={() => setDrawerVisible(true)}
            size={36}
            style={{ marginLeft: 0 }}
          />
          {/* Logo centrado */}
          <View style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
            zIndex: -1
          }}>
            <Image source={logoroyal} style={styles.logoBar} resizeMode="contain" />
          </View>
          {/* Avatar del usuario, abre el drawer inferior */}
          <TouchableOpacity onPress={() => setBottomDrawerVisible(true)}>
            <Avatar.Text
              size={40}
              label={iniciales_nombre}
              color="#fff"
              style={{ marginRight: 9, backgroundColor: "#004989" }}
            />
          </TouchableOpacity>
        </View>
      </Appbar.Header>
      <View style={{ paddingTop: 70 }}>
        {/* Aquí va el resto del contenido de la pantalla */}
      </View>
      {/* Drawer inferior (perfil y cerrar sesión) */}
      <Modal
        visible={internalVisible}
        transparent
        onRequestClose={() => setBottomDrawerVisible(false)}
      >
        {/* Fondo oscuro al abrir el drawer inferior */}
        <TouchableWithoutFeedback onPress={() => setBottomDrawerVisible(false)}>
          <Animated.View
            style={{
              flex: 1,
              backgroundColor: overlayOpacity.interpolate({
                inputRange: [0, 0.3],
                outputRange: ["rgba(0,0,0,0)", "rgba(0,0,0,0.3)"],
              }),
            }}
          />
        </TouchableWithoutFeedback>

        {/* Contenido del drawer inferior */}
        <Animated.View
          style={{
            transform: [{ translateY }],
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "#fff",
            borderTopLeftRadius: 80,
            borderTopRightRadius: 80,
            padding: 24,
            minHeight: 500,
            elevation: 10,
            alignItems: "center",
          }}
        >
          {/* Avatar grande del usuario */}
          <Avatar.Text
            size={150}
            label={iniciales_nombre}
            color="#fff"
            style={{
              position: "absolute",
              top: -75,
              alignSelf: "center",
              zIndex: 10,
              backgroundColor: "#004989",
            }}
          />
          <View style={{ height: 75 }} />
          <Text style={{ alignSelf: "center", fontSize: 22, fontWeight: "bold", marginBottom: 24 }}>
            {userSession.nombre}
          </Text>

          <View style={{ flex: 1, width: "100%", position: "relative" }}>
            <Text style={{
              color: "#004989",
              fontSize: 22,
              fontWeight: "bold",
              textAlign: "left",
              alignSelf: "flex-start",
              marginLeft: 10,
              marginBottom: 8,
            }}>
              Perfil
            </Text>
            <View style={{ width: "100%", height: 1, backgroundColor: "#e0e0e0", marginBottom: 18 }} />

            {/* Botón para ver información personal */}
            <View style={{ alignItems: "center" }}>
              <TouchableOpacity
                style={{
                  width: 180,
                  height: 40,
                  borderRadius: 30,
                  backgroundColor: "#ffffff",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 12,
                }}
                onPress={() => {
                  setBottomDrawerVisible(false);
                  navigation.navigate("perfil");
                }}
              >
                <Text style={{ fontSize: 18, color: "#004989", fontWeight: "bold" }}>
                  Información personal
                </Text>
              </TouchableOpacity>
            </View>

            {/* Botón para cerrar sesión */}
            <View style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              alignItems: "center",
            }}>
              <TouchableOpacity
                style={{
                  width: 180,
                  height: 40,
                  borderRadius: 30,
                  backgroundColor: "#004989",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={async () => {
                  await cerrarSesion();
                  setSesion(null);
                  navigation.navigate("Login");
                }}
              >
                <Text style={{
                  fontSize: 17,
                  color: "#fff",
                  fontWeight: "bold",
                  textAlign: "center",
                }}>
                  Cerrar sesión
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </Modal>
    </>
  );
}
