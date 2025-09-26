import { StyleSheet } from "react-native";

// El objetivo de la carpeta de styles es tener un archivo de estilos para cada componente

// Definición de estilos para el componente de Login
export const styles = StyleSheet.create({
  container: {
    flex: 1, // Ocupa todo el espacio disponible
    backgroundColor: '#f5f6fa', // Color de fondo principal
    alignItems: 'center', // Centra los hijos horizontalmente
    justifyContent: 'center', // Centra los hijos verticalmente
    padding: 20, // Espaciado interno
  },
  title: {
    fontSize: 28, // Tamaño de fuente del título
    fontWeight: 'bold', // Negrita
    color: '#2d3436', // Color del texto
    marginBottom: 30, // Espacio debajo del título
  },
  button: {
    width: 190,             // Ancho del botón
    marginVertical: 10,     // Espacio vertical entre botones
    borderRadius: 35,       // Bordes redondeados
    elevation: 5,           // Sombra (solo Android)
    backgroundColor: '#004989', // Color de fondo del botón
    paddingVertical: 7,     // Altura del botón
    paddingHorizontal: 0,   // Sin espacio lateral
    alignItems: 'center',   // Centra el texto horizontalmente
    justifyContent: 'center', // Centra el texto verticalmente
  },
  buttonDisabled: {
    backgroundColor: '#b0b0b0', // Color para botón deshabilitado
  },
  buttonLabel: {
    fontSize: 19,           // Tamaño del texto del botón
    color: '#fff',          // Color del texto
    fontWeight: '600',      // Seminegrita
    letterSpacing: 1,       // Espaciado entre letras
  },
  textInput: {
    borderRadius: 30,       // Bordes redondeados
    backgroundColor: 'transparent', // Fondo transparente
    borderWidth: 0,         // Sin borde
    marginBottom: 5,        // Espacio debajo del input
    fontSize: 15,           // Tamaño del texto del input
    color: '#c4c4c4ff',     // Color del texto
    height: 39,             // Altura del input
    paddingHorizontal: 8,   // Espacio lateral interno
  },
});