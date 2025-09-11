// 1. Importaciones de React y React Native
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, Modal, TouchableWithoutFeedback, ScrollView } from 'react-native';

// 2. Librerías de terceros
import { CurrentRenderContext, getFocusedRouteNameFromRoute, useNavigation } from '@react-navigation/native';
import { Appbar, IconButton, Drawer, DataTable } from 'react-native-paper';
import { TextInput, Button } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';

// 3. Recursos locales (imágenes, estilos y utilidades)
import logoroyal from '../assets/logoroyal.png'; 
import { styles } from '../styles/inicioEstilo'; 
import { obtenerSesion, cerrarSesion } from '../components/sesion/sesion'; 

// Componente principal de la pantalla
export default function Inicio() {
  // Estado para mostrar/ocultar el Drawer (menú lateral)
  const [drawerVisible, setDrawerVisible] = useState(false);
  // Estado para resaltar el ítem activo del Drawer
  const [drawerActive, setDrawerActive] = useState('first');
  // Estado para almacenar la sesión del usuario
  const [sesion, setSesion] = useState(null);
  // Hook de navegación
  const navigation = useNavigation();

  // Estados y lógica para la DataTable (tabla de datos)
  const [page, setPage] = useState(0);
  const [numberOfItemsPerPageList] = useState([2, 3, 4]);
  const [itemsPerPage, onItemsPerPageChange] = useState(numberOfItemsPerPageList[0]);
  const [items] = useState([]); // Lista vacía para la tabla
  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, items.length);

  // Estados para el selector de fecha
  const [fecha, setFecha] = useState(null);
  const [showPicker, setShowPicker] = useState(false);

  // 1. Agrega un estado para las asistencias
  const [asistencias, setAsistencias] = useState([]);

  // Maneja el cambio de fecha en el DateTimePicker
  const onChangeFecha = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) setFecha(selectedDate);
  };

  // Carga la sesión del usuario al montar el componente
  useEffect(() => {
    const cargarSesion = async () => {
      const datosSesion = await obtenerSesion();
      setSesion(datosSesion);
    };
    cargarSesion();
  }, []);

  // Reinicia la página de la tabla si cambia la cantidad de ítems por página
  useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  // 2. Fetch de asistencias al montar el componente
  useEffect(() => {
    const fetchAsistencias = async () => {
      try {
        const response = await fetch('http://192.168.0.107:3000/api/asistencias_estudiantes/asistenciasDiaHoy');
        const data = await response.json();
        setAsistencias(data); // Ajusta según la estructura de tu respuesta
      } catch (error) {
        console.error('Error al obtener asistencias:', error);
      }
    };
    fetchAsistencias();
  }, []);

  // Muestra pantalla de carga si la sesión aún no está disponible
  if (!sesion || !sesion.usuario) {
    return (
      <SafeAreaView style={styles.safeArea}>  
        <View style={styles.container}>
          <Text style={styles.title}>Cargando sesión...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Datos del usuario y configuración del Drawerr
  const userSession = sesion.usuario;
  const drawerItems = [
    { label: 'Inicio', key: 'first', icon: 'home' },
    { label: 'Reservas', key: 'second', icon: 'calendar' },
    { label: 'lis. Inventario', key: 'third', icon: 'archive' },
    { label: 'impuntualidad', key: 'quarter', icon: 'alert' },
  ];




  // Componente para mostrar si la asistencia es puntual o impuntual
  function EstadoAsistencia({ hora }) {
    // Suponiendo formato "HH:mm"
    if (!hora) return null;
    const [h, m] = hora.split(':').map(Number);
    // 15:30 es puntual o antes
    if (h < 7 || (h === 7 && m <= 0)) {
      return <Text style={{ color: 'green', fontWeight: 'bold' }}>puntual</Text>;
    }
    return <Text style={{ color: 'red', fontWeight: 'bold' }}>impuntual</Text>;
  }



  
  // Renderizado principal
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Drawer flotante (menú lateral) */}
      <Modal
        visible={drawerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDrawerVisible(false)}
      >
        {/* Cierra el Drawer al tocar fuera */}
        <TouchableWithoutFeedback onPress={() => setDrawerVisible(false)}>
          <View style={styles.drawerOverlay} />
        </TouchableWithoutFeedback>
        {/* Contenido del Drawer */}
        <View style={styles.customDrawerContainer}>
          <Drawer.Section title="Menú">
            {drawerItems.map(item => {
              const isActive = drawerActive === item.key;
              return (
                <Drawer.Item
                  key={item.key}
                  label={item.label}
                  icon={item.icon}
                  active={isActive}
                  onPress={() => {
                    setDrawerActive(item.key);
                    setDrawerVisible(false);
                    // Navegación según el ítem seleccionado
                    if (item.key === 'quarter') {
                      navigation.navigate('Prueba');
                    }
                    if (item.key === 'first') {
                      navigation.navigate('Settings');
                    }
                  }}
                  style={isActive ? styles.drawerItemActive : styles.drawerItem}
                  labelStyle={isActive ? styles.drawerItemLabelActive : styles.drawerItemLabel}
                />
              );
            })}
          </Drawer.Section>
        </View>
      </Modal>

      {/* Barra de navegación superior */}
      <Appbar.Header style={styles.appbar}>
        <Appbar.Action
          icon={drawerVisible ? 'menu-open' : 'menu'}
          onPress={() => setDrawerVisible(true)}
          size={36}
        />
        {/* Logo centrado */}
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <Image source={logoroyal} style={styles.logoBar} resizeMode="contain" />
        </View>
        {/* Icono de usuario */}
        <IconButton icon="account-circle" size={36} onPress={() => {}} />
      </Appbar.Header>

      {/* Contenido principal de la pantalla */}
      <View style={styles.container}>
        {/* Mensaje de bienvenida */}
        <Text style={styles.title}>¡Bienvenido a S.A.M.I app {userSession.nombre}!</Text>

        {/* Botón de cámara para registrar asistencia */}
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
              size={100}
              color="#004989"
              style={{ backgroundColor: 'transparent' }}
              onPress={null}
            />
            <Text style={{ color: '#004989', fontWeight: 'bold', fontSize: 18, marginTop: 8 }}>
              Registrar asistencia
            </Text>
          </TouchableOpacity>
        </View>

        {/* Subtítulo destacado alineado a la izquierda y línea divisoria gris más larga */}
        <View style={{ marginTop: 24, marginBottom: 8, alignSelf: 'flex-start', width: '100%' }}>
          <Text
            style={{
              color: '#004989',
              fontWeight: 'bold',
              fontSize: 20,
              textAlign: 'left',
              letterSpacing: 1,
              marginLeft: 0, // Separación del borde izquierdo
            }}
          >
            Asistencias ✔
          </Text>
          {/* Línea divisoria gris  */}
          <View
            style={{
              height: 1,
              backgroundColor: '#b0b0b0', // Gris
              marginTop: 4,
              marginLeft: 0, // Alineado con el texto
              marginRight: 0,
              borderRadius: 2,
              opacity: 0.7,
              width: '100%', // Más largo
            }}
          />
        </View>


        {/* Tabla de datos con header fijo y scroll horizontal/vertical solo en el cuerpo */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title style={{ minWidth: 120 }}>Asistencia</DataTable.Title>
                <DataTable.Title style={{ minWidth: 120 }}>Documentos</DataTable.Title>
                <DataTable.Title style={{ minWidth: 120 }}>Fecha</DataTable.Title>
                <DataTable.Title style={{ minWidth: 10 }}>Hora</DataTable.Title>
              </DataTable.Header>
            </DataTable>
            <ScrollView style={{ maxHeight: 300 }} showsVerticalScrollIndicator={true}>
              <DataTable>
                {/* Renderiza las filas de asistencias */}
                {asistencias.map((asistencia, idx) => (
                  <DataTable.Row key={idx}>
                    <DataTable.Cell style={{ minWidth: 120 }}>
                      <EstadoAsistencia hora={asistencia.hora_registro} />
                    </DataTable.Cell>
                    <DataTable.Cell style={{ minWidth: 120 }}>{asistencia.documento}</DataTable.Cell>
                    <DataTable.Cell style={{ minWidth: 120 }}>{new Date(asistencia.fecha_registro).toLocaleDateString('es-ES')}</DataTable.Cell>
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