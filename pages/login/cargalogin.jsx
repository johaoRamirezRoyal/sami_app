import React, { useEffect, useRef } from "react";
import { View, Image, StyleSheet, Animated, Dimensions, Easing } from "react-native";
import logocomplet from "../../assets/logocomplet.png";

const { width } = Dimensions.get("window");

export default function SplashScreen({ navigation }) {
  // Animaciones principales del logo
  const fadeAnim = useRef(new Animated.Value(0)).current;    // Opacidad del logo
  const scaleAnim = useRef(new Animated.Value(0.7)).current; // Escala inicial del logo
  const pulseAnim = useRef(new Animated.Value(1)).current;   // Pulso para efecto de latido

  // Configuración de partículas tipo halo
  const particleCount = 40;
  // Cada partícula tiene valores animados para posición, escala y opacidad
  const particles = useRef(
    Array.from({ length: particleCount }, () => ({
      x: new Animated.Value(0),
      y: new Animated.Value(0),
      scale: new Animated.Value(0),
      opacity: new Animated.Value(0),
    }))
  ).current;

  useEffect(() => {
    // Animación del logo: fade-in, rebote y pulso infinito
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 60,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();

    // Animación de partículas: se dispersan en círculo y desaparecen
    particles.forEach((p) => {
      const angle = Math.random() * 2 * Math.PI; // Ángulo aleatorio
      const distance = Math.random() * 120 + 60; // Distancia aleatoria desde el centro

      Animated.sequence([
        Animated.delay(Math.random() * 300), // Pequeño retraso aleatorio
        Animated.parallel([
          Animated.timing(p.x, {
            toValue: distance * Math.cos(angle),
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(p.y, {
            toValue: distance * Math.sin(angle),
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(p.scale, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(p.opacity, {
            toValue: 0,
            duration: 1200,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    });

    // Navega automáticamente a la pantalla de Login después de 2 segundos
    const timer = setTimeout(() => {
      if (navigation && typeof navigation.replace === "function") {
        navigation.replace("Login");
      }
    }, 2000);

    // Limpia el temporizador si el componente se desmonta antes
    return () => clearTimeout(timer);
  }, [navigation]); // Solo navigation como dependencia

  return (
    <View style={styles.container}>
      {/* Renderiza las partículas animadas */}
      {particles.map((p, index) => (
        <Animated.View
          key={index}
          style={[
            styles.particle,
            {
              transform: [
                { translateX: Animated.multiply(p.x, pulseAnim) },
                { translateY: Animated.multiply(p.y, pulseAnim) },
                { scale: Animated.multiply(p.scale, pulseAnim) },
              ],
              opacity: p.opacity,
            },
          ]}
        />
      ))}
      {/* Logo animado */}
      <Animated.Image
        source={logocomplet}
        style={[
          styles.logo,
          {
            opacity: fadeAnim,
            transform: [{ scale: Animated.multiply(scaleAnim, pulseAnim) }],
          },
        ]}
      />
    </View>
  );
}

// Estilos para el splash y partículas
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  logo: {
    width: width * 0.75,
    height: width * 0.75,
    resizeMode: "contain",
  },
  particle: {
    position: "absolute",
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(0, 73, 137, 0.3)",
  },
});
