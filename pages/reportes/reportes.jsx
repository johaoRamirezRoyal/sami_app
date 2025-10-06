// 1. Importaciones principales
import React, { useState, useEffect } from 'react';
import { View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// 2. Recursos locales (imágenes y estilos)
import { styles } from '../../styles/inicio/inicioEstilo';
import BarraNav from '../../components/nav/barra_nav';
import { useSesion } from '../../hookes/useSesion';

// 3. Componente principal de la pantalla de reportes
export default function Reportes() {
  // --- Estados locales para manejo de sesión y errores ---
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const sesion = useSesion();

  // --- Efecto para verificar la sesión del usuario ---
  useEffect(() => {
    let timer;
    if (!sesion || !sesion.usuario) {
      setLoading(true);
      timer = setTimeout(() => {
        setLoading(false);
        setError(true);
      }, 8000); // 8 segundos
    } else {
      setLoading(false);
      setError(false);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [sesion]);

  // --- Mostrar pantalla de carga ---
  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#004989" style={{ marginBottom: 20 }} />
          <Text style={styles.title}>Cargando sesión...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // --- Mostrar pantalla de error ---
  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={{ color: 'red', marginTop: 20, fontWeight: 'bold' }}>
            Error: La sesión está tardando demasiado en cargar. Por favor, verifica tu conexión o intenta nuevamente.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // --- Renderizado principal de la pantalla de reportes ---
  return (
    
    <SafeAreaView style={styles.safeArea}>
              <BarraNav />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <View style={styles.container}>
          {/* Título de la pantalla */}
          <View style={{ marginTop: 24, marginBottom: 8, alignSelf: 'flex-start', width: '100%', zIndex: 2 }}>
            <Text
              style={{
                color: '#004989',
                fontWeight: 'bold',
                fontSize: 20,
                textAlign: 'left',
                letterSpacing: 1,
              }}
            >
              Reportes
            </Text>
            <View
              style={{
                height: 1,
                backgroundColor: '#b0b0b0',
                marginTop: 4,
                borderRadius: 2,
                opacity: 0.7,
                width: '100%',
              }}
            />
          </View>
          {/* Contenido principal */}
          <View style={{ flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <MaterialCommunityIcons
              name="tools"
              size={48}
              color="#b0b0b0"
              style={{ marginBottom: 12 }}
            />
            <Text style={{ color: '#666', fontSize: 18, fontWeight: 'bold', marginBottom: 4 }}>
              ¡En construcción!
            </Text>
            <Text style={{ color: '#888', fontSize: 15, textAlign: 'center', maxWidth: 260 }}>
              Estamos trabajando para traerte esta sección pronto.
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

