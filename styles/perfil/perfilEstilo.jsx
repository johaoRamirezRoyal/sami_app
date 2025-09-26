// Importa el módulo StyleSheet de react-native para crear estilos reutilizables
import { StyleSheet } from 'react-native';

// Define y exporta un objeto de estilos para la pantalla de perfil
export const styles = StyleSheet.create({
  // Estilo para el área segura de la pantalla
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  // Contenedor para mostrar el indicador de carga centrado
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Contenedor principal de la pantalla de perfil
  container: {
    alignItems: 'center',
    paddingBottom: 50,
    paddingHorizontal: 20,
  },
  // Contenedor del avatar del usuario
  avatarContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  // Estilo para el gradiente del avatar (fondo circular con sombra)
  avatarGradient: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 6,
  },
  // Estilo para el nombre del usuario
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2f3640',
    marginBottom: 20,
    textAlign: 'center',
  },
  // Tarjeta que contiene la información del usuario
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 15,
    elevation: 5,
  },
  // Estilo para cada ítem de información (fila)
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  // Texto de cada ítem de información
  itemText: {
    marginLeft: 14,
    fontSize: 16,
    color: '#2f3640',
  },
  // Etiqueta de cada ítem (por ejemplo: "Correo:")
  itemLabel: {
    fontWeight: 'bold',
    color: '#004989',
    marginLeft: 8,
    marginRight: 4,
  },
  // Botón para editar el perfil
  editButton: {
    flexDirection: 'row',
    backgroundColor: '#00a8ff',
    paddingVertical: 14,
    paddingHorizontal: 35,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00a8ff',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 6,
  },
  // Texto del botón de editar
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});