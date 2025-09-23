import { StyleSheet } from 'react-native';

export const estilosReserva = StyleSheet.create({
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
    width: '100%',
    minWidth: 260,
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
