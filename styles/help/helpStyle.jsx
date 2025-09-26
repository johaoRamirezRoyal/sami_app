import { StyleSheet, Modal, TouchableWithoutFeedback } from 'react-native';


// Estilos principales de la pantalla de ayuda
export const styles = StyleSheet.create({
  // Contenedor raíz de la pantalla de ayuda
  root: {
    flex: 1,
    backgroundColor: '#f5f8fa', // Fondo claro
  },
  // Fondo semitransparente para el drawer flotante
  drawerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)', // Oscurece el fondo
    zIndex: 100,
  },
  // Contenedor lateral del drawer
  drawerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 260,
    height: '100%',
    backgroundColor: '#fff',
    elevation: 8, // Sombra en Android
    zIndex: 101,
    paddingTop: 40,
  },
  // Barra de navegación superior flotante
  appbar: {
    backgroundColor: '#fff',
    elevation: 6,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    zIndex: 10,
  },
  // Logo pequeño para la barra superior
  logoBar: {
    width: 50,
    height: 50,
  },
  // Contenido central de la pantalla
  centerContent: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    width: '100%',
    paddingHorizontal: 12,
    paddingTop: 16,
  },
  // Contenido de cada tab/pestaña
  tabContent: {
    padding: 12,
  },
  // Título pequeño
  h5: {
    fontSize: 18,
    color: '#222',
    marginBottom: 8,
  },
  // Texto en negrita y color institucional
  bold: {
    fontWeight: 'bold',
    color: '#004989',
  },
  // Estilo para enlaces
  link: {
    color: '#1976d2',
    textDecorationLine: 'underline',
    fontSize: 18,
    marginTop: 12,
  },
  // Logo grande (no usado actualmente)
  logo: {
    width: 140,
    height: 140,
    marginBottom: 16,
  },
  // Contenedor para el video (YouTube, etc)
  videoContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    marginTop: 12,
    marginBottom: 12,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  // Estilo para el WebView del video
  webview: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },
  // Texto principal destacado
  text: {
    fontSize: 22,
    color: '#004989',
    fontWeight: 'bold',
    marginTop: 8,
  },
  // Nombre de perfil (no usado actualmente)
  profileName: {
    marginLeft: 8,
    fontSize: 16,
    color: '#004989',
    alignSelf: 'center',
  },
});