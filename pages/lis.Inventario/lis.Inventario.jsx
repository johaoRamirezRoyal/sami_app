// ==============================
// 1. IMPORTACIONES PRINCIPALES
// ==============================
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { DataTable, IconButton, Portal, Dialog } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../../styles/inicio/inicioEstilo';
import { stylesLis } from '../../styles/lis.inventario/styleslis';

import BarraNav from '../../components/nav/barra_nav';
import { useSesion } from '../../hookes/useSesion';
import { BASE_URL } from '../../components/api/urlApi';

// ==============================
// 2. COMPONENTE PRINCIPAL
// ==============================
export default function Inicio() {
  // ------------------------------
  // 2.1. ESTADOS PARA MODAL REPORTE
  // ------------------------------
  const [modalVisible, setModalVisible] = useState(false); // Controla la visibilidad del modal de reporte
  const [reportItem, setReportItem] = useState(null);      // Artículo seleccionado para reportar
  const [reportText, setReportText] = useState('');        // Texto del reporte
  const [reportLoading, setReportLoading] = useState(false); // Estado de carga al enviar reporte

  // ------------------------------
  // 2.2. ESTADOS DE SESIÓN Y NAVEGACIÓN
  // ------------------------------
  const [loading, setLoading] = useState(true); // Estado de carga de la sesión
  const [error, setError] = useState(false);    // Estado de error de sesión
  const sesion = useSesion();                   // Hook personalizado para obtener sesión
  const navigation = useNavigation();           // Hook de navegación

  // ------------------------------
  // 2.3. ESTADOS DE INVENTARIO Y PAGINACIÓN
  // ------------------------------
  const [inventory, setInventory] = useState([]); // Inventario paginado (para mostrar en la tabla)
  const [search, setSearch] = useState('');       // Texto de búsqueda
  const [showSuggestions, setShowSuggestions] = useState(false); // Controla visibilidad de sugerencias
  const [page, setPage] = useState(1);            // Página actual (1-index)
  const [limit, setLimit] = useState(5);          // Cantidad de artículos por página
  const [total, setTotal] = useState(0);          // Total de artículos
  const [totalPages, setTotalPages] = useState(1);// Total de páginas
  const [loadingInventory, setLoadingInventory] = useState(false); // Estado de carga del inventario
  const [reload, setReload] = useState(false);    // Para forzar recarga del inventario
  const [allInventory, setAllInventory] = useState([]); // Inventario completo (para búsqueda global)

  // ==============================
  // 3. EFECTOS Y FUNCIONES
  // ==============================

  // 3.1. Validar sesión del usuario
  useEffect(() => {
    let timer;
    if (!sesion || !sesion.usuario) {
      setLoading(true);
      timer = setTimeout(() => {
        setLoading(false);
        setError(true);
      }, 8000); // Espera 8 segundos antes de mostrar error
    } else {
      setLoading(false);
      setError(false);
    }
    return () => timer && clearTimeout(timer);
  }, [sesion]);

  const userSession = sesion?.usuario;
  if (userSession) {
    console.log('userSession:', userSession);
  }

  // 3.4. Obtener inventario desde el backend (paginado)
  useEffect(() => {
    if (loading || !userSession) return;

    setLoadingInventory(true);
    const url = `${BASE_URL}/inventario/usuario/${userSession?.id_log}?page=${page}&limit=${limit}`;
    console.log('Inventario fetch URL:', url); // <-- Agregado para debug
    fetch(url)
      .then(response => response.json())
      .then((data) => {
        setInventory(Array.isArray(data.data) ? data.data : []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPage || 1);
      })
      .catch(error => {
        alert('Error al obtener inventario: ' + error.message);
      })
      .finally(() => setLoadingInventory(false));
  }, [page, limit, userSession, loading, reload]);

  // 3.4.1. Obtener TODO el inventario para búsqueda global (solo una vez)
  useEffect(() => {
    if (!userSession) return;
    fetch(`${BASE_URL}/inventario/usuario/${userSession?.id_log}}`)
      .then(response => response.json())
      .then((data) => {
        setAllInventory(Array.isArray(data.data) ? data.data : []);
      })
      .catch(() => setAllInventory([]));
  }, [userSession, reload]);

  // 3.2. Filtrar inventario localmente (sobre todo el inventario si hay búsqueda)
  // Si hay búsqueda, filtra sobre todo el inventario; si no, muestra la página actual
  const filteredInventory = search.trim() === ''
    ? inventory
    : allInventory.filter(item => (item.descripcion ?? '').toLowerCase().includes(search.toLowerCase()));

  // 3.3. La tabla muestra los resultados filtrados (paginados solo si no hay búsqueda)
  // Si hay búsqueda, muestra solo los primeros "limit" resultados encontrados
  const paginatedInventory = search.trim() === ''
    ? inventory
    : filteredInventory.slice(0, limit);

  // 3.5. Cambiar límite de artículos por página
  // Valida y ajusta el límite de artículos por página
  const handleLimitChange = (text) => {
    let value = parseInt(text.replace(/[^0-9]/g, ''));
    if (isNaN(value) || value < 1) value = 1;
    if (value > 100) value = 100;
    setLimit(value);
    setPage(1); // Reinicia a la primera página
  };

  // ==============================
  // 4. RENDER DE PANTALLAS DE CARGA Y ERROR
  // ==============================
  if (loading) {
    // Muestra indicador de carga mientras se valida la sesión
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
    // Muestra mensaje de error si la sesión tarda demasiado
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

  // ==============================
  // 5. RENDER PRINCIPAL
  // ==============================
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Barra de navegación superior */}
      <BarraNav />

      <View style={styles.container}>
        {/* Modal para reportar artículo */}
        <Portal>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1, justifyContent: 'center' }}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 1 : 0}
          >
            <Dialog visible={modalVisible} onDismiss={() => setModalVisible(false)} style={{ backgroundColor: '#ffffff', borderRadius: 12 }}>
              <Dialog.Title>Reportar artículo</Dialog.Title>
              <Dialog.Content style={{ backgroundColor: '#ffffff', borderRadius: 12 }}>
                <Text style={{ marginBottom: 8 }}>
                  {reportItem ? `Artículo: ${reportItem.descripcion}` : ''}
                </Text>
                <TextInput
                  placeholder="Describe el problema..."
                  value={reportText}
                  onChangeText={setReportText}
                  multiline
                  style={stylesLis.modalInput}
                />
              </Dialog.Content>
              <Dialog.Actions style={{ backgroundColor: '#ffffff', borderRadius: 12 }}>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={stylesLis.cancelBtn}
                >
                  <Text style={{ color: '#004989', fontWeight: 'bold' }}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={async () => {
                    if (!reportText.trim()) return;
                    setReportLoading(true);
                    try {
                      // Envía el reporte al backend
                      const res = await fetch(`${BASE_URL}/inventario/reportar`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          id_inventario: reportItem.id,
                          observacion: reportText,
                          estado: 2,
                          id_area: reportItem.id_area,
                          id_user: reportItem?.id_user
                        })
                      });
                      if (!res.ok) throw new Error('Error al enviar reporte');
                      setModalVisible(false);
                      setReportText('');
                      setReportItem(null);
                      // El alert es síncrono en React Native, así que después de OK se ejecuta el siguiente código
                      alert('Reporte enviado correctamente');
                      setReload(r => !r); // Forzar recarga del inventario después de enviar el reporte y cerrar el alert
                    } catch (e) {
                      alert('No se pudo enviar el reporte');
                    } finally {
                      setReportLoading(false);
                    }
                  }}
                  disabled={reportLoading || !reportText.trim()}
                  style={[
                    stylesLis.sendBtn,
                    { backgroundColor: reportLoading || !reportText.trim() ? '#ccc' : '#004989' }
                  ]}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>{reportLoading ? 'Enviando...' : 'Enviar'}</Text>
                </TouchableOpacity>
              </Dialog.Actions>
            </Dialog>
          </KeyboardAvoidingView>
        </Portal>

        {/* Título y separador */}
        <Text style={stylesLis.title}>Inventario</Text>
        <View style={stylesLis.separator} />

        {/* Buscador de artículos */}
        <View style={stylesLis.searchContainer}>
          <TextInput
            placeholder="Buscar artículo"
            style={stylesLis.searchInput}
            value={search}
            onChangeText={text => {
              setSearch(text);
              setShowSuggestions(text.trim() !== '');
            }}
            autoCorrect={false}
            autoCapitalize="none"
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)} // Oculta sugerencias al perder foco
            onFocus={() => setShowSuggestions(search.trim() !== '')}
          />
          <IconButton icon="magnify" size={28} color="#004989" />
        </View>
        {/* Sugerencias de búsqueda */}
        {showSuggestions && search.trim() !== '' && filteredInventory.length > 0 && (
          <View style={{
            backgroundColor: '#fff',
            borderWidth: 1,
            borderColor: '#ddd',
            borderRadius: 8,
            maxHeight: 150,
            marginHorizontal: 16,
            marginTop: -8,
            zIndex: 10,
            position: 'absolute',
            top: 170, // Ajusta según tu layout
            left: 0,
            right: 0,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 5,
          }}>
            {filteredInventory.slice(0, 6).map(item => (
              <TouchableOpacity
                key={item.id}
                onPress={() => {
                  setSearch(item.descripcion); // Autocompleta el campo de búsqueda
                  setShowSuggestions(false);   // Oculta sugerencias al seleccionar
                }}
                style={{ padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' }}
              >
                <Text style={{ color: '#222' }}>{item.descripcion}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Tabla de inventario */}
        {loadingInventory ? (
          // Muestra indicador de carga mientras se obtiene el inventario
          <ActivityIndicator size="large" color="#004989" style={{ marginVertical: 20 }} />
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            <View>
              {/* Encabezado de la tabla */}
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title style={stylesLis.tableHeaderCell}>
                    <Text style={{ textAlign: 'center', width: '100%' }}>ÁREA</Text>
                  </DataTable.Title>
                  <DataTable.Title style={stylesLis.tableHeaderCellDesc}>
                    <Text style={{ textAlign: 'center', width: '100%' }}>DESCRIPCIÓN</Text>
                  </DataTable.Title>
                  <DataTable.Title style={stylesLis.tableHeaderCellMarca}>
                    <Text style={{ textAlign: 'center', width: '100%' }}>MARCA</Text>
                  </DataTable.Title>
                  <DataTable.Title style={stylesLis.tableHeaderCellCantidad}>
                    <Text style={{ textAlign: 'center', width: '100%' }}>CANTIDAD</Text>
                  </DataTable.Title>
                  <DataTable.Title style={stylesLis.tableHeaderCellEstado}>
                    <Text style={{ textAlign: 'center', width: '100%' }}>ESTADO</Text>
                  </DataTable.Title>
                  <DataTable.Title style={stylesLis.tableHeaderCellOpcion}>
                    <Text style={{ textAlign: 'center', width: '100%' }}>OPCIÓN</Text>
                  </DataTable.Title>
                </DataTable.Header>
              </DataTable>
              {/* Filas de la tabla */}
              <ScrollView style={{ maxHeight: 300 }} showsVerticalScrollIndicator={true}>
                <DataTable>
                  {paginatedInventory.length > 0 ? (
                    paginatedInventory.map((item) => (
                      <DataTable.Row key={item.id}>
                        <DataTable.Cell style={stylesLis.tableHeaderCell}>
                          <Text style={{ textAlign: 'center' }}>{item.area}</Text>
                        </DataTable.Cell>
                        <DataTable.Cell style={stylesLis.tableHeaderCellDesc}>
                          <Text style={{ textAlign: 'center' }}>{item.descripcion}</Text>
                        </DataTable.Cell>
                        <DataTable.Cell style={stylesLis.tableHeaderCellMarca}>
                          <Text style={{ textAlign: 'center' }}>{item.marca}</Text>
                        </DataTable.Cell>
                        <DataTable.Cell style={stylesLis.tableHeaderCellCantidad}>
                          <Text style={{ textAlign: 'center' }}>{item.cantidad}</Text>
                        </DataTable.Cell>
                        <DataTable.Cell style={stylesLis.tableHeaderCellEstado}>
                          <View
                            style={[
                              stylesLis.estadoBox,
                              {
                                backgroundColor:
                                  item.nombre_estado === 'Mantenimiento Correctivo'
                                    ? '#e53935'
                                    : item.nombre_estado === 'Asignado'
                                    ? '#43a047'
                                    : item.nombre_estado === 'Arreglado'
                                    ? '#1e88e5'
                                    : '#7c7c7cff',
                              },
                            ]}
                          >
                            <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>
                              {item.nombre_estado}
                            </Text>
                          </View>
                        </DataTable.Cell>
                        <DataTable.Cell style={stylesLis.tableHeaderCellOpcion}>
                          <TouchableOpacity
                            onPress={() => {
                              setReportItem(item);
                              setModalVisible(true);
                            }}
                            style={stylesLis.reportBtn}
                          >
                            <Text style={stylesLis.reportBtnText}>reportar</Text>
                          </TouchableOpacity>
                        </DataTable.Cell>
                      </DataTable.Row>
                    ))
                  ) : (
                    <DataTable.Row>
                      <DataTable.Cell style={{ minWidth: 200 }}>
                        <Text style={{ color: '#888', fontSize: 14 }}>No hay artículos en esta página</Text>
                      </DataTable.Cell>
                    </DataTable.Row>
                  )}
                </DataTable>
              </ScrollView>
            </View>
          </ScrollView>
        )}

        {/* Paginación */}
        <View style={stylesLis.paginationContainer}>
          <View style={stylesLis.paginationInner}>
            <DataTable.Pagination
              page={page - 1} // DataTable usa 0-index, backend 1-index
              numberOfPages={totalPages}
              onPageChange={(newPage) => setPage(newPage + 1)}
              label={
                total > 0
                  ? `Página ${page} de ${totalPages} | Mostrando ${(page - 1) * limit + 1}-${Math.min(page * limit, total)} de ${total} artículo${total === 1 ? '' : 's'}`
                  : 'Sin artículos para mostrar'
              }
              optionsPerPage={[]}
              itemsPerPage={limit}
              onItemsPerPageChange={() => {}}
              showFastPaginationControls={total > limit}
              selectPageDropdownLabel={''}
              disabled={total === 0}
              style={{ minWidth: 220 }}
              labelStyle={{ flexWrap: 'nowrap', textAlign: 'center', fontSize: 14, color: '#222' }}
            />
          </View>
        </View>

        {/* Selector de límite de artículos por página */}
        <View style={stylesLis.limitInputContainer}>
          <TextInput
            onChangeText={handleLimitChange}
            value={String(limit)}
            keyboardType="numeric"
            style={stylesLis.limitInput}
            maxLength={2}
            placeholder="5"
            returnKeyType="done"
            selectTextOnFocus
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
