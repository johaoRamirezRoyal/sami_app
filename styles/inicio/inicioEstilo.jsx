import { StyleSheet } from 'react-native';

// Estilos para la pantalla de inicio y componentes relacionados
export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f1f1f1ff', // Fondo general de la pantalla
  },
  // Drawer flotante (menú lateral personalizado)
  drawerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)', // Sombra semitransparente detrás del drawer
    zIndex: 100,
  },
  customDrawerContainer: {
    position: 'absolute',
    top: 85,
    left: 20,
    width: 240,
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 30, // Aplica a todas las esquinas
    elevation: 12,
    zIndex: 101,
    paddingTop: 40,
    shadowColor: '#004989',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
  },
  drawerItem: {
    borderRadius: 30,
    marginVertical: 2,
    backgroundColor: 'transparent', // Fondo transparente para ítems inactivos
  },
  drawerItemActive: {
    borderRadius: 30,
    marginVertical: 2,
    backgroundColor: 'rgba(0,73,137,0.5)', // Fondo azul con opacidad para ítem activo
  },
  drawerItemLabel: {
    color: '#222', // Color de texto normal
    fontWeight: 'bold',
    fontSize: 16,
  },
  drawerItemLabelActive: {
    color: '#fff', // Color de texto para ítem activo
    fontWeight: 'bold',
  },
  // Barra de navegación superior flotante
  appbar: {
    backgroundColor: '#ffffffff',
    borderRadius: 20,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    zIndex: 10,
    height: 70,
    marginTop: 0,
    top: 40,
    position: 'absolute',
    left: 20,
    right: 20,
  },
  // Logo pequeño para la barra superior
  logoBar: {
    width: 50,
    height: 50,
  },
  // Contenedor principal de la pantalla
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    margin: 20,
    borderRadius: 32,
    shadowColor: '#a1a1a1ff',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  // Logo principal grande
  logo: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginVertical: 20,
  },
  // Logo alternativo más grande
  logocm: {
    width: 250,
    height: 250,
    alignSelf: 'center',
    marginVertical: 20,
  },
  // Título principal
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2d3436',
    marginBottom: 10,
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  // Subtítulo o descripción
  subtitle: {
    fontSize: 16,
    color: '#636e72',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
    letterSpacing: 0.5,
  },
  // Botón principal
  button: {
    backgroundColor: '#004989',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 36,
    marginTop: 10,
    shadowColor: '#004989',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  // Texto del botón
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1, // Espaciado entre letras
  },
});