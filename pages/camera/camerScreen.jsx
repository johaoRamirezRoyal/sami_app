import React, { useEffect, useRef, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  AppState, 
  Linking, 
  Platform, 
  StatusBar, 
  Dimensions,
  Animated 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCameraPermissions, CameraView } from 'expo-camera';
import { Canvas, DiffRect, rect, rrect } from "@shopify/react-native-skia";
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import CustomAlert from '../../components/notification/alert';
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../../components/api/urlApi';

// Obtiene dimensiones de la pantalla
const { width, height } = Dimensions.get("window");
const innerDimension = 300;
// Define el área exterior e interior para el overlay
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

// Overlay animado con pulso y láser de escaneo
const AnimatedOverlay = () => {
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const laserAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animación de pulso del borde
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Animación del láser de escaneo
    Animated.loop(
      Animated.timing(laserAnim, {
        toValue: innerDimension,
        duration: 1500,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  // Interpolaciones para escala y opacidad del borde
  const scale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.05],
  });

  const borderOpacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.7, 1],
  });

  // Renderiza el overlay animado
  return (
    <View style={StyleSheet.absoluteFill}>
      {/* Fondo difuminado */}
      <Canvas style={StyleSheet.absoluteFill}>
        <DiffRect inner={inner} outer={outer} color="black" opacity={0.5} />
      </Canvas>

      {/* Recuadro central animado */}
      <Animated.View
        style={{
          position: 'absolute',
          top: height / 2 - innerDimension / 2,
          left: width / 2 - innerDimension / 2,
          width: innerDimension,
          height: innerDimension,
          borderRadius: 50,
          borderWidth: 4,
          borderColor: '#0173d6ff',
          opacity: borderOpacity,
          transform: [{ scale }],
          overflow: 'hidden',
        }}
      >
        {/* Láser de escaneo animado */}
        <Animated.View
          style={{
            position: 'absolute',
            left: 0,
            width: '100%',
            height: 3,
            backgroundColor: '#ffffffff',
            opacity: 0.8,
            transform: [{ translateY: laserAnim }],
          }}
        />
      </Animated.View>
    </View>
  );
};

export default function CameraScreen() {
  // Permisos de cámara
  const [permission, requestPermission] = useCameraPermissions();
  const isPermissionGranted = Boolean(permission?.granted);

  // Referencias y estados
  const qrLock = useRef(false); // Evita múltiples lecturas de QR
  const appState = useRef(AppState.currentState);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');
  const navigation = useNavigation();

  // Animación de aparición de la tarjeta de permiso
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  // Maneja el estado de la app (foreground/background)
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

  return (
    <LinearGradient colors={['#004989', '#7C4DFF']} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        {/* Si no hay permiso, muestra tarjeta para solicitarlo */}
        {!isPermissionGranted && (
          <Animated.View style={[styles.card, { 
            opacity: fadeAnim, 
            transform: [{ 
              translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) 
            }] 
          }]}>
            <Ionicons name="camera-outline" size={72} color="#004989" style={{ marginBottom: 16 }} />
            <Text style={styles.cardTitle}>Activa tu Cámara</Text>
            <Text style={styles.cardSubtitle}>
              Necesitamos tu permiso para acceder a la cámara y escanear códigos QR de asistencia.
            </Text>

            <Pressable
              onPress={requestPermission}
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
              ]}
            >
              <Ionicons name="key-outline" size={22} color="white" />
              <Text style={styles.buttonText}>Conceder Permiso</Text>
            </Pressable>
          </Animated.View>
        )}

        {/* Si hay permiso, muestra la cámara y overlay */}
        {isPermissionGranted && (
          <View style={StyleSheet.absoluteFill}>
            {Platform.OS === 'android' && <StatusBar hidden />}
            <CameraView
              style={StyleSheet.absoluteFill}
              facing="back"
              // Maneja el evento de escaneo de código QR
              onBarcodeScanned={async ({ data }) => {
                if (data && !qrLock.current) {
                  const ahora = new Date();
                  let info_asistencia = {
                      documento: data,
                      fecha_registro: ahora.toISOString().slice(0, 10),
                      hora_registro: ahora.toTimeString().substring(0, 8)
                  };
                  qrLock.current = true;

                  // Si el QR tiene error
                  if(data.error){
                    setAlertMessage(`Error al leer el código QR: ${data.error}`);
                    setAlertType('error');
                    setAlertVisible(true);
                    setTimeout(() => {
                      setAlertVisible(false);
                      navigation.navigate('llegadas_tarde');
                    }, 1000);
                    return;
                  }

                  try {
                    // Envía la asistencia al backend
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
                        navigation.navigate('llegadas_tarde');
                      }, 1000);
                    } else {
                      setAlertMessage('Asistencia registrada con éxito');
                      setAlertType('success');
                      setAlertVisible(true);
                      setTimeout(() => {
                        setAlertVisible(false);
                        navigation.navigate('llegadas_tarde');
                      }, 500);
                    }
                  } catch (error) {
                    console.error('Error registrando asistencia:', error);
                  }

                  // Intenta abrir el dato como URL (opcional)
                  setTimeout(async () => {
                    await Linking.openURL(data);
                  }, 500);
                }
              }}
            />
            <AnimatedOverlay />
          </View>
        )}

        {/* Alerta personalizada */}
        {alertVisible && (
          <CustomAlert
            message={alertMessage}
            type={alertType}
            onClose={() => setAlertVisible(false)}
          />
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

// Estilos de la pantalla
const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 8,
    width: '88%',
  },
  cardTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#004989',
    textAlign: 'center',
    marginBottom: 10,
  },
  cardSubtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  button: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#004989',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#004989',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  buttonPressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.85,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
