import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IconButton, DataTable, TextInput, Button, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import { styles } from '../../styles/inicio/inicioEstilo';
import BarraNav from '../../components/nav/barra_nav';
import { usePermiso } from '../../hookes/usePermiso';
import { useSesion } from '../../hookes/useSesion';
import { useAsistencias } from '../../hookes/useAsistencias';
import { BASE_URL } from '../../components/api/urlApi';

// Componente principal para la pantalla de asistencias
export default function Inicio() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [inputValue, setInputValue] = useState('');
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [showAccordion, setShowAccordion] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const sesion = useSesion();

  useEffect(() => {
    let timer;
    if (!sesion || !sesion.usuario) {
      setLoading(true);
      timer = setTimeout(() => {
        setLoading(false);
        setError(true);
      }, 8000);
    } else {
      setLoading(false);
      setError(false);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [sesion]);

  const navigation = useNavigation();

  const perfil_id = sesion?.usuario?.perfil ? Number(sesion.usuario.perfil) : null;
  const opcion_permiso = 2;
  const hasPermission = usePermiso(opcion_permiso, perfil_id);

  const asistencias = useAsistencias(sesion, perfil_id, refresh);

  // Función para manejar la búsqueda
  const handleInputButton = async () => {
    try {
      const res = await fetch(`${BASE_URL}/usuarios/usuario`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ usuario: inputValue })
      });
      const text = await res.text();
      let data = {};
      if (text) {
        data = JSON.parse(text);
      }
      setNombreUsuario(data.nombre || 'No encontrado');
      setShowAccordion(true);
    } catch (err) {
      console.error('Error al buscar usuario:', err);
      setNombreUsuario('No encontrado');
      setShowAccordion(true);
    }
  };

  useEffect(() => {
    if (inputValue.trim().length > 0) {
      fetch(`${BASE_URL}/usuarios/usuario`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ usuario: inputValue })
      })
        .then(res => res.text())
        .then(text => {
          let data = {};
          if (text) {
            data = JSON.parse(text);
          }
          setNombreUsuario(data.nombre || 'No encontrado');
          setShowAccordion(true);
        })
        .catch(() => {
          setNombreUsuario('No encontrado');
          setShowAccordion(true);
        });
    } else {
      setNombreUsuario('');
      setShowAccordion(false);
    }
  }, [inputValue]);

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
      <BarraNav />
      <TouchableWithoutFeedback
        onPress={() => {
          if (showAccordion) setShowAccordion(false);
        }}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Toma de asistencias</Text>

          {/* Botón QR */}
          <View style={{ alignItems: 'center', marginVertical: 5 }}>
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
                size={100}
                color="#004989"
                style={{ backgroundColor: 'transparent' }}
                onPress={null}
              />
              <Text style={{ color: '#004989', fontWeight: 'bold', fontSize: 15, marginTop: 0 }}>
                Registrar asistencia
              </Text>
            </TouchableOpacity>
          </View>

          {/* Input con icono de búsqueda */}
          <View style={{ marginBottom: 5, position: 'relative', width: '100%' }}>
            <TextInput
              mode="outlined"
              placeholder="Buscar estudiante"
              value={inputValue}
              onChangeText={setInputValue}
              style={{
                backgroundColor: '#ffffff04',
                borderRadius: 20,
                height: 45,
              }}
              theme={{
                roundness: 8,
                colors: { primary: '#004989' }
              }}
              activeOutlineColor="#004989"
              right={
                <TextInput.Icon
                  icon="magnify"
                  color="#004989"
                  onPress={handleInputButton}
                  style={{ marginTop: 8 }}
                />
              }
              onFocus={() => setShowAccordion(true)}
              onBlur={() => setShowAccordion(false)}
            />

            {/* Acordeón flotante */}
            {showAccordion && nombreUsuario !== '' && (
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  top: 50,
                  left: 0,
                  right: 0,
                  zIndex: 10,
                  backgroundColor: '#ffffffff',
                  borderRadius: 10,
                  padding: 10,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 2,
                  elevation: 4,
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                activeOpacity={0.7}
                onPress={async () => {
                  const ahora = new Date();
                  const info_asistencia = {
                    documento: inputValue,
                    fecha_registro: ahora.toISOString().slice(0, 10),
                    hora_registro: ahora.toTimeString().substring(0, 8)
                  };
                  try {
                    const res = await fetch(`${BASE_URL}/asistencias_estudiantes/registrarAsistencia`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json"
                      },
                      body: JSON.stringify(info_asistencia)
                    });
                    const result = await res.json();
                    alert(`Asistencia registrada para: ${nombreUsuario}`);
                    setRefresh(r => !r); // <-- Esto fuerza la recarga
                  } catch (err) {
                    alert('Error al registrar asistencia');
                  }
                  setShowAccordion(false);
                }}
              >
                <Text style={{ color: '#004989', fontWeight: 'bold', fontSize: 16 }}>
                  {nombreUsuario}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Título sección */}
          <View style={{ marginTop: 0, marginBottom: 8, alignSelf: 'flex-start', width: '100%' }}>
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

          {/* Tabla de asistencias */}
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
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
