import { View, StyleSheet, Text } from 'react-native';

/**
 * CustomAlert component
 * Muestra una alerta en la parte inferior de la pantalla.
 * Props:
 * - message: string, el mensaje a mostrar.
 * - type: 'success' | 'error', define el color de fondo (verde para éxito, rojo para error).
 */
export default function CustomAlert({ message, type = 'success' }) {
  // Determina el color de fondo según el tipo de alerta
  const backgroundColor = type === 'error' ? '#FF5252' : '#4CAF50'; // Rojo para error, verde para éxito

  return (
    <View style={[styles.alert, { backgroundColor }]}>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  alert: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 16,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  message: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});