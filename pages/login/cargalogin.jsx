import React, { useEffect, useRef } from "react";
import { View, Image, StyleSheet, Animated, Dimensions, Easing } from "react-native";
import logocomplet from "../../assets/logocomplet.png";

const { width } = Dimensions.get("window");

export default function SplashScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Partículas tipo halo
  const particleCount = 40;
  const particles = useRef(
    Array.from({ length: particleCount }, () => ({
      x: new Animated.Value(0),
      y: new Animated.Value(0),
      scale: new Animated.Value(0),
      opacity: new Animated.Value(0),
    }))
  ).current;

  useEffect(() => {
    // Animación del logo: fade-in + rebote + pulso
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

    // Animación de partículas tipo halo
    particles.forEach((p) => {
      const angle = Math.random() * 2 * Math.PI;
      const distance = Math.random() * 120 + 60;

      Animated.sequence([
        Animated.delay(Math.random() * 300),
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

    // Navegar a Login
    const timer = setTimeout(() => {
      if (navigation && typeof navigation.replace === "function") {
        navigation.replace("Login");
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]); // Solo navigation como dependencia

  return (
    <View style={styles.container}>
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
