// 1. Importaciones principales
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, TouchableWithoutFeedback, TextInput, FlatList } from 'react-native';
import { DataTable } from 'react-native-paper';
import { IconButton } from 'react-native-paper';
import { ScrollView } from 'react-native';
import { getFocusedRouteNameFromRoute, useNavigation } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
// 2. Recursos locales (imágenes y estilos)
import { styles } from '../../styles/inicio/inicioEstilo';

import BarraNav from '../../components/nav/barra_nav'; // <--- Agrega esta línea
import { useSesion } from '../../hookes/useSesion';

import { BASE_URL } from '../../components/api/urlApi';

// 3. Componente principal de la pantalla de inicio
export default function Inicio() {
  // --- Estados locales ---
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const sesion = useSesion();
  const navigation = useNavigation();

  // --- Estados para inventario ---
  const [search, setSearch] = useState('');
  const [inventory, setInventory] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);

  // Handler para cambiar el límite desde un input
  const handleLimitChange = (text) => {
    // Solo permitir números entre 1 y 100
    let value = parseInt(text.replace(/[^0-9]/g, ''));
    if (isNaN(value) || value < 1) value = 1;
    if (value > 100) value = 100;
    setLimit(value);
    setPage(0); // Reiniciar a la primera página
  };

  // --- Efecto para manejar la carga de la sesión ---
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

  // --- Extraer datos del usuario de la sesión ---
  let userSession;
  if (sesion && sesion.usuario) {
    userSession = sesion.usuario;
  }
  console.log('Sesión del usuario:', userSession);

  // Filtrar inventario por búsqueda
  const filteredInventory = inventory.filter(item =>
    item.descripcion && item.descripcion.toLowerCase().includes(search.toLowerCase())
  );

  // Calcular el total de elementos filtrados
  const filteredTotal = filteredInventory.length;

  // Obtener los elementos de la página actual
  const paginatedInventory = filteredInventory.slice(page * limit, (page + 1) * limit);

useEffect(() => {
  fetch(`${BASE_URL}/inventario/${userSession?.id_log}?page=${page + 1}&limit=${limit}`)
    .then(response => response.json())
    .then(data => {
      // Si data ya es un array, no hay paginación implementada
      if (Array.isArray(data)) {
        console.warn('El backend no está paginando, se recibieron', data.length, 'items');
        setInventory(data);
        setTotal(data.length);
      } else {
        setInventory(Array.isArray(data.items) ? data.items : []);
        setTotal(data.total || 0);
      }
    })
    .catch(error => {
      console.error('Error al obtener inventario:', error);
    });
}, [page, limit]);



  // --- Mostrar pantalla de carga o error si no hay sesión ---
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



  // --- Renderizado principal ---
  return (
    <SafeAreaView style={styles.safeArea}>
      <BarraNav/>{/* Barra de navegación personalizada */}
      

      {/* Contenido principal  */}
      <View style={styles.container}>
        {/* Inventario */}
        <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 4, color: '#004989', textAlign: 'left', letterSpacing: 1, alignSelf: 'flex-start' }}>Inventario</Text>
        <View style={{ height: 2, backgroundColor: '#b0b0b0', marginBottom: 12, borderRadius: 2, opacity: 0.7, width: '100%' }} />



        <View style={{ flexDirection: 'row', alignItems: 'center', borderColor: '#ccc', borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, marginBottom: 12, backgroundColor: '#fff' }}>
          <TextInput
            placeholder="Buscar artículo"
            style={{ flex: 1, height: 40 }}
            value={search}
            onChangeText={setSearch}
          />
          <IconButton
            icon="magnify"
            size={28}
            color="#004989"
            onPress={() => {}}
            style={{ marginLeft: 8 }}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
          <View>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title style={{ minWidth: 200 }}>ÁREA</DataTable.Title>
                <DataTable.Title style={{ minWidth: 360 }}>DESCRIPCIÓN</DataTable.Title>
                <DataTable.Title style={{ minWidth: 100 }}>MARCA</DataTable.Title>
                <DataTable.Title style={{ minWidth: 100 }}>CANTIDAD</DataTable.Title>
                <DataTable.Title style={{ minWidth: 100 }}>ESTADO</DataTable.Title>
                <DataTable.Title style={{ minWidth: 100 }}>OPCIÓN</DataTable.Title>
              </DataTable.Header>
            </DataTable>
            <ScrollView style={{ maxHeight: 300 }} showsVerticalScrollIndicator={true}>
              <DataTable>
                {paginatedInventory.map((item, idx) => (
                  <DataTable.Row key={item.id}>
                    <DataTable.Cell style={{ minWidth: 200 }}>{item.area}</DataTable.Cell>
                    <DataTable.Cell style={{ minWidth: 360 }}>{item.descripcion}</DataTable.Cell>
                    <DataTable.Cell style={{ minWidth: 100 }}>{item.marca}</DataTable.Cell>
                    <DataTable.Cell style={{ minWidth: 100 }}>{item.cantidad}</DataTable.Cell>
                    <DataTable.Cell style={{ minWidth: 100 }}>{item.estado}</DataTable.Cell>
                    <DataTable.Cell style={{ minWidth: 100 }}>
                      <TouchableOpacity>
                        <Text style={{ color: '#007BFF', fontSize: 12 }}>Editar</Text>
                      </TouchableOpacity>
                    </DataTable.Cell>
                  </DataTable.Row>
                ))}
              </DataTable>
            </ScrollView>
            
          </View>
        </ScrollView>
        <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 12, marginBottom: 0, width: '100%' }}>
          <View style={{ width: 300, maxWidth: '100%' }}>
            <DataTable.Pagination
              page={page}
              numberOfPages={Math.max(1, Math.ceil(filteredTotal / limit))}
              onPageChange={(newPage) => {
                if (filteredTotal > 0 && newPage >= 0 && newPage < Math.ceil(filteredTotal / limit)) setPage(newPage);
              }}
              label={
                filteredTotal > 0
                  ? `Página ${page + 1} de ${Math.max(1, Math.ceil(filteredTotal / limit))} | Mostrando ${filteredTotal === 0 ? 0 : page * limit + 1}-${Math.min((page + 1) * limit, filteredTotal)} de ${filteredTotal} artículo${filteredTotal === 1 ? '' : 's'}`
                  : 'Sin artículos para mostrar'
              }
              optionsPerPage={[]}
              itemsPerPage={limit}
              onItemsPerPageChange={() => {}}
              showFastPaginationControls={filteredTotal > limit}
              selectPageDropdownLabel={''}
              disabled={filteredTotal === 0}
              style={{ minWidth: 220 }}
              labelStyle={{ flexWrap: 'nowrap', textAlign: 'center', fontSize: 14, color: '#222' }}
            />
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 4, marginBottom: 8, width: '100%' }}>
          <TextInput
            value={limit.toString()}
            onChangeText={handleLimitChange}
            keyboardType="numeric"
            style={{ borderWidth: 1, borderColor: '#b0b0b0', borderRadius: 6, width: 38, height: 28, textAlign: 'center', backgroundColor: '#fff', fontSize: 14, paddingVertical: 0, paddingHorizontal: 2 }}
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

