// 1. Importaciones principales
import React, { useState } from 'react';
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
import { styles } from '../../styles/perfil/perfilEstilo';
import { useSesion } from '../../hookes/useSesion';

// Componente principal de la pantalla de perfil
export default function PerfilScreen() {
  // Hook personalizado para obtener la sesión del usuario
  const sesion = useSesion();

  // Si la sesión aún no está cargada, mostrar pantalla de carga
  if (!sesion) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={{ fontSize: 24, color: '#004989' }}>Cargando perfil...</Text>
      </SafeAreaView>
    );
  }

  // Extraer datos del usuario de la sesión
  const usuario = sesion.usuario || {};

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Barra de navegación superior */}
      <BarraNav />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Avatar animado con gradiente */}
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

        {/* Nombre del usuario animado */}
        <Animatable.Text animation="fadeInDown" delay={300} style={styles.name}>
          {usuario.nombre}
        </Animatable.Text>

        {/* Tarjeta con información del usuario, animada */}
        <Animatable.View animation="fadeInUp" delay={500} style={styles.card}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'column' }}>
              {/* Item: Nombre */}
              <View style={styles.item}>
                <MaterialCommunityIcons name="account" size={24} color="#004989" />
                <View style={styles.textContainer}>
                  <Text style={styles.itemLabel}>Nombre:</Text>
                  <Text style={styles.itemText}>{usuario.nombre}</Text>
                </View>
              </View>
              {/* Item: Apellido */}
              <View style={styles.item}>
                <MaterialCommunityIcons name="account-outline" size={24} color="#004989" />
                <View style={styles.textContainer}>
                  <Text style={styles.itemLabel}>Apellido:</Text>
                  <Text style={styles.itemText}>{usuario.apellido}</Text>
                </View>
              </View>
              {/* Item: Correo */}
              <View style={styles.item}>
                <MaterialCommunityIcons name="email" size={24} color="#004989" />
                <View style={styles.textContainer}>
                  <Text style={styles.itemLabel}>Correo:</Text>
                  <Text style={styles.itemText}>{usuario.correo}</Text>
                </View>
              </View>
              {/* Item: Documento */}
              <View style={styles.item}>
                <MaterialCommunityIcons name="card-account-details" size={24} color="#004989" />
                <View style={styles.textContainer}>
                  <Text style={styles.itemLabel}>Documento:</Text>
                  <Text style={styles.itemText}>{usuario.documento}</Text>
                </View>
              </View>
              {/* Item: Nivel */}
              <View style={styles.item}>
                <MaterialCommunityIcons name="star" size={24} color="#004989" />
                <View style={styles.textContainer}>
                  <Text style={styles.itemLabel}>Nivel:</Text>
                  <Text style={styles.itemText}>{usuario.nom_nivel}</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </Animatable.View>
      </ScrollView>
    </SafeAreaView>
  );
}


