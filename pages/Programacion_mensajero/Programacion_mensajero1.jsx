import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IconButton, DataTable } from 'react-native-paper';
import { ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Modal, Portal, Button, Provider as PaperProvider } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons'; // Agrega esta línea para el icono de like
import * as DocumentPicker from 'expo-document-picker'; // Para adjuntar archivos
import DateTimePicker from '@react-native-community/datetimepicker';

import { styles } from '../../styles/inicio/inicioEstilo';
import BarraNav from '../../components/nav/barra_nav';
import { usePermiso } from '../../hookes/usePermiso';
import { useSesion } from '../../hookes/useSesion';
import { useAsistencias } from '../../hookes/useAsistencias';
import { BASE_URL } from '../../components/api/urlApi';
import { Picker } from '@react-native-picker/picker'; // Agrega esto al inicio del archivo

// Componente principal para la pantalla de asistencias
export default function Inicio() {
  // Estado para controlar la carga y errores de sesión
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Estado para controlar la visibilidad de los modales
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  
  // Estado para el campo de búsqueda y lógica de agregar
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsuario, setSelectedUsuario] = useState(null);

  // Estados para el formulario del modal
  const [fecha, setFecha] = useState('');
  const [responsable, setResponsable] = useState('');
  const [descripcion, setDescripcion] = useState('');

  // Estados para el modal de aprobar tarea
  const [aprobarVisible, setAprobarVisible] = useState(false);
  const [tareaSeleccionada, setTareaSeleccionada] = useState(null);
  const [evidencia, setEvidencia] = useState('');
  const [fechaAprobacion, setFechaAprobacion] = useState('');
  const [estadoTarea, setEstadoTarea] = useState('');
  const [observacion, setObservacion] = useState('');

  // Agrega este estado junto a los otros estados
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [asistencias, setAsistencias] = useState([]); // Agrega este estado arriba

  // Hook personalizado para obtener la sesión del usuario
  const sesion = useSesion();

// Agrega este useEffect para obtener las actividades del usuario al cargar el componente o cuando cambie el usuario seleccionado
useEffect(() => {
  const fetchActividadesMensajero = async () => {
    if (!userSession?.id) return;
    try {
      const res = await fetch(`${BASE_URL}/actividades_mensajero/usuario/${userSession.id}`);
      const data = await res.json();
      setAsistencias(Array.isArray(data) ? data : []); // <-- Asegura array
    } catch (error) {
      setAsistencias([]); // <-- Siempre array
    }
  };
  fetchActividadesMensajero();
}, [userSession?.id]);






  // Efecto para manejar el tiempo de espera de la sesión
  useEffect(() => {
    let timer;
    if (!sesion || !sesion.usuario) {
      setLoading(true);
      timer = setTimeout(() => {
        setLoading(false);
        setError(true);
      }, 8000); // 8 segundos de espera antes de mostrar error
    } else {
      setLoading(false);
      setError(false);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [sesion]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      if (searchText.trim().length === 0) {
        setSearchResults([]);
        return;
      }
      try {
        const res = await fetch(`${BASE_URL}/usuarios/filtro?nombre=${searchText}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await res.json();
        setSearchResults(data);
      } catch (error) {
        setSearchResults([]);
      }
    };

    const delayDebounce = setTimeout(fetchUsuarios, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchText]);

  const navigation = useNavigation();

  // Obtener el idPerfil y verificar permisos con hook personalizado
  const perfil_id = sesion?.usuario?.perfil ? Number(sesion.usuario.perfil) : null;
  const opcion_permiso = 2;
  const hasPermission = usePermiso(opcion_permiso, perfil_id);

  // Mostrar indicador de carga mientras se obtiene la sesión
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

  // Mostrar mensaje de error si la sesión tarda demasiado
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

  // Extraer información del usuario de la sesión
  const userSession = sesion.usuario;

  // Función para adjuntar evidencia
  const handleAdjuntarEvidencia = async () => {
    const result = await DocumentPicker.getDocumentAsync({});
    if (result.type === 'success') {
      setEvidencia(result.name);
    }
  };

  // Función para abrir el modal de aprobar tarea
  const abrirModalAprobar = (tarea) => {
    setTareaSeleccionada(tarea);
    setAprobarVisible(true);
    setEvidencia('');
    setFechaAprobacion('');
    setEstadoTarea('');
    setObservacion('');
  };

  // Función para guardar la aprobación (puedes personalizarla)
  const handleAprobarTarea = () => {
    // Aquí puedes enviar los datos al backend si lo necesitas
    alert('Tarea aprobada');
    setAprobarVisible(false);
  };

  const handleAgregarAsistencia = async () => {
    if (!fecha || !responsable || !descripcion || !selectedUsuario) {
      alert('Por favor completa todos los campos y selecciona un responsable');
      return;
    }
    try {
      await registrarActividadMensajero(selectedUsuario); // <-- Cambiado aquí
      const res = await fetch(`${BASE_URL}/actividades_mensajero/${userSession.id_log}`);
      const data = await res.json();
      setAsistencias(Array.isArray(data) ? data : []);
      setModalVisible(false);
      setFecha('');
      setResponsable('');
      setDescripcion('');
      setSelectedUsuario(null);
      setSearchText('');
    } catch {
      alert('Error al registrar actividad');
    }
  };

  // Función para registrar actividad de mensajero para un usuario seleccionado
  const registrarActividadMensajero = async (usuario) => {
    const actividad = {
      id_user: usuario.id_log, // <-- ID del usuario seleccionado
      actividad: descripcion, // <-- Descripción de la tarea
      fecha_inicio: fecha,
      fecha_final: fecha, // <-- Cambia a 'fecha_final'
      observacion: descripcion, // <-- Puedes cambiar esto si tienes un campo de observación separado
      estado: "1", // <-- Estado fijo como "1" (puedes cambiarlo según lógica)
    };
    try {
      await fetch(
        `${BASE_URL}/actividades_mensajero/${usuario.id_log}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(actividad),
        }
      );
      alert(`Actividad registrada para: ${responsable}`);
      setModalVisible(false);
      setSelectedUsuario(null);
      setDescripcion('');
      setFecha('');
      setResponsable('');
    } catch {
      alert('Error al registrar actividad');
    }
  };

  // Estilos reutilizables para botones
  const buttonPrimaryStyle = { backgroundColor: '#004989', borderRadius: 24, paddingHorizontal: 16 };
  const buttonPrimaryLabel = { color: 'white', fontWeight: 'bold', fontSize: 16 };

  // Render principal de la pantalla
  return (
    <PaperProvider>
      <SafeAreaView style={styles.safeArea}>
        <BarraNav/>
        <View style={styles.container}>
          <Text style={styles.title}>Programación de tareas</Text>
          
          

          {/* Botón para generar asistencia manual */}
          <View style={{ alignItems: 'center', marginBottom: 5 }}>
            <Button mode="contained" icon="account-plus" onPress={() => setModalVisible(true)} style={buttonPrimaryStyle} labelStyle={buttonPrimaryLabel} accessibilityLabel="Generar asistencia manual" accessibilityRole="button">
              generar tarea
            </Button>
          </View>

          {/* Modal de asistencia manual */}
          <Portal>
            <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={{backgroundColor: 'white',paddingTop: 8,paddingBottom: 16,paddingHorizontal: 52,margin: 10,borderRadius: 16,justifyContent: 'flex-start',maxWidth: 600,minHeight: 600,alignSelf: 'center',}}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <MaterialIcons name="person-add" size={36} color="#004989" style={{ marginRight: 10 }} />
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Agregar mensajero</Text>
              </View>

              {/* Formulario para agregar tarea */}
              <View style={{ marginBottom: 24 }}>
                <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Fecha</Text>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  style={{
                    borderWidth: 1,
                    borderColor: '#b0b0b0',
                    borderRadius: 8,
                    padding: 8,
                    marginBottom: 4,
                    backgroundColor: '#f9f9f9'
                  }}
                >
                  <Text style={{ color: fecha ? '#222' : '#888' }}>{fecha ? fecha : 'Selecciona la fecha'}</Text>
                </TouchableOpacity>{showDatePicker && ( <DateTimePicker
                    value={fecha ? new Date(fecha) : new Date()}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(false);
                      if (selectedDate) {
                        const iso = selectedDate.toISOString().slice(0, 10);
                        setFecha(iso);
                      }
                    }}
                  />
                )}
                <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Responsable</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, width: '100%' }}>
                  <View style={{ flex: 1, position: 'relative' }}>
                    <TextInput
                      placeholder="Buscar"
                      value={searchText}
                      onChangeText={setSearchText}
                      style={{
                        borderWidth: 1,
                        borderColor: '#b0b0b0',
                        borderRadius: 8,
                        padding: 10,
                        fontSize: 16,
                        backgroundColor: '#f5f5f5',
                        paddingRight: 40,
                      }}
                    />
                    <MaterialIcons
                      name="search"
                      size={28}
                      color="#004989"
                      style={{
                        position: 'absolute',
                        right: 10,
                        top: '50%',
                        transform: [{ translateY: -14 }],
                      }}
                    />
                  </View>
                </View>

                {/* Resultados de búsqueda */}
                {searchResults.length > 0 ? (
                  <View style={{ maxHeight: 300, marginBottom: 8 }}>
                    <ScrollView>
                      {searchResults.map((usuario, idx) => (
                        <TouchableOpacity
                          key={idx}
                          style={{ padding: 12, borderBottomWidth: 1, borderColor: '#eee' }}
                          onPress={() => {
                            setSelectedUsuario(usuario);
                            setResponsable(usuario.nombre); // Asigna el nombre al campo responsable
                            setSearchText(usuario.nombre);  // Muestra el nombre en el input
                            setSearchResults([]);           // Limpia resultados
                          }}
                        >
                          <Text style={{ fontSize: 18 }}>{usuario.nombre} : {usuario.documento}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                ) : (
                  searchText.trim().length > 0 && (
                    <View style={{ marginBottom: 8, alignItems: 'center' }}>
                      <Text style={{ fontSize: 16, color: '#888' }}>
                        Sin coincidencias encontradas
                      </Text>
                    </View>
                  )
                )}

                <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Descripción</Text>
                <TextInput
                  placeholder="Descripción de la tarea"
                  multiline
                  numberOfLines={3}
                  style={{
                    borderWidth: 1,
                    borderColor: '#b0b0b0',
                    borderRadius: 8,
                    padding: 10, // Cambiado de 50 a 10
                    marginBottom: 10,
                  }}
                  value={descripcion}
                  onChangeText={setDescripcion}
                />

                <Button
                  mode="contained"
                  onPress={handleAgregarAsistencia}
                  style={{ ...buttonPrimaryStyle, borderRadius: 20, marginTop: 8 }}
                  labelStyle={{ ...buttonPrimaryLabel, fontSize: 15 }}
                  accessibilityLabel="Agregar tarea"
                  accessibilityRole="button"
                >
                  Guardar
                </Button>
              </View>

              {/* Botón para cerrar el modal */}
              <View style={{
                position: 'absolute',
                bottom: 16,
                right: 32,
                flexDirection: 'row',
                justifyContent: 'flex-end',
              }}>
                <Button
                  mode="contained"
                  onPress={() => setModalVisible(false)}
                  style={{ ...buttonPrimaryStyle, borderRadius: 20 }}
                  labelStyle={{ ...buttonPrimaryLabel, fontSize: 15 }}
                  accessibilityLabel="Cerrar modal de asistencia"
                  accessibilityRole="button"
                >
                  Cerrar
                </Button>
              </View>
            </Modal>
          </Portal>

          {/* Modal de aprobar tarea */}
          <Portal>
            <Modal
              visible={aprobarVisible}
              onDismiss={() => setAprobarVisible(false)}
              contentContainerStyle={{
                backgroundColor: 'white',
                padding: 24,
                margin: 20,
                borderRadius: 16,
                alignSelf: 'center',
                maxWidth: 700,
                minWidth: 280,
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16, color: '#004989' }}>
                Aprobar tarea
              </Text>
              <Button
                mode="outlined"
                icon="attachment"
                onPress={handleAdjuntarEvidencia}
                style={{ marginBottom: 1, borderColor: '#004989', backgroundColor: '#e3f0fa' }} // Color de fondo suave
                labelStyle={{ color: '#004989', fontWeight: 'bold' }} // Solo el texto en azul
              >
                Adjuntar evidencia
              </Button>
              <Text style={{ marginBottom: 8 }}>{evidencia ? `Archivo: ${evidencia}` : ''}</Text>
              <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Fecha</Text>
              <View style={{ marginBottom: 12 }}>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  style={{
                    borderWidth: 1,
                    borderColor: '#b0b0b0',
                    borderRadius: 8,
                    padding: 8,
                    marginBottom: 4,
                    backgroundColor: '#f9f9f9'
                  }}
                >
                  <Text style={{ color: fechaAprobacion ? '#222' : '#888' }}>
                    {fechaAprobacion ? fechaAprobacion : 'Selecciona la fecha'}
                  </Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={fechaAprobacion ? new Date(fechaAprobacion) : new Date()}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(false);
                      if (selectedDate) {
                        const iso = selectedDate.toISOString().slice(0, 10);
                        setFechaAprobacion(iso);
                      }
                    }}
                  />
                )}
              </View>
              <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Estado</Text>
              <View style={{ borderWidth: 1, borderColor: '#b0b0b0', borderRadius: 8, marginBottom: 12 }}>
                <Picker
                  selectedValue={estadoTarea}
                  onValueChange={(itemValue) => setEstadoTarea(itemValue)}
                  style={{ height: 50 }}
                >
                  <Picker.Item label="Selecciona estado" value="" />
                  <Picker.Item label="Completado" value="1" />
                  <Picker.Item label="Pendiente" value="0" />
                  <Picker.Item label="Cancelado" value="2" />
                </Picker>
              </View>
              <TextInput
                placeholder="Observación"
                multiline
                numberOfLines={3}
                style={{ borderWidth: 1, borderColor: '#b0b0b0', borderRadius: 8, padding: 30, marginBottom: 20 }}
                value={observacion}
                onChangeText={setObservacion}
              />
              <Button
                mode="contained"
                onPress={handleAprobarTarea}
                style={{ ...buttonPrimaryStyle, borderRadius: 20, marginTop: 8 }}
                labelStyle={buttonPrimaryLabel}
              >
                Guardar
              </Button>
            </Modal>
          </Portal>

          {/* Título y línea divisoria para la sección de llegadas tardes */}
          <View style={{ marginTop: 5, marginBottom: 8, alignSelf: 'flex-start', width: '100%' }}>
            <Text
              style={{
                color: '#004989',
                fontWeight: 'bold',
                fontSize: 20,
                textAlign: 'left',
                letterSpacing: 1,
              }}
            >
              Tareas
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

          {/* Tabla de tareas con scroll horizontal y vertical */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View>
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title style={{ minWidth: 120 }}>Actividad</DataTable.Title>
                  <DataTable.Title style={{ minWidth: 120 }}>Fecha de inicio</DataTable.Title>
                  <DataTable.Title style={{ minWidth: 120 }}>Fecha de fin</DataTable.Title>
                  <DataTable.Title style={{ minWidth: 120 }}>Evidencia</DataTable.Title>
                  <DataTable.Title style={{ minWidth: 130 }}>Observación</DataTable.Title>
                  <DataTable.Title style={{ minWidth: 100 }}>Estado</DataTable.Title>
                </DataTable.Header>
              </DataTable>
              <ScrollView style={{ maxHeight: 300 }} showsVerticalScrollIndicator={true}>
                <DataTable>
                  
                  {/* Renderizar cada asistencia en una fila */}
                  {asistencias.map((tarea, idx) => (
                    <DataTable.Row key={idx}>
                      <DataTable.Cell style={{ flex: 2 }}>{tarea.descripcion || '-'}</DataTable.Cell>
                      <DataTable.Cell style={{ flex: 1 }}>{tarea.fecha_inicio ? new Date(tarea.fecha_inicio).toLocaleDateString('es-ES') : '-'}</DataTable.Cell>
                      <DataTable.Cell style={{ flex: 1 }}>{tarea.fecha_fin ? new Date(tarea.fecha_fin).toLocaleDateString('es-ES') : '-'}</DataTable.Cell>
                      <DataTable.Cell style={{ flex: 1 }}>{tarea.evidencia || '-'}</DataTable.Cell>
                      <DataTable.Cell style={{ flex: 2 }}>{tarea.observacion || '-'}</DataTable.Cell>
                      <DataTable.Cell style={{ flex: 1 }}>{tarea.estado || '-'}</DataTable.Cell>
                      <DataTable.Cell style={{ flex: 0.7 }}>
                        <TouchableOpacity onPress={() => abrirModalAprobar(tarea)}>
                          <AntDesign name="check" size={24} color="#004989" />
                        </TouchableOpacity>
                      </DataTable.Cell>
                    </DataTable.Row>
                  ))}
                </DataTable>
              </ScrollView>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </PaperProvider>
  );
}

// Comentarios agregados para cada función y bloque relevante.
// Revisa los hooks personalizados para agregar comentarios internos si lo requieres.

