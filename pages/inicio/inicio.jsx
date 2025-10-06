// Inicio.js
// Pantalla principal con calendario y reloj en tiempo real

import React, { useState, useEffect } from 'react';
import { View, Text, ImageBackground, Image, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';

// Recursos locales
import logo from '../../assets/logo.jpg';
import logocomplet from '../../assets/logocomplet.png';
import { styles } from '../../styles/inicio/inicioEstilo';
import BarraNav from '../../components/nav/barra_nav';
import { useSesion } from '../../hookes/useSesion';

// --- Componente Reloj en tiempo real ---
function RelojTiempoReal({ formato24 = true, style }) {
  const [horaString, setHoraString] = useState('');

  useEffect(() => {
    const actualizar = () => {
      const ahora = new Date();
      let horas = ahora.getHours();
      const minutos = ahora.getMinutes();
      const segundos = ahora.getSeconds();

      if (formato24) {
        setHoraString(
          `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`
        );
      } else {
        const ampm = horas >= 12 ? 'PM' : 'AM';
        horas = horas % 12 === 0 ? 12 : horas % 12;
        setHoraString(
          `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')} ${ampm}`
        );
      }
    };

    actualizar();
    const id = setInterval(actualizar, 1000);
    return () => clearInterval(id);
  }, [formato24]);

  return <Text style={[{ fontSize: 40, fontWeight: '700' }, style]}>{horaString}</Text>;
}

// --- Componente principal ---
export default function Inicio() {
  const sesion = useSesion();
  const navigation = useNavigation();

  if (!sesion) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Image source={logocomplet} style={styles.logocm} resizeMode="contain" />
        </View>
      </SafeAreaView>
    );
  }

  const userSession = sesion?.usuario;
  const hoy = new Date();
  const fechaHoy = hoy.toISOString().split('T')[0]; // formato yyyy-MM-dd

  return (
    <SafeAreaView style={styles.safeArea}>
      <BarraNav />
      <View style={[styles.container, { justifyContent: 'flex-start', marginTop: 20 }]}>
        {/* Imagen centrada de fondo */}
        <View style={styles.backgroundContainer}>
          <Image
            source={logo}
            style={styles.backgroundImage}
            resizeMode="contain"
          />
        </View>

        <ScrollView
          contentContainerStyle={{ alignItems: 'center', paddingBottom: 50 }}
          showsVerticalScrollIndicator={false}
          overScrollMode="never"
          bounces={false}
          scrollEventThrottle={16}
          decelerationRate="normal"
        >
          <Text style={styles.title}>¡Bienvenido a S.A.M.I !</Text>
          <Text style={styles.title}>{userSession?.nombre}</Text>

          {/* Reloj en tiempo real centrado */}
          <View style={styles.relojContainer}>
            <Text style={styles.relojLabel}>Hora local</Text>
            <RelojTiempoReal formato24={true} style={styles.reloj} />
          </View>

          {/* Calendario */}
          <View style={styles.peekCalendar}>
            <Calendar
              current={fechaHoy}
              markedDates={{ [fechaHoy]: { selected: true, marked: true } }}
              onDayPress={(day) => console.log('Seleccionado:', day.dateString)}
              hideExtraDays
              theme={{
                todayTextColor: '#ffffff',
                todayBackgroundColor: '#4CAF50',
              }}
              style={{ borderRadius: 8, backgroundColor: 'rgba(250, 250, 250, 0.4)'}}
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}


