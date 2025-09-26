import { View, Text, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, Stack } from "expo-router";
import { useCameraPermissions } from "expo-camera";

/**
 * Home component para la pantalla principal del escáner QR.
 * Permite solicitar permisos de cámara y navegar a la pantalla de escaneo.
 */
export default function Home() {
  // Hook para gestionar permisos de cámara
  const [permission, requestPermission] = useCameraPermissions();

  // Verifica si el permiso fue concedido
  const isPermissionGranted = Boolean(permission?.granted);

  return (
    <SafeAreaView style={styles.container}>
      {/* Oculta el header de la pantalla */}
      <Stack.Screen options={{ title: "Overview", headerShown: false }} />
      <Text style={styles.title}>QR Code Scanner</Text>
      <View style={{ gap: 20 }}>
        {/* Botón para solicitar permisos de cámara */}
        <Pressable onPress={requestPermission}>
          <Text style={styles.buttonStyle}>Request Permissions</Text>
        </Pressable>
        {/* Botón para navegar al escáner, deshabilitado si no hay permisos */}
        <Link href={"/scanner"} asChild>
          <Pressable disabled={!isPermissionGranted}>
            <Text
              style={[
                styles.buttonStyle,
                { opacity: !isPermissionGranted ? 0.5 : 1 },
              ]}
            >
              Scan Code
            </Text>
          </Pressable>
        </Link>
      </View>
    </SafeAreaView>
  );
}

// Estilos para la pantalla
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "black",
    justifyContent: "space-around",
    paddingVertical: 80,
  },
  title: {
    color: "white",
    fontSize: 40,
  },
  buttonStyle: {
    color: "#0E7AFE",
    fontSize: 20,
    textAlign: "center",
  },
});
