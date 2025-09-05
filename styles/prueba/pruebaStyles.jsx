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
    width: 220,
    marginVertical: 10,
    borderRadius: 8,
    elevation: 2,
    backgroundColor: '#0984e3',
  },
  buttonLabel: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    letterSpacing: 1,
  },
});