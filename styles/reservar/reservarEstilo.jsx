import { StyleSheet } from 'react-native';

/**
 * estilosReserva
 * Estilos reutilizables para la pantalla de reserva.
 * Incluye estilos para contenedores, tarjetas, títulos, etiquetas, campos de entrada y botones.
 */
export const estilosReserva = StyleSheet.create({
  // Contenedor principal con scroll
  scrollContainer: {
    flex: 1,
  },
  // Tarjeta principal con sombra y bordes redondeados
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
  // Título destacado y centrado
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 18,
    color: '#3F51B5',
    textAlign: 'center',
    letterSpacing: 1,
  },
  // Etiqueta de campo
  label: {
    marginTop: 18,
    fontWeight: 'bold',
    color: '#004989',
    fontSize: 16,
  },
  // Campo de entrada de datos
  input: {
    marginTop: 12,
    backgroundColor: '#f5f7fa',
    borderRadius: 50,
    width: '100%',
    minWidth: 260,
    alignSelf: 'center',
  },
  // Botón verde (por ejemplo, para confirmar)
  botonVerde: {
    marginTop: 24,
    backgroundColor: '#00C851',
    borderRadius: 30,
    paddingVertical: 6,
  },
  // Botón azul (por ejemplo, para reservar)
  botonReservar: {
    marginTop: 12,
    backgroundColor: '#3F51B5',
    borderRadius: 30,
    paddingVertical: 6,
  },
});
