// 1. Importaciones principales
import React, { useState, useMemo } from "react";
import { View, Text, TextInput, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons"; // Agrega esto arriba
import { MaterialCommunityIcons } from "@expo/vector-icons"; // <-- Agrega esta línea
import BarraNav from "../../components/nav/barra_nav";

// --- Datos de ejemplo para los reportes ---
const reportesData = [
  {
    id: "67798",
    responsable: "LOLY LUZ ALGARIN DE LA ASUNCION",
    area: "S03 (9B)",
    descripcion: "ESCRITORIO PARA ESTUDIANTE SUPERFICIE DE 70 CM X 50 CM",
    marca: "N/A",
    fecha: "2025-10-14 14:34:17",
    observacion: "LAS PATAS ESTÁN DESNIVELADAS.",
    tipo: "MANTENIMIENTO CORRECTIVO",
    categoria: "GENERAL",
  },
  {
    id: "79802",
    responsable: "VALERIA BACCI LLINAS",
    area: "S18 (3B)",
    descripcion: "PARLANTES",
    marca: "LOGITECH",
    fecha: "2025-10-03 08:02:45",
    observacion: "TIENEN UN SONIDO EXTRAÑO Y NO SE ESCUCHA BIEN",
    tipo: "MANTENIMIENTO CORRECTIVO",
    categoria: "SISTEMAS",
  },
  {
    id: "82703",
    responsable: "VALERIA BACCI LLINAS",
    area: "S18 (3B)",
    descripcion: "MESA AUXILIAR DE MADERA",
    marca: "N/A",
    fecha: "2025-10-03 08:01:28",
    observacion: "SE NECESITA OTRA MESA AUXILIAR",
    tipo: "MANTENIMIENTO CORRECTIVO",
    categoria: "GENERAL",
  },
  {
    id: "68858",
    responsable: "LAURA GOMEZ CARDENAS",
    area: "S30 (TRANSICIÓN A)",
    descripcion: "AIRE ACONDICIONADO #S30 DE 36.000 BTU ESTÁNDAR MARCA CIAC",
    marca: "CIAC",
    fecha: "2025-10-02 11:36:02",
    observacion: "EL AIRE SE APAGÓ Y APARECE EN PANTALLA E C.",
    tipo: "MANTENIMIENTO CORRECTIVO",
    categoria: "GENERAL",
  },
];

export default function Reportes() {
  const [area, setArea] = useState("");
  const [usuario, setUsuario] = useState("");
  const [busqueda, setBusqueda] = useState("");

  // Normaliza texto para evitar errores por mayúsculas/minúsculas y espacios
  const normalize = (str) => (str || "").toLowerCase().trim();

  // Memoiza el filtrado para eficiencia
  const filtrados = useMemo(() => {
    const nArea = normalize(area);
    const nUsuario = normalize(usuario);
    const nBusqueda = normalize(busqueda);

    return reportesData.filter((r) => {
      const rArea = normalize(r.area);
      const rUsuario = normalize(r.responsable);
      const rDescripcion = normalize(r.descripcion);
      const rObservacion = normalize(r.observacion);

      const matchArea = !nArea || rArea.includes(nArea);
      const matchUsuario = !nUsuario || rUsuario.includes(nUsuario);
      const matchBusqueda =
        !nBusqueda ||
        rDescripcion.includes(nBusqueda) ||
        rObservacion.includes(nBusqueda);

      return matchArea && matchUsuario && matchBusqueda;
    });
  }, [area, usuario, busqueda]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.id}>ID INVENTARIO: {item.id}</Text>
      <Text style={styles.responsable}>RESPONSABLE : {item.responsable}</Text>
      <Text style={styles.text}>ÁREA: {item.area}</Text>
      <Text style={styles.text}>DESCRIPCIÓN: {item.descripcion}</Text>
      <Text style={styles.text}>MARCA: {item.marca}</Text>
      <Text style={styles.text}>FECHA: {item.fecha}</Text>
      <Text style={styles.text}>OBSERVACIÓN: {item.observacion}</Text>
      <View style={styles.badges}>
        <Text style={[styles.badge, styles.categoria]}>{item.categoria}</Text>
        <Text style={[styles.badge, styles.tipo]}>{item.tipo}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8fafc" }}>
      <BarraNav />
      {/* <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      > */}
        <View style={styles.container}>
          {/* Pantalla gris de "En construcción" que tapa solo el contenido debajo del título */}
          <View
            style={{
              position: 'absolute',
              top: 65, // Ajusta este valor si el título/divider es más alto o bajo
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: '#edededc9',
              zIndex: 99,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            pointerEvents="auto"
          >
            <MaterialCommunityIcons
              name="tools"
              size={48}
              color="#b0b0b0"
              style={{ marginBottom: 12 }}
            />
            <Text style={{ color: '#474747ff', fontSize: 18, fontWeight: 'bold', marginBottom: 4 }}>
              ¡En construcción!
            </Text>
            <Text style={{ color: '#777777ff', fontSize: 15, textAlign: 'center', maxWidth: 260 }}>
              Estamos trabajando para traerte esta sección pronto.
            </Text>
          </View>
          <Text style={styles.title}>Reportes</Text>
          <View style={styles.divider} />
          <View style={styles.filtersBox}>
            <Text style={styles.filtersTitle}>Filtrar por:</Text>
            <View style={styles.filterRow}>
              <View style={styles.inputGroup}>
                <Ionicons name="business-outline" size={20} color="#004aa5" style={styles.inputIcon} />
                <Picker
                  selectedValue={area}
                  style={styles.picker}
                  onValueChange={setArea}
                  dropdownIconColor="#004989"
                >
                  <Picker.Item label="Selec área..." value="" color="#9ca3af" />
                  <Picker.Item label="S03 (9B)" value="S03 (9B)" />
                  <Picker.Item label="S18 (3B)" value="S18 (3B)" />
                  <Picker.Item label="S30 (TRANSICIÓN A)" value="S30 (TRANSICIÓN A)" />
                </Picker>
              </View>
              <View style={styles.inputGroup}>
                <Ionicons name="person-outline" size={20} color="#004aa5" style={styles.inputIcon} />
                <Picker
                  selectedValue={usuario}
                  style={styles.picker}
                  onValueChange={setUsuario}
                  dropdownIconColor="#004989"
                  itemStyle={{ color: "#1e293b", fontWeight: "bold", fontSize: 17 }}
                >
                  <Picker.Item label="Selec usuario..." value="" color="#64748b" />
                  <Picker.Item label="LOLY LUZ ALGARIN DE LA ASUNCION" value="LOLY LUZ ALGARIN DE LA ASUNCION" />
                  <Picker.Item label="VALERIA BACCI LLINAS" value="VALERIA BACCI LLINAS" />
                  <Picker.Item label="LAURA GOMEZ CARDENAS" value="LAURA GOMEZ CARDENAS" />
                </Picker>
              </View>
            </View>
            <View style={[styles.inputGroup, styles.searchGroup]}>
              <Ionicons name="search-outline" size={20} color="#004aa5" style={styles.inputIcon} />
              <TextInput
                style={styles.search}
                placeholder="Buscar"
                placeholderTextColor="#929292ff"
                value={busqueda}
                onChangeText={setBusqueda}
                clearButtonMode="while-editing"
              />
            </View>
          </View>
          <FlatList
            data={filtrados}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            ListEmptyComponent={
              <Text style={styles.empty}>
                No se encontraron reportes.
              </Text>
            }
            contentContainerStyle={{ paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
          />
        </View>
      {/* </KeyboardAvoidingView> */} 
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#f8fafc" },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 0,
    color: "#004989",
    letterSpacing: 0.5,
    
  },
  divider: {
    height: 3,
    backgroundColor: "#bebebeff",
    marginVertical: 6,
    borderRadius: 2,
    opacity: 0.7,
    width: "100%",
  },
  filtersBox: {
    backgroundColor: "#e0e7ef",
    borderRadius: 18,
    padding: 18,
    marginBottom: 22,
    shadowColor: "#1e293b",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  filtersTitle: {
    fontWeight: "bold",
    color: "#004aa5",
    fontSize: 16,
    marginBottom: 14, // Más espacio debajo del título
    letterSpacing: 0.2,
  },
  filterRow: {
    flexDirection: "column",
    gap: 0,
    marginBottom: 0,
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#b6c6e3",
    marginBottom: 10, // Más espacio entre filtros
    paddingHorizontal: 6,
    shadowColor: "#004aa5ff",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  inputIcon: {
    marginRight: 4,
    marginLeft: 2,
  },
  picker: {
    flex: 1,
    backgroundColor: "transparent",
    borderRadius: 10,
    color: "#1e293b",
    fontWeight: "bold",
    height: 50,
    fontSize: 17,
    marginVertical: 0,
  },
  search: {
    flex: 1,
    backgroundColor: "transparent",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 17,
    color: "#0f172a",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginVertical: 10,
    shadowColor: "#004aa5",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.13,
    shadowRadius: 10,
    elevation: 4,
    borderLeftWidth: 6,
    borderLeftColor: "#004aa5ff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  id: { fontWeight: "bold", fontSize: 15, color: "#1e3a8a", marginBottom: 2 },
  responsable: { fontWeight: "600", color: "#334155", marginBottom: 2 },
  text: { color: "#475569", marginTop: 2, fontSize: 14 },
  badges: { flexDirection: "row", marginTop: 12, gap: 10 },
  badge: {
    fontSize: 13,
    fontWeight: "700",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    color: "white",
    overflow: "hidden",
    marginRight: 6,
    letterSpacing: 0.5,
    shadowColor: "#64748b",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.10,
    shadowRadius: 2,
    elevation: 2,
  },
  categoria: { backgroundColor: "#64748b" },
  tipo: { backgroundColor: "#ef4444" },
  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#64748b",
    fontSize: 17,
    fontWeight: "600",
    opacity: 0.7,
  },
});

