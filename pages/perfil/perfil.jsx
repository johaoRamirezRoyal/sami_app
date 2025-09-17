// 1. Importaciones principales
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import BarraNav from '../../components/nav/barra_nav';
import { obtenerSesion } from '../../components/sesion/sesion';
import { styles } from '../../styles/perfil/perfilEstilo';

export default function PerfilScreen() {
  const [sesion, setSesion] = useState(null);

  useEffect(() => {
    const cargarSesion = async () => {
      const datosSesion = await obtenerSesion();
      setSesion(datosSesion);
    };
    cargarSesion();
  }, []);

  if (!sesion) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={{ fontSize: 24, color: '#004989' }}>Cargando perfil...</Text>
      </SafeAreaView>
    );
  }

  const usuario = sesion.usuario || {};

  return (
    <SafeAreaView style={styles.safeArea}>
      <BarraNav />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Avatar animado */}
        <Animatable.View
          animation="bounceIn"
          duration={1200}
          style={styles.avatarContainer}
        >
          <LinearGradient
            colors={['#004989', '#0260b3ff']}
            style={styles.avatarGradient}
          >
            <Avatar.Text
              size={120}
              label={(usuario.nombre || 'US').slice(0, 2).toUpperCase()}
              color="#fff"
              style={{ backgroundColor: 'transparent' }}
            />
          </LinearGradient>
        </Animatable.View>

        {/* Nombre animado */}
        <Animatable.Text animation="fadeInDown" delay={300} style={styles.name}>
          {usuario.nombre}
        </Animatable.Text>

        {/* Tarjeta de información animada */}
        <Animatable.View animation="fadeInUp" delay={500} style={styles.card}>
          <View style={styles.item}>
            <MaterialCommunityIcons name="account" size={24} color="#004989" />
            <Text style={styles.itemLabel}>Nombre:</Text>
            <Text style={styles.itemText}>{usuario.nombre}</Text>
          </View>
          <View style={styles.item}>
            <MaterialCommunityIcons name="account-outline" size={24} color="#004989" />
            <Text style={styles.itemLabel}>Apellido:</Text>
            <Text style={styles.itemText}>{usuario.apellido}</Text>
          </View>
          <View style={styles.item}>
            <MaterialCommunityIcons name="email" size={24} color="#004989" />
            <Text style={styles.itemLabel}>Correo:</Text>
            <Text style={styles.itemText}>{usuario.email}</Text>
          </View>
          <View style={styles.item}>
            <MaterialCommunityIcons name="phone" size={24} color="#004989" />
            <Text style={styles.itemLabel}>Teléfono:</Text>
            <Text style={styles.itemText}>{usuario.telefono}</Text>
          </View>
          <View style={styles.item}>
            <MaterialCommunityIcons name="card-account-details" size={24} color="#004989" />
            <Text style={styles.itemLabel}>Documento:</Text>
            <Text style={styles.itemText}>{usuario.documento}</Text>
          </View>
          <View style={styles.item}>
            <MaterialCommunityIcons name="star" size={24} color="#004989" />
            <Text style={styles.itemLabel}>Nivel:</Text>
            <Text style={styles.itemText}>{usuario.nivel}</Text>
          </View>
        </Animatable.View>
      </ScrollView>
    </SafeAreaView>
  );
}


