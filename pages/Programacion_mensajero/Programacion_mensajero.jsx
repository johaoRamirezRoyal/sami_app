import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DataTable, ActivityIndicator, Modal, Portal, Button, Provider as PaperProvider } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { Buffer } from 'buffer';

import { stylespm } from '../../styles/pm/stylespm';
import { styles } from '../../styles/inicio/inicioEstilo';
import BarraNav from '../../components/nav/barra_nav';
import { usePermiso } from '../../hookes/usePermiso';
import { useSesion } from '../../hookes/useSesion';
import { useActividades } from '../../hookes/useActibvidades';
import { BASE_URL } from '../../components/api/urlApi';

// ==========================
// Componente principal
// ==========================
export default function ProgramacionMensajero() {
  // --------------------------
  // Estados globales
  // --------------------------
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // --------------------------
  // Estados para modales y formularios
  // --------------------------
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [actividadInput, setActividadInput] = useState('');
  const [observacionInput, setObservacionInput] = useState('');
  const [fechaActividad, setFechaActividad] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [searchActive, setSearchActive] = useState(true);

  // --------------------------
  // Estados para aprobar tarea
  // --------------------------
  const [aprobarVisible, setAprobarVisible] = useState(false);
  const [selectedActividad, setSelectedActividad] = useState(null);
  const [evidencia, setEvidencia] = useState('');
  const [evidenciaNombre, setEvidenciaNombre] = useState('');
  const [fechaAprobacion, setFechaAprobacion] = useState('');
  const [estadoTarea, setEstadoTarea] = useState('');
  const [observacion, setObservacion] = useState('');

  // --------------------------
  // Otros estados
  // --------------------------
  const [reloadActividades, setReloadActividades] = useState(false);
  const [verEvidenciaVisible, setVerEvidenciaVisible] = useState(false);
  const [imagenEvidencia, setImagenEvidencia] = useState(null);

  // --------------------------
  // Hooks personalizados
  // --------------------------
  const sesion = useSesion();
  const navigation = useNavigation();
  const perfil_id = sesion?.usuario?.perfil ? Number(sesion.usuario.perfil) : null;
  const hasPermission = usePermiso(2, perfil_id);
  const actividadesRaw = useActividades(sesion, perfil_id, reloadActividades);

  // ==========================
  // Efectos
  // ==========================

  // Maneja la carga de sesión
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

  // Busca usuarios por nombre
  useEffect(() => {
    if (searchText.trim().length === 0) {
      setSearchResults([]);
      setSearchActive(true);
      return;
    }
    const fetchUsuarios = async () => {
      try {
        const res = await fetch(`${BASE_URL}/usuarios/filtro?nombre=${searchText}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await res.json();
        setSearchResults(data);
        setSearchActive(true);
      } catch {
        setSearchResults([]);
        setSearchActive(true);
      }
    };
    const delayDebounce = setTimeout(fetchUsuarios, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchText]);

  // ==========================
  // Funciones principales
  // ==========================

  // Registra una nueva actividad
  const registrarActividad = async () => {
    if (!selectedUsuario || !actividadInput || !observacionInput || !fechaActividad) {
      alert('Completa todos los campos');
      return;
    }
    const info_actividad = {
      id_user: selectedUsuario.id_user,
      actividad: actividadInput,
      observacion: observacionInput,
      fecha_inicio: fechaActividad.toISOString().slice(0, 10),
      fecha_final: fechaActividad.toISOString().slice(0, 10),
      estado: 1,
    };
    try {
      const response = await fetch(`${BASE_URL}/actividades_mensajero/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(info_actividad),
      });
      const result = await response.json();
      if (response.ok) {
        Alert.alert(
          'Éxito',
          `Actividad registrada para: ${selectedUsuario.nombre}`,
          [
            {
              text: 'OK',
              onPress: () => {
                setModalVisible(false);
                setSelectedUsuario(null);
                setActividadInput('');
                setObservacionInput('');
                setFechaActividad(new Date());
                setReloadActividades(prev => !prev);
              },
            },
          ],
          { cancelable: false }
        );
      } else {
        alert('Error al registrar actividad');
      }
    } catch (error) {
      alert('Error al registrar actividad');
    }
  };

  // Adjunta evidencia (imagen) y la convierte a base64
  const handleAdjuntarEvidencia = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permiso denegado para acceder a las imágenes');
      return;
    }
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
      base64: true,
    });
    if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
      const asset = pickerResult.assets[0];
      setEvidencia(asset.base64);
      const uri = asset.uri;
      const nombreArchivo = uri.split('/').pop();
      setEvidenciaNombre(nombreArchivo);
    }
  };

  // Envía la evidencia al backend
  const handleAprobarTarea = async () => {
    if (!evidencia) {
      alert('Debes adjuntar una imagen como evidencia.');
      return;
    }
    let mimeType = 'image/jpeg';
    if (evidenciaNombre.endsWith('.png')) mimeType = 'image/png';
    else if (evidenciaNombre.endsWith('.jpg') || evidenciaNombre.endsWith('.jpeg')) mimeType = 'image/jpeg';
    const evidenciaBase64 = evidencia ? `data:${mimeType};base64,${evidencia}` : '';
    try {
      const response = await fetch(`${BASE_URL}/actividades_mensajero/evidencia`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedActividad?.id,
          evidencia: evidenciaBase64,
        }),
      });
      let resultText = await response.text();
      let result;
      try {
        result = JSON.parse(resultText);
      } catch {
        result = resultText;
      }
      if (response.ok) {
        alert('Evidencia enviada correctamente');
        setAprobarVisible(false);
        setEvidencia('');
        setEvidenciaNombre('');
        setFechaAprobacion('');
        setEstadoTarea('');
        setObservacion('');
      } else {
        alert('Error al enviar la evidencia: ' + (result?.message || result));
      }
    } catch (error) {
      alert('Error de red al enviar la evidencia');
    }
  };

  // Actualiza la actividad seleccionada
  const handleActualizarActividad = async () => {
    if (!selectedActividad?.id) return;
    let fechaInicio = selectedActividad.fecha_inicio;
    if (fechaInicio && fechaInicio.length > 10) {
      fechaInicio = new Date(fechaInicio).toISOString().slice(0, 10);
    }
    let fechaFinalISO = fechaAprobacion;
    if (fechaAprobacion && fechaAprobacion.length === 10) {
      fechaFinalISO = fechaAprobacion;
    } else if (fechaAprobacion) {
      fechaFinalISO = new Date(fechaAprobacion).toISOString().slice(0, 10);
    }
    const payload = {
      id: selectedActividad.id,
      id_user: selectedActividad.id_user,
      actividad: selectedActividad.actividad,
      fecha_inicio: fechaInicio,
      fecha_final: fechaFinalISO,
      observacion: observacion,
      estado: Number(estadoTarea),
      evidencia: evidencia ? `data:image/jpeg;base64,${evidencia}` : '',
      hora_inicio: selectedActividad.hora_inicio || '',
      hora_final: selectedActividad.hora_final || '',
    };
    try {
      const response = await fetch(`${BASE_URL}/actividades_mensajero/actualizar/${selectedActividad.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (response.ok) {
        alert('Actividad actualizada correctamente');
        setAprobarVisible(false);
        setEvidencia('');
        setEvidenciaNombre('');
        setFechaAprobacion('');
        setEstadoTarea('');
        setObservacion('');
      } else {
        alert('Error al actualizar actividad');
      }
    } catch (error) {
      alert('Error de red al actualizar actividad');
    }
  };

  // ==========================
  // Renderizado principal
  // ==========================
  if (loading) {
    return (
      <SafeAreaView style={stylespm.safeArea}>
        <View style={stylespm.container}>
          <ActivityIndicator size="large" color="#004989" style={{ marginBottom: 20 }} />
          <Text style={stylespm.title}>Cargando sesión...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={stylespm.safeArea}>
        <View style={stylespm.container}>
          <Text style={{ color: 'red', marginTop: 20, fontWeight: 'bold' }}>
            Error: La sesión está tardando demasiado en cargar. Por favor, verifica tu conexión o intenta nuevamente.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // ==========================
  // UI
  // ==========================
  return (
    <PaperProvider>
      <SafeAreaView style={styles.safeArea}>
        <BarraNav />
        <View style={styles.container}>
          {/* Título principal */}
          <Text style={styles.title}>Toma de asistencias</Text>

          {/* Botón para agregar actividad */}
          <View style={{ alignItems: 'center', marginBottom: 5 }}>
            <Button
              mode="contained"
              icon="plus"
              onPress={() => setModalVisible(true)}
              style={{ backgroundColor: '#004989', borderRadius: 24, paddingHorizontal: 16 }}
              labelStyle={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}
            >
              Agregar actividad
            </Button>
          </View>

          {/* Modal para agregar actividad */}
          <Portal>
            <Modal
              visible={modalVisible}
              onDismiss={() => setModalVisible(false)}
              contentContainerStyle={stylespm.modalContainer}
            >
              {/* Título del modal */}
              <View style={stylespm.modalTitleRow}>
                <MaterialIcons name="event" size={36} color="#004989" style={{ marginRight: 8 }} />
                <Text style={stylespm.modalTitle}>Agregar actividad</Text>
              </View>

              {/* Campo de búsqueda de usuario */}
              <View style={stylespm.searchRow}>
                <View style={stylespm.searchInputInner}>
                  <Text style={stylespm.searchLabel}>Búsqueda</Text>
                  <View>
                    <TextInput
                      placeholder="Buscar usuario"
                      value={searchText}
                      onChangeText={text => {
                        setSearchText(text);
                        setSearchActive(true);
                      }}
                      style={stylespm.searchInputBox}
                    />
                    <MaterialIcons
                      name="search"
                      size={28}
                      color="#004989"
                      style={stylespm.searchIcon}
                      pointerEvents="none"
                    />
                  </View>
                </View>
              </View>

              {/* Resultados de búsqueda */}
              {searchResults.length > 0 && searchActive ? (
                <View style={stylespm.searchResults}>
                  <ScrollView>
                    {searchResults.map((usuario, idx) => (
                      <TouchableOpacity
                        key={idx}
                        style={stylespm.searchResultItem}
                        onPress={() => {
                          setSelectedUsuario(usuario);
                          setSearchText(usuario.nombre);
                          setSearchResults([]);
                          setSearchActive(false);
                        }}
                      >
                        <Text style={stylespm.searchResultText}>{usuario.nombre} : {usuario.documento}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              ) : (
                searchText.trim().length > 0 && searchActive && (
                  <View style={stylespm.noResults}>
                    <Text style={stylespm.noResultsText}>
                      Sin coincidencias encontradas
                    </Text>
                  </View>
                )
              )}

              {/* Input de actividad */}
              <Text style={stylespm.actividadLabel}>Actividad</Text>
              <TextInput
                placeholder="Agregar actividad"
                value={actividadInput}
                onChangeText={setActividadInput}
                style={stylespm.actividadInput}
              />

              {/* Input de observación */}
              <Text style={stylespm.observacionLabel}>Observación</Text>
              <TextInput
                placeholder="Agregar observación"
                value={observacionInput}
                onChangeText={setObservacionInput}
                multiline
                numberOfLines={4}
                style={stylespm.observacionInput}
              />

              {/* Selección de fecha */}
              <Text style={stylespm.fechaLabel}>Fecha</Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                style={stylespm.fechaButton}
              >
                <Text style={stylespm.fechaText}>
                  Fecha: {fechaActividad.toISOString().slice(0, 10)}
                </Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={fechaActividad}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate) setFechaActividad(selectedDate);
                  }}
                />
              )}

              {/* Botón para agregar actividad */}
              <Button
                mode="contained"
                onPress={registrarActividad}
                style={[stylespm.buttonPrimary, stylespm.aprobarGuardarButton, { marginTop: 8 }]}
                labelStyle={[stylespm.buttonPrimaryLabel, { fontSize: 15 }]}
              >
                Agregar
              </Button>

              {/* Botón para cerrar el modal */}
              <View style={stylespm.aprobarActionRow}>
                <Button
                  mode="contained"
                  onPress={() => setModalVisible(false)}
                  style={[stylespm.buttonPrimary, stylespm.aprobarCerrarButton]}
                  labelStyle={[stylespm.buttonPrimaryLabel, { fontSize: 15 }]}
                >
                  Cerrar
                </Button>
              </View>
            </Modal>
          </Portal>

          {/* Sección de actividades */}
          <View style={stylespm.actividadesSection}>
            <Text style={stylespm.actividadesTitle}>
              Llegadas tardes
            </Text>
            <View style={stylespm.actividadesDivider} />
          </View>

          {/* Tabla de actividades */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View>
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title style={{ minWidth: 80 }}><Text>ID Usuario</Text></DataTable.Title>
                  <DataTable.Title style={{ minWidth: 120 }}><Text>Actividad</Text></DataTable.Title>
                  <DataTable.Title style={{ minWidth: 120 }}><Text>Fecha Inicio</Text></DataTable.Title>
                  <DataTable.Title style={{ minWidth: 120 }}><Text>Fecha Final</Text></DataTable.Title>
                  <DataTable.Title style={{ minWidth: 200 }}><Text>Observación</Text></DataTable.Title>
                  <DataTable.Title style={{ minWidth: 80 }}><Text>Estado</Text></DataTable.Title>
                  <DataTable.Title style={{ minWidth: 100 }}></DataTable.Title>
                </DataTable.Header>
              </DataTable>
              <ScrollView style={stylespm.tableScroll} showsVerticalScrollIndicator={true}>
                <DataTable>
                  {(Array.isArray(actividadesRaw?.data) ? actividadesRaw.data : []).map((actividad, idx) => (
                    <DataTable.Row key={idx}>
                      <DataTable.Cell style={{ minWidth: 80 }}><Text>{actividad.id_user}</Text></DataTable.Cell>
                      <DataTable.Cell style={{ minWidth: 120 }}><Text>{actividad.actividad}</Text></DataTable.Cell>
                      <DataTable.Cell style={{ minWidth: 120 }}>
                        <Text>{actividad.fecha_inicio ? actividad.fecha_inicio.slice(0, 10) : ''}</Text>
                      </DataTable.Cell>
                      <DataTable.Cell style={{ minWidth: 120 }}>
                        <Text>{actividad.fecha_final ? actividad.fecha_final.slice(0, 10) : ''}</Text>
                      </DataTable.Cell>
                      <DataTable.Cell style={{ minWidth: 200 }}><Text>{actividad.observacion}</Text></DataTable.Cell>
                      <DataTable.Cell style={{ minWidth: 80 }}>
                        <Text>
                          {(actividad.estado === 1 || actividad.estado === "1") && (
                            <Text style={{ color: '#007bff', fontWeight: 'bold' }}>Pendiente</Text>
                          )}
                          {(actividad.estado === 0 || actividad.estado === "0") && (
                            <Text style={{ color: '#dc3545', fontWeight: 'bold' }}>Cancelado</Text>
                          )}
                          {(actividad.estado === 2 || actividad.estado === "2") && (
                            <Text style={{ color: '#28a745', fontWeight: 'bold' }}>Completado</Text>
                          )}
                          {[0, 1, 2, "0", "1", "2"].indexOf(actividad.estado) === -1 && actividad.estado}
                        </Text>
                      </DataTable.Cell>
                      <DataTable.Cell style={{ minWidth: 100 }}>
                        <Button
                          mode="contained"
                          compact
                          onPress={() => {
                            setSelectedActividad(actividad);
                            setAprobarVisible(true);
                          }}
                          style={stylespm.tableButton}
                          labelStyle={stylespm.tableButtonLabel}
                        >
                          <Text>Ver</Text>
                        </Button>
                        {/* Botón "Ver evidencia" mejorado */}
                        {actividad.evidencia && actividad.evidencia !== '' && (
                          <Button
                            mode="contained"
                            compact
                            onPress={() => {
                              try {
                                let evidenciaData = actividad.evidencia;
                                // Si es un objeto tipo Buffer
                                if (typeof evidenciaData === 'object' && evidenciaData.data) {
                                  const base64String = Buffer.from(evidenciaData.data).toString('base64');
                                  evidenciaData = `data:image/jpeg;base64,${base64String}`;
                                }
                                // Si es un string base64 sin encabezado
                                else if (typeof evidenciaData === 'string' && !evidenciaData.startsWith('data:image')) {
                                  evidenciaData = `data:image/jpeg;base64,${evidenciaData}`;
                                }
                                // Si no hay evidencia válida
                                else if (!evidenciaData) {
                                  Alert.alert('Sin evidencia', 'Esta actividad no tiene evidencia asociada.');
                                  return;
                                }
                                setImagenEvidencia(evidenciaData);
                                setVerEvidenciaVisible(true);
                              } catch (error) {
                                console.error('Error al mostrar evidencia:', error);
                                Alert.alert('Error', 'No se pudo mostrar la evidencia.');
                              }
                            }}
                            style={{ backgroundColor: '#4cf370ff', marginTop: 3 }}
                            labelStyle={{ color: '#ffffffff', fontWeight: 'bold' }}
                          >
                            Ver
                          </Button>
                        )}
                      </DataTable.Cell>
                    </DataTable.Row>
                  ))}
                </DataTable>
              </ScrollView>
            </View>
          </ScrollView>

          {/* Modal para aprobar tarea */}
          <Portal>
            <Modal
              visible={aprobarVisible}
              onDismiss={() => setAprobarVisible(false)}
              contentContainerStyle={stylespm.aprobarModal}
            >
              <Text style={stylespm.aprobarTitle}>
                Aprobar tarea
              </Text>

              {/* Datos de la actividad seleccionada */}
              {selectedActividad && (
                <View style={stylespm.aprobarActividadInfo}>
                  <Text><Text style={{ fontWeight: 'bold' }}>ID:</Text> {selectedActividad.id}</Text>
                  <Text><Text style={{ fontWeight: 'bold' }}>Actividad:</Text> {selectedActividad.actividad}</Text>
                  <Text><Text style={{ fontWeight: 'bold' }}>Fecha inicio:</Text> {selectedActividad.fecha_inicio?.slice(0,10)}</Text>
                </View>
              )}

              {/* Sección de evidencia */}
              <View style={stylespm.aprobarActividadInfo}>
                <Text style={stylespm.aprobarEvidenciaLabel}>Evidencia</Text>
                <Button
                  mode="outlined"
                  icon="attachment"
                  onPress={handleAdjuntarEvidencia}
                  style={stylespm.aprobarEvidenciaButton}
                  labelStyle={stylespm.aprobarEvidenciaButtonLabel}
                >
                  Adjuntar evidencia
                </Button>
                {evidenciaNombre ? (
                  <View style={stylespm.aprobarEvidenciaFile}>
                    <MaterialIcons name="insert-drive-file" size={20} color="#004989" />
                    <Text style={stylespm.aprobarEvidenciaFileText}>{evidenciaNombre}</Text>
                  </View>
                ) : (
                  <Text style={stylespm.aprobarEvidenciaNone}>No se ha adjuntado evidencia</Text>
                )}
              </View>

              {/* Sección de fecha de aprobación */}
              <View style={stylespm.aprobarActividadInfo}>
                <Text style={stylespm.aprobarFechaLabel}>Fecha de aprobación</Text>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  style={stylespm.aprobarFechaButton}
                >
                  <Text style={stylespm.aprobarFechaText}>
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
              {/* Validación de campos */}
              {(estadoTarea === '' || fechaAprobacion === '') && (
                <Text style={stylespm.aprobarError}>
                  Por favor selecciona estado y fecha.
                </Text>
              )}
              {/* Sección de estado */}
              <View style={stylespm.aprobarActividadInfo}>
                <Text style={stylespm.aprobarEstadoLabel}>Estado</Text>
                <View style={stylespm.aprobarEstadoPicker}>
                  <Picker
                    selectedValue={estadoTarea}
                    onValueChange={(itemValue) => setEstadoTarea(itemValue)}
                    style={{ height: 50 }}
                  >
                    <Picker.Item label="Selecciona estado" value="" />
                    <Picker.Item label="Completado" value="2" />
                    <Picker.Item label="Pendiente" value="1" />
                    <Picker.Item label="Cancelado" value="0" />
                  </Picker>
                </View>
              </View>

              {/* Observación */}
              <View style={stylespm.aprobarActividadInfo}>
                <Text style={stylespm.aprobarObservacionLabel}>Observación</Text>
                <TextInput
                  placeholder="Observación"
                  multiline
                  numberOfLines={3}
                  style={stylespm.aprobarObservacionInput}
                  value={observacion}
                  onChangeText={setObservacion}
                />
              </View>
              {/* Botones de acción */}
              <View style={stylespm.aprobarActionRow}>
                <Button
                  mode="contained"
                  onPress={async () => {
                    if (!evidencia) {
                      alert('Debes adjuntar una imagen como evidencia.');
                      return;
                    }
                    await handleAprobarTarea();
                    await handleActualizarActividad();
                    setReloadActividades(prev => !prev); // <-- Fuerza recarga de la tabla
                  }}
                  disabled={estadoTarea === '' || fechaAprobacion === ''}
                  style={[stylespm.buttonPrimary, stylespm.aprobarGuardarButton]}
                  labelStyle={stylespm.buttonPrimaryLabel}
                >
                  Guardar
                </Button>
                <Button
                  mode="outlined"
                  onPress={() => setAprobarVisible(false)}
                  style={stylespm.aprobarCerrarButton}
                  labelStyle={stylespm.aprobarEvidenciaButtonLabel}
                >
                  Cerrar
                </Button>
              </View>
            </Modal>
          </Portal>

          {/* 🔍 Modal para ver evidencia */}
          <Portal>
            <Modal
              visible={verEvidenciaVisible}
              onDismiss={() => setVerEvidenciaVisible(false)}
              contentContainerStyle={{
                backgroundColor: 'white',
                padding: 20,
                marginHorizontal: 20,
                borderRadius: 12,
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Evidencia</Text>
              {imagenEvidencia ? (
                <Image
                  source={{ uri: imagenEvidencia }}
                  style={{ width: 300, height: 300, borderRadius: 8 }}
                  resizeMode="contain"
                />
              ) : (
                <Text style={{ color: 'gray' }}>No hay imagen disponible</Text>
              )}
              <Button
                mode="contained"
                onPress={() => setVerEvidenciaVisible(false)}
                style={{ marginTop: 20, backgroundColor: '#004989' }}
                labelStyle={{ color: 'white' }}
              >
                Cerrar
              </Button>
            </Modal>
          </Portal>
        </View>
      </SafeAreaView>
    </PaperProvider>
  );
}