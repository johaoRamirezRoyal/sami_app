// Este archivo define un objeto de estilos para una pantalla de inicio de sesión (login) usando StyleSheet de React Native.
// Los estilos incluyen contenedores para inputs, íconos y el propio input de texto.

import { StyleSheet } from 'react-native';

export const loginStyles = StyleSheet.create({
  // Contenedor del input, organiza los elementos en fila y alinea verticalmente al centro.
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 20,
  },
  // Estilo para el ícono dentro del input.
  inputIcon: {
    fontSize: 20,
    color: '#666',
    marginRight: 10,
  },
  // Estilo para el campo de texto del input.
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333',
  },
});
