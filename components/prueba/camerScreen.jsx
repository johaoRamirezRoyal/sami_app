import React, { useEffect, useRef, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  Pressable, 
  AppState, 
  Linking, 
  Platform, 
  StatusBar, 
  Dimensions 
} from 'react-native';
import { useCameraPermissions, CameraView } from 'expo-camera';
import { Canvas, DiffRect, rect, rrect } from "@shopify/react-native-skia";
import CustomAlert from '../helpComponent/alert';
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../api/urlApi';

// ===================
// Configuración Overlay
// ===================
const { width, height } = Dimensions.get("window");
const innerDimension = 300;
const outer = rrect(rect(0, 0, width, height), 0, 0);
const inner = rrect(
  rect(
    width / 2 - innerDimension / 2,
    height / 2 - innerDimension / 2,
    innerDimension,
    innerDimension
  ),
  50,
  50
);

// Overlay visual para enfocar el área de escaneo
const Overlay = () => (
  <Canvas style={Platform.OS === "android" ? { flex: 1 } : StyleSheet.absoluteFillObject}>
    <DiffRect inner={inner} outer={outer} color="black" opacity={0.5} />
  </Canvas>
);

export default function CamerScreen() {
  // Permisos de cámara
  const [permission, requestPermission] = useCameraPermissions();
  const isPermissionGranted = Boolean(permission?.granted);

  // Referencias para controlar el escaneo y el estado de la app
  const qrLock = useRef(false);
  const appState = useRef(AppState.currentState);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success'); // 'success' o 'error'
  const navigation = useNavigation();

  // Resetear el bloqueo del QR al volver a la app
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        qrLock.current = false;
      }
      appState.current = nextAppState;
    });
    return () => subscription.remove();
  }, []);

  // ===================
  // Renderizado principal
  // ===================
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Pantalla de Cámara</Text>
      <View style={styles.card}>
        <Pressable
          onPress={requestPermission}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.buttonText}>Solicitar Permisos</Text>
        </Pressable>
      </View>
      <Text style={styles.infoText}>
        {isPermissionGranted
          ? 'Permiso concedido. Puedes abrir la cámara.'
          : 'Debes conceder permisos para usar la cámara.'}
      </Text>

      {/* Cámara y overlay solo si hay permisos */}
      {isPermissionGranted && (
        <View style={StyleSheet.absoluteFill}>
          {Platform.OS === 'android' && <StatusBar hidden />}
          <CameraView
            style={StyleSheet.absoluteFill}
            facing="back"
            onBarcodeScanned={async ({ data }) => {
              if (data && !qrLock.current) {
                const ahora = new Date();
                let info_asistencia = {
                    documento: data,
                    fecha_registro: ahora.toISOString().slice(0, 10),
                    hora_registro: ahora.toTimeString().substring(0, 8)
                };
                qrLock.current = true;

                if(data.error){
                  setAlertMessage(`Error al leer el código QR: ${data.error}`);
                  setAlertType('error');
                  setAlertVisible(true);
                  setTimeout(() => {
                    setAlertVisible(false);
                    navigation.navigate('Prueba'); // Asegúrate que el nombre de la ruta sea correcto
                  }, 1000); // <-- Cambiado a 1 segundo
                  return;
                }

                try {
                  // API URL AKI
                  const response = await fetch(`${BASE_URL}/asistencias_estudiantes/registrarAsistencia`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json"
                    },
                    body: JSON.stringify(info_asistencia)
                  });
                  const result = await response.json();
                  if(result.error){
                    setAlertMessage(`Error al tomar asistencia`);
                    setAlertType('error');
                    setAlertVisible(true);
                    setTimeout(() => {
                      setAlertVisible(false);
                      navigation.navigate('Prueba');
                    }, 1000); // <-- Cambiado a 1 segundo
                    return;
                  } else {
                    setAlertMessage('Asistencia registrada con éxito');
                    setAlertType('success');
                    setAlertVisible(true);
                    setTimeout(() => {
                      setAlertVisible(false);
                      navigation.navigate('Prueba');
                    }, 500); // <-- Cambiado a 1 segundo
                    return;
                  }
                } catch (error) {
                  console.error('Error registrando asistencia:', error);
                }

                setTimeout(async () => {
                  await Linking.openURL(data);
                }, 500);
              }
            }}
          />
          <Overlay />
        </View>
      )}
      {alertVisible && (
        <CustomAlert
          message={alertMessage}
          type={alertType} // <-- Nueva prop
          onClose={() => setAlertVisible(false)}
        />
      )}
    </SafeAreaView>
  );
}

// ===================
// Estilos
// ===================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6FB',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    color: '#1A237E',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 32,
    letterSpacing: 1,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    gap: 24,
  },
  button: {
    backgroundColor: '#0E7AFE',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 40,
    marginVertical: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  infoText: {
    color: '#37474F',
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
});