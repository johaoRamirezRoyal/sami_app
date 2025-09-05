import { StyleSheet, Modal, TouchableWithoutFeedback } from 'react-native';


// Estilos principales de la pantalla de ayuda
export const styles = StyleSheet.create({
  // Contenedor raíz de la pantalla
  root: {
    flex: 1,
    backgroundColor: '#f5f8fa',
  },
  // Drawer flotante
  drawerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 100,
  },
  drawerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 260,
    height: '100%',
    backgroundColor: '#fff',
    elevation: 8,
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
  // Logo pequeño para la barra
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
  tabContent: {
    padding: 12,
  },
  h5: {
    fontSize: 18,
    color: '#222',
    marginBottom: 8,
  },
  bold: {
    fontWeight: 'bold',
    color: '#004989',
  },
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
  // Contenedor y estilos para el video
  videoContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    marginTop: 12,
    marginBottom: 12,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  webview: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },
  // Texto principal
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