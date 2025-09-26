// Estilos para la pantalla de listado de inventario en React Native.
// Cada objeto define estilos para un componente o sección específica de la UI.

import { StyleSheet } from 'react-native';

export const stylesLis = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f6f6f6', // Fondo gris claro para toda la pantalla
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f6f6f6', // Fondo gris claro para el contenedor principal
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#004989', // Azul oscuro para el título
    textAlign: 'left',
    letterSpacing: 1,
    alignSelf: 'flex-start',
  },
  separator: {
    height: 2,
    backgroundColor: '#b0b0b0',
    marginBottom: 12,
    borderRadius: 2,
    opacity: 0.7,
    width: '100%',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  modalInput: {
    minHeight: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    padding: 8,
    marginBottom: 8,
  },
  cancelBtn: {
    marginRight: 16,
  },
  sendBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  // Estilos para las celdas de la cabecera de la tabla
  tableHeaderCell: {
    minWidth: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableHeaderCellDesc: {
    minWidth: 450,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableHeaderCellMarca: {
    minWidth: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableHeaderCellCantidad: {
    minWidth: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableHeaderCellEstado: {
    minWidth: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableHeaderCellOpcion: {
    minWidth: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  estadoBox: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: 'center',
    minWidth: 120,
  },
  reportBtn: {
    alignSelf: 'center',
    backgroundColor: '#e53935', // Rojo para el botón de reporte
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    minWidth: 120,
  },
  reportBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  paginationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    width: '100%',
  },
  paginationInner: {
    width: 300,
    maxWidth: '100%',
  },
  limitInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    marginBottom: 8,
    width: '100%',
  },
  limitInput: {
    borderWidth: 1,
    borderColor: '#b0b0b0',
    borderRadius: 6,
    width: 38,
    height: 28,
    textAlign: 'center',
    backgroundColor: '#fff',
    fontSize: 14,
    paddingVertical: 0,
    paddingHorizontal: 2,
  },
});