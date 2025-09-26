// 1. Importaciones principales
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, TouchableWithoutFeedback, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Button, TextInput, RadioButton, Checkbox, Switch } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getFocusedRouteNameFromRoute, useNavigation } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
// 2. Recursos locales (imágenes y estilos)
import { styles } from '../../styles/inicio/inicioEstilo';
import BarraNav from '../../components/nav/barra_nav'; // Barra de navegación personalizada
import { useSesion } from '../../hookes/useSesion';

// --- Componente de reserva de salón embebido ---
function ReservarSalon() {
  // --- Estados locales para los campos del formulario ---
  const [salon, setSalon] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [detalles, setDetalles] = useState('');
  const [portatil, setPortatil] = useState(false);
  const [sonido, setSonido] = useState(false);
  const [disponibilidad, setDisponibilidad] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempFecha, setTempFecha] = useState(new Date());
  // Focus states para los inputs
  const [salonFocus, setSalonFocus] = useState(false);
  const [fechaFocus, setFechaFocus] = useState(false);
  const [detallesFocus, setDetallesFocus] = useState(false);

  // --- Opciones disponibles para salones y horas ---
  const salonesDisponibles = ['Salón A', 'Salón B', 'Salón C'];
  const horasDisponibles = ['08:00', '10:00', '14:00', '16:00'];

  // --- Simula la consulta de disponibilidad ---
  const consultarDisponibilidad = () => {
    setDisponibilidad('Disponible');
  };

  // --- Maneja la acción de reservar ---
  const reservar = () => {
    if (salon && fecha && hora && detalles) {
      alert('Reserva realizada con éxito.');
    } else {
      alert('Por favor completa todos los campos obligatorios.');
    }
  };

  // --- Renderiza el formulario de reserva ---
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={80}
    >
      <ScrollView
        style={estilosReserva.scrollContainer}
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Campo de selección de salón */}
        <TextInput
          label="Salón *"
          value={salon}
          onChangeText={setSalon}
          mode="outlined"
          placeholder="Seleccione un salón"
          style={estilosReserva.input}
          left={<TextInput.Icon icon="domain" color={salonFocus ? "#004989" : "#888"} />}
          onFocus={() => setSalonFocus(true)}
          onBlur={() => setSalonFocus(false)}
          theme={{
            colors: {
              primary: '#004989',
              text: '#c2c2c2ff',
              placeholder: '#888'
            },
            roundness: 60
          }}
        />

        {/* Selector de fecha con DateTimePicker */}
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <TextInput
            label="Fecha *"
            value={fecha}
            mode="outlined"
            placeholder="Seleccionar fecha"
            style={estilosReserva.input}
            editable={false}
            left={<TextInput.Icon icon="calendar" color={fechaFocus ? "#004989" : "#888"} />}
            onFocus={() => setFechaFocus(true)}
            onBlur={() => setFechaFocus(false)}
            theme={{
              colors: {
                primary: '#004989',
                text: '#c2c2c2ff',
                placeholder: '#888'
              },
              roundness: 60
            }}
          />
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={fecha ? new Date(fecha) : tempFecha}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                setFecha(selectedDate.toISOString().split('T')[0]);
                setTempFecha(selectedDate);
              }
            }}
            locale="es-ES"
          />
        )}

        {/* Selección de hora */}
        <Text style={estilosReserva.label}>Horas disponibles *</Text>
        <RadioButton.Group onValueChange={setHora} value={hora}>
          {horasDisponibles.map((h, index) => (
            <RadioButton.Item key={index} label={h} value={h} color="#3F51B5" />
          ))}
        </RadioButton.Group>

        {/* Complementos: Portátil y Sonido */}
        <Text style={estilosReserva.label}>Complementos *</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
          <Text style={{ flex: 1 }}>Portátil (0 disponibles)</Text>
          <Switch value={portatil} onValueChange={() => setPortatil(!portatil)} disabled={true} color="#3F51B5" />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
          <Text style={{ flex: 1 }}>Sonido</Text>
          <Switch value={sonido} onValueChange={() => setSonido(!sonido)} color="#3F51B5" />
        </View>

        {/* Campo de detalles de la reserva */}
        <View style={{ marginBottom: 32 }}>
          <TextInput
            label="Detalles de la reserva *"
            value={detalles}
            onChangeText={setDetalles}
            mode="outlined"
            multiline
            numberOfLines={4}
            style={[estilosReserva.input, { height: 100 }]}
            left={<TextInput.Icon icon="note" color={detallesFocus ? "#004989" : "#888"} />}
            onFocus={() => setDetallesFocus(true)}
            onBlur={() => setDetallesFocus(false)}
            theme={{
              colors: {
                primary: '#004989',
                text: '#c2c2c2ff',
                placeholder: '#888'
              },
              roundness: 20
            }}
          />
        </View>

        {/* Botón para consultar disponibilidad */}
        <Button mode="contained" onPress={consultarDisponibilidad} style={estilosReserva.botonVerde}>
          Consultar disponibilidad
        </Button>

        {/* Botón para reservar */}
        <Button icon="content-save" mode="contained" onPress={reservar} style={estilosReserva.botonReservar}>
          Reservar
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// --- Estilos específicos para el formulario de reserva ---
const estilosReserva = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  card: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 30,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 18,
    color: '#3F51B5',
    textAlign: 'center',
    letterSpacing: 1,
  },
  label: {
    marginTop: 18,
    fontWeight: 'bold',
    color: '#004989',
    fontSize: 16,
  },
  input: {
    marginTop: 12,
    backgroundColor: '#f5f7fa',
    borderRadius: 50,
    width: '100%', // Ocupa todo el ancho disponible
    minWidth: 260, // Asegura un ancho mínimo cómodo
    alignSelf: 'center',
  },
  botonVerde: {
    marginTop: 24,
    backgroundColor: '#00C851',
    borderRadius: 30,
    paddingVertical: 6,
  },
  botonReservar: {
    marginTop: 12,
    backgroundColor: '#3F51B5',
    borderRadius: 30,
    paddingVertical: 6,
  },
});

// 3. Componente principal de la pantalla de inicio
export default function Inicio() {
  // --- Estados locales para manejo de sesión y errores ---
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const sesion = useSesion();
  const navigation = useNavigation();

  // --- Efecto para verificar la sesión del usuario ---
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

  // --- Extraer datos del usuario de la sesión ---
  let userSession;
  if (sesion && sesion.usuario) {
    userSession = sesion.usuario;
  }

  // --- Renderizado principal de la pantalla de reserva ---
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <BarraNav/>{/* Barra de navegación personalizada */}
        {/* Contenido principal  */}
        <View style={styles.container}>
          {/* Título fijo de la pantalla de reserva */}
          <View style={{ marginTop: 24, marginBottom: 8, alignSelf: 'flex-start', width: '100%', zIndex: 2 }}>
            <Text
              style={{
                color: '#004989',
                fontWeight: 'bold',
                fontSize: 20,
                textAlign: 'left',
                letterSpacing: 1,
              }}
            >
              Reservar Salón
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
          {/* Formulario debajo del título fijo */}
          <View style={{ flex: 1, width: '100%' }}>
            <ReservarSalon />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

