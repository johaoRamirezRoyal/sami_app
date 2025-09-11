import { Camera, CameraView } from "expo-camera";
import { Stack } from "expo-router";
import {
  AppState,
  Linking,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from "react-native";
import { Overlay } from "./Overlay";
import { useEffect, useRef } from "react";

// Componente principal da tela de câmera
export default function Home() {
  // Ref para bloquear múltiplas leituras de QR Code
  const qrLock = useRef(false);
  // Ref para controlar o estado do app (ativo/inativo)
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    // Listener para desbloquear leitura ao retornar para o app
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        qrLock.current = false;
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <SafeAreaView style={StyleSheet.absoluteFillObject}>
      {/* Configuração da tela sem header */}
      <Stack.Screen
        options={{
          title: "Overview",
          headerShown: false,
        }}
      />
      {/* Esconde a status bar no Android */}
      {Platform.OS === "android" ? <StatusBar hidden /> : null}
      {/* Componente de câmera com leitura de QR Code */}
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={({ data }) => {
          if (data && !qrLock.current) {
            qrLock.current = true;
            setTimeout(async () => {
              await Linking.openURL(data); // Abre o link do QR Code
            }, 500);
          }
        }}
      />
      {/* Overlay personalizado */}
      <Overlay />
    </SafeAreaView>
  );
}
