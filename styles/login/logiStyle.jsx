import { StyleSheet } from "react-native";

// El objetivo de la carpeta de styles es tener un archivo de estilos para cada componente

// Definición de estilos para el componente de Login
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eaf6ff', // Fondo más claro
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: 'rgba(185, 185, 185, 0.38)',
    margin: 16,
    padding: 0,
    borderRadius:80, // Menos redondeado
    shadowColor: '#ffffffff',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 12,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#004989',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000ff',
    marginBottom: 30,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  button: {
    width: 200,
    marginVertical: 19,
    borderRadius: 40,
    elevation: 6,
    backgroundColor: '#004989',
    paddingVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  buttonDisabled: {
    backgroundColor: '#b0b0b0',
  },
  buttonLabel: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '700',
    letterSpacing: 1,
  },
  textInput: {
    borderRadius: 24,
    backgroundColor: '#ffffff80',
    borderWidth: 0,
    marginBottom: 10,
    fontSize: 16,
    color: '#004989',
    height: 38,
    paddingHorizontal: 9,
  },
  helpText: {
    alignSelf: 'center',
    color: '#004989',
    fontSize: 16,
    marginTop: 35,
    opacity: 1,
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  errorText: {
    color: '#d60000',
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 4,
    fontSize: 15,
    fontWeight: '600',
  },
});