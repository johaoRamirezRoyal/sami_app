// 1. Importaciones principales
import React, { useState, useMemo } from "react";
import { View, Text, TextInput, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
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
          <Text style={styles.title}>Reportes</Text>
          <View style={styles.divider} />
          <View style={styles.filtersBox}>
            <View style={styles.filterRow}>
              <Picker
                selectedValue={area}
                style={styles.picker}
                onValueChange={setArea}
                dropdownIconColor="#004989"
              >
                <Picker.Item label="Selec área..." value="" color="#9ca3af" /> {/* gris tenue */}
                <Picker.Item label="S03 (9B)" value="S03 (9B)" />
                <Picker.Item label="S18 (3B)" value="S18 (3B)" />
                <Picker.Item label="S30 (TRANSICIÓN A)" value="S30 (TRANSICIÓN A)" />
              </Picker>
              <Picker
                selectedValue={usuario}
                style={styles.picker}
                onValueChange={setUsuario}
                dropdownIconColor="#004989"
                itemStyle={{ color: "#1e293b", fontWeight: "bold", fontSize: 17 }} // <-- mejora visibilidad
              >
                <Picker.Item label="Selec usuario..." value="" color="#64748b" /> {/* color más oscuro */}
                <Picker.Item label="LOLY LUZ ALGARIN DE LA ASUNCION" value="LOLY LUZ ALGARIN DE LA ASUNCION" />
                <Picker.Item label="VALERIA BACCI LLINAS" value="VALERIA BACCI LLINAS" />
                <Picker.Item label="LAURA GOMEZ CARDENAS" value="LAURA GOMEZ CARDENAS" />
              </Picker>
            </View>
            <TextInput
              style={styles.search}
              placeholder="Buscar"
              placeholderTextColor="#929292ff"
              value={busqueda}
              onChangeText={setBusqueda}
              clearButtonMode="while-editing"
            />
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
    backgroundColor: "#f1f5f9",
    borderRadius: 18,
    padding: 16,
    marginBottom: 22,
    shadowColor: "#1e293b",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  filterRow: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 12,
  },
  picker: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 2, // antes 10, para que no se vea tan grueso
    borderColor: "#38bdf8",
    color: "#1e293b", // texto más oscuro
    fontWeight: "bold", // resalta el texto
    height: 48,
    fontSize: 17,
    marginVertical: 0,
    overflow: "hidden",
    shadowColor: "#0ea5e9",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  search: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 17,
    borderWidth: 2,
    borderColor: "#38bdf8",
    color: "#0f172a",
    marginTop: 2,
    shadowColor: "#0ea5e9",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 3,
    borderLeftWidth: 5,
    borderLeftColor: "#60a5fa",
  },
  id: { fontWeight: "bold", fontSize: 15, color: "#1e3a8a" },
  responsable: { fontWeight: "600", color: "#334155", marginBottom: 2 },
  text: { color: "#475569", marginTop: 2, fontSize: 14 },
  badges: { flexDirection: "row", marginTop: 10, gap: 8 },
  badge: {
    fontSize: 13,
    fontWeight: "700",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    color: "white",
    overflow: "hidden",
    marginRight: 4,
    letterSpacing: 0.5,
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

