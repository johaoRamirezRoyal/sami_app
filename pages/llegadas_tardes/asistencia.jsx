import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IconButton, DataTable } from 'react-native-paper';
import { ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import { styles } from '../../styles/inicio/inicioEstilo';
import BarraNav from '../../components/nav/barra_nav';
import { usePermiso } from '../../hookes/usePermiso';
import { useSesion } from '../../hookes/useSesion';
import { useAsistencias } from '../../hookes/useAsistencias';


export default function Inicio() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const sesion = useSesion();

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
  const navigation = useNavigation();
  // Obtener el idPerfil y usar el hook de permiso
  const perfil_id = sesion?.usuario?.perfil ? Number(sesion.usuario.perfil) : null;
  const opcion_permiso = 2;
  const hasPermission = usePermiso(opcion_permiso, perfil_id);
  // Usar el hook useAsistencias para obtener las asistencias
  const asistencias = useAsistencias(sesion, perfil_id);

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
                    <DataTable.Cell style={{ minWidth: 20 }}>{asistencia.hora_registro}</DataTable.Cell>
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
