import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView
} from 'react-native';

import { IconButton, DataTable } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import { styles } from '../../styles/inicio/inicioEstilo';
import { obtenerSesion } from '../../components/sesion/sesion';
import { BASE_URL } from '../../components/api/urlApi';
import BarraNav from '../../components/nav/barra_nav';

export default function Inicio() {
  const [sesion, setSesion] = useState(null);
  const navigation = useNavigation();

  const [asistencias, setAsistencias] = useState([]);

  useEffect(() => {
    const cargarSesion = async () => {
      const datosSesion = await obtenerSesion();
      setSesion(datosSesion);
    };
    cargarSesion();
  }, []);

  useEffect(() => {
    const fetchAsistencias = async () => {
      try {
        const response = await fetch(`${BASE_URL}/asistencias_estudiantes/asistenciasDiaHoy`);
        const data = await response.json();
        setAsistencias(data);
      } catch (error) {
        console.error('Error al obtener asistencias:', error);
      }
    };
    fetchAsistencias();
  }, []);

  if (!sesion || !sesion.usuario) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.title}>Cargando sesión...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const userSession = sesion.usuario;

  return (
    <SafeAreaView style={styles.safeArea}>
      <BarraNav/>{/* Barra de navegación personalizada */}
      <View style={styles.container}>
        <Text style={styles.title}>Toma de asistencias</Text>

        <View style={{ alignItems: 'center', marginVertical: 30 }}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Camera');
            }}
            activeOpacity={0.7}
            style={{
              backgroundColor: '#e0e7ef',
              borderRadius: 24,
              padding: 16,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconButton
              icon="qrcode-scan"
              size={120}
              color="#004989"
              style={{ backgroundColor: 'transparent' }}
              onPress={null}
            />
            <Text style={{ color: '#004989', fontWeight: 'bold', fontSize: 18, marginTop: 0 }}>
              Registrar asistencia
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: 24, marginBottom: 8, alignSelf: 'flex-start', width: '100%' }}>
          <Text
            style={{
              color: '#004989',
              fontWeight: 'bold',
              fontSize: 20,
              textAlign: 'left',
              letterSpacing: 1,
            }}
          >
            Llegadas tardes
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

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title style={{ minWidth: 120 }}>Documentos</DataTable.Title>
                <DataTable.Title style={{ minWidth: 300 }}>Nombre</DataTable.Title>
                <DataTable.Title style={{ minWidth: 120 }}>Curso</DataTable.Title>
                <DataTable.Title style={{ minWidth: 120 }}>Fecha</DataTable.Title>
                <DataTable.Title style={{ minWidth: 10 }}>Hora</DataTable.Title>
              </DataTable.Header>
            </DataTable>
            <ScrollView style={{ maxHeight: 300 }} showsVerticalScrollIndicator={true}>
              <DataTable>
                {asistencias.map((asistencia, idx) => (
                  <DataTable.Row key={idx}>
                    <DataTable.Cell style={{ minWidth: 120 }}>{asistencia.documento}</DataTable.Cell>
                    <DataTable.Cell style={{ minWidth: 300 }}>{asistencia.nom_user}</DataTable.Cell>
                    <DataTable.Cell style={{ minWidth: 120 }}>{asistencia.nombre_curso}</DataTable.Cell>
                    <DataTable.Cell style={{ minWidth: 120 }}>
                      {new Date(asistencia.fecha_registro).toLocaleDateString('es-ES')}
                    </DataTable.Cell>
                    <DataTable.Cell style={{ minWidth: 10 }}>{asistencia.hora_registro}</DataTable.Cell>
                  </DataTable.Row>
                ))}
              </DataTable>
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
