import React, { useEffect, useRef } from "react";
import { View, Image, Text, StyleSheet, Animated } from "react-native";
import logocomplet from "../../assets/logocomplet.png"; // Tu logo real

export default function SplashScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Opacidad inicial en 0
  const scaleAnim = useRef(new Animated.Value(0.8)).current; // Tamaño inicial más pequeño

  useEffect(() => {
    // Animación de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Después de 2.5s pasamos al login
    const timer = setTimeout(() => {
      navigation.replace("Login");
    }, 1500);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, navigation]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={logocomplet}
        style={[
          styles.logo,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  logo: {
    width: 220,
    height: 220,
    marginBottom: 20,
    resizeMode: "contain",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#004989",
  },
});
