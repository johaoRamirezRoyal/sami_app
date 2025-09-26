import { CameraView } from "expo-camera";
import { Stack } from "expo-router";
import {
  AppState,
  Linking,
  Platform,
  StatusBar,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Overlay } from "./Overlay";
import { useEffect, useRef } from "react";

// Componente principal de la pantalla de cámara
export default function Home() {

  // Ref para bloquear múltiplas leituras de QR Code (evita lecturas duplicadas)
  const qrLock = useRef(false);
  
  // Ref para controlar el estado de la app (activa/inactiva)
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    // Listener para desbloquear la lectura al volver a la app
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      // Si la app estaba en segundo plano y vuelve a estar activa, desbloquea el QR
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        qrLock.current = false;
      }
      appState.current = nextAppState;
    });

    // Limpia el listener al desmontar el componente
    return () => {
      subscription.remove();
    };
  }, []);

  return (
    // SafeAreaView para respetar los bordes seguros de la pantalla
    <SafeAreaView style={StyleSheet.absoluteFillObject}>
      {/* Configuración de la pantalla sin header */}
      <Stack.Screen
        options={{
          title: "Overview",
          headerShown: false,
        }}
      />
      {/* Oculta la barra de estado en Android */}
      {Platform.OS === "android" ? <StatusBar hidden /> : null}
      {/* Componente de cámara con lectura de QR Code */}
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={({ data }) => {
          // Si se detecta un QR y no está bloqueado, procesa el dato
          if (data && !qrLock.current) {
            qrLock.current = true; // Bloquea nuevas lecturas
            setTimeout(async () => {
              await Linking.openURL(data); // Abre el enlace del QR
            }, 500); // Pequeño delay para evitar conflictos
          }
        }}
      />
      {/* Overlay personalizado para la cámara */}
      <Overlay />
    </SafeAreaView>
  );
}
