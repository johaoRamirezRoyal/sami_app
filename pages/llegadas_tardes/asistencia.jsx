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

import { styles } from '../../styles/inicio/inicioEstilo';
import BarraNav from '../../components/nav/barra_nav';
import { usePermiso } from '../../hookes/usePermiso';
import { useSesion } from '../../hookes/useSesion';
import { useAsistencias } from '../../hookes/useAsistencias';
import { BASE_URL } from '../../components/api/urlApi';

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
  const [refresh, setRefresh] = useState(false); // Refresca asistencias tras registrar
  const [selectedUsuario, setSelectedUsuario] = useState(null);

  // Hook personalizado para obtener la sesión del usuario
  const sesion = useSesion();

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

  // Efecto para buscar usuarios por nombre
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

    const delayDebounce = setTimeout(fetchUsuarios, 500); // Espera 500ms después de escribir

    return () => clearTimeout(delayDebounce);
  }, [searchText]);

  const navigation = useNavigation();

  // Obtener el idPerfil y verificar permisos con hook personalizado
  const perfil_id = sesion?.usuario?.perfil ? Number(sesion.usuario.perfil) : null;
  const opcion_permiso = 2;
  const hasPermission = usePermiso(opcion_permiso, perfil_id);

  // Obtener asistencias usando hook personalizado
  const asistencias = useAsistencias(sesion, perfil_id);

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

  // Función para agregar asistencia (actualmente solo cierra el modal)
  const handleAgregarAsistencia = () => {
    // Aquí va la lógica para agregar asistencia manual si se requiere
    setModalVisible(false);
  };

  // Función para registrar asistencia de un usuario seleccionado
  const registrarAsistencia = async (usuario) => {
    const ahora = new Date();
    const info_asistencia = {
      documento: usuario.documento,
      fecha_registro: ahora.toISOString().slice(0, 10),
      hora_registro: ahora.toTimeString().substring(0, 8),
    };
    try {
      await fetch(
        `${BASE_URL}/asistencias_estudiantes/registrarAsistencia`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(info_asistencia),
        }
      );
      alert(`Asistencia registrada para: ${usuario.nombre}`);
      setRefresh((r) => !r); // Refresca la lista de asistencias
      navigation.replace('llegadas_tarde'); // Reemplaza por el nombre de tu ruta actual
    } catch {
      alert('Error al registrar asistencia');
    }
    setModalVisible(false); // Cierra el modal después de registrar
    setConfirmVisible(false); // Cierra el aviso de confirmación
    setSelectedUsuario(null);
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
          <Text style={styles.title}>Toma de asistencias</Text>

          {/* Botón para registrar asistencia usando QR */}
          <View style={{ alignItems: 'center', marginVertical: 15 }}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Camera');
              }}
              activeOpacity={0.7}
              style={{
                backgroundColor: '#e0e7ef',
                borderRadius: 24,
                padding: 5,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IconButton
                icon="qrcode-scan"
                size={90}
                color="#004989"
                style={{ backgroundColor: 'transparent' }}
                onPress={null}
              />
              <Text style={{ color: '#004989', fontWeight: 'bold', fontSize: 18, marginTop: 0 }}>
                Registrar asistencia
              </Text>
            </TouchableOpacity>
          </View>

          {/* Botón para generar asistencia manual */}
          <View style={{ alignItems: 'center', marginBottom: 5 }}>
            <Button
              mode="contained"
              icon="account-plus"
              onPress={() => setModalVisible(true)}
              style={buttonPrimaryStyle}
              labelStyle={buttonPrimaryLabel}
              accessibilityLabel="Generar asistencia manual"
              accessibilityRole="button"
            >
              Generar asistencia
            </Button>
          </View>

          {/* Modal de asistencia manual */}
          <Portal>
            <Modal
              visible={modalVisible}
              onDismiss={() => setModalVisible(false)}
              contentContainerStyle={{
                backgroundColor: 'white',
                paddingTop: 8,
                paddingBottom: 16,
                paddingHorizontal: 32,
                margin: 20,
                borderRadius: 16,
                justifyContent: 'flex-start',
                maxWidth: 600,
                minHeight: 500,
                alignSelf: 'center',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <MaterialIcons name="person-add" size={36} color="#004989" style={{ marginRight: 8 }} />
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Agregar asistencia</Text>
              </View>

              {/* Campo de búsqueda en el Modal */}
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
                          setModalVisible(false);      // Cierra el modal de búsqueda
                          setConfirmVisible(true);     // Abre el modal de confirmación
                        }}
                      >
                        <Text style={{ fontSize: 18 }}>{usuario.nombre}   : {usuario.documento}</Text>
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

          {/* Modal de confirmación para registrar asistencia */}
          <Portal>
            <Modal
              visible={confirmVisible}
              onDismiss={() => {
                setConfirmVisible(false);
                setSelectedUsuario(null);
              }}
              contentContainerStyle={{
                backgroundColor: 'white',
                padding: 32,
                margin: 20,
                borderRadius: 16,
                alignSelf: 'center',
                maxWidth: 400, // Aumenta el ancho máximo
                minWidth: 280, // Opcional: ancho mínimo para mejor visualización
                alignItems: 'center', // Centra el contenido
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' }}>
                ¿Seguro que quieres agregar a <Text style={{ color: '#004989' }}>{selectedUsuario?.nombre}</Text> a la lista de asistencias?
              </Text>
              <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 8 }}>
                <View style={{ flex: 1, marginRight: 5 }}>
                  <Button
                    mode="contained"
                    onPress={() => {
                      if (selectedUsuario) registrarAsistencia(selectedUsuario);
                    }}
                    style={{ ...buttonPrimaryStyle, borderRadius: 20, width: '100%' }}
                    labelStyle={buttonPrimaryLabel}
                    accessibilityLabel="Confirmar registro de asistencia"
                    accessibilityRole="button"
                  >
                    Sí
                  </Button>
                </View>
                <View style={{ flex: 1, marginLeft: 5 }}>
                  <Button
                    mode="outlined"
                    onPress={() => {
                      setConfirmVisible(false);
                      setSelectedUsuario(null);
                    }}
                    style={{ borderRadius: 20, borderColor: '#004989', width: '100%' }}
                    labelStyle={{ color: '#004989', fontWeight: 'bold' }}
                    accessibilityLabel="Cancelar registro de asistencia"
                    accessibilityRole="button"
                  >
                    No
                  </Button>
                </View>
              </View>
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

          {/* Tabla de asistencias con scroll horizontal y vertical */}
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
                  {/* Renderizar cada asistencia en una fila */}
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
    </PaperProvider>
  );
}

// Comentarios agregados para cada función y bloque relevante.
// Revisa los hooks personalizados para agregar comentarios internos si lo requieres.
