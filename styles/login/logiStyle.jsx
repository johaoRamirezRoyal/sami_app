import { StyleSheet } from "react-native";

// El objetivo de la carpeta de styles es tener un archivo de estilos para cada componente
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2d3436',
    marginBottom: 30,
  },
  button: {
    width: 190,             // ancho del botón
    marginVertical: 10,
    borderRadius: 35,
    elevation: 5,
    backgroundColor: '#004989',
    paddingVertical: 7,     // alto del botón
    paddingHorizontal: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#b0b0b0', // color para botón deshabilitado
  },
  buttonLabel: {
    fontSize: 19,           // tamaño del texto del botón
    color: '#fff',
    fontWeight: '600',
    letterSpacing: 1,
  },
  textInput: {
    borderRadius: 30,
    backgroundColor: 'transparent',
    borderWidth: 0,
    marginBottom: 5,
    fontSize: 15,           // tamaño del texto del input
    color: '#c4c4c4ff',
    height: 39,             // altura del input
    paddingHorizontal: 8,   // espacio lateral
  },
});