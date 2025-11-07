import { StyleSheet } from 'react-native';

export const stylespm = StyleSheet.create({
  // Contenedores y áreas principales
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#004989',
    marginBottom: 16,
    textAlign: 'center',
  },

  // Botones
  buttonPrimary: {
    backgroundColor: '#004989',
    borderRadius: 24,
    paddingHorizontal: 16,
  },
  buttonPrimaryLabel: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },

  // Modal
  modalContainer: {
    backgroundColor: 'white',
    paddingTop: 8,
    paddingBottom: 16,
    paddingHorizontal: 32,
    margin: 20,
    borderRadius: 16,
    justifyContent: 'flex-start',
    maxWidth: 600,
    minHeight: 500,
    alignSelf: 'center',
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  // Búsqueda
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    width: '100%',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    width: '100%',
  },
  searchInputInner: {
    flex: 1,
    position: 'relative',
  },
  searchLabel: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  searchInputBox: {
    borderWidth: 1,
    borderColor: '#b0b0b0',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#f5f5f5',
    paddingRight: 40,
  },
  searchIcon: {
    position: 'absolute',
    right: 10,
    top: '50%',
    marginTop: -14,
  },
  searchResults: {
    maxHeight: 70,
    marginBottom: 8,
  },
  searchResultItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  searchResultText: {
    fontSize: 18,
  },
  noResults: {
    marginBottom: 8,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 16,
    color: '#888',
  },

  // Inputs
  inputLabel: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  actividadLabel: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  actividadInput: {
    borderWidth: 1,
    borderColor: '#b0b0b0',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#f5f5f5',
    marginBottom: 8,
  },
  observacionLabel: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  observacionInput: {
    borderWidth: 1,
    borderColor: '#b0b0b0',
    borderRadius: 8,
    padding: 30,
    fontSize: 16,
    backgroundColor: '#f5f5f5',
    marginBottom: 8,
    textAlignVertical: 'top',
  },
  fechaLabel: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  fechaButton: {
    borderWidth: 1,
    borderColor: '#b0b0b0',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#f5f5f5',
    marginBottom: 8,
  },
  fechaText: {
    fontSize: 16,
  },

  // Sección de actividades
  actividadesSection: {
    marginTop: 5,
    marginBottom: 8,
    alignSelf: 'flex-start',
    width: '100%',
  },
  actividadesTitle: {
    color: '#004989',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'left',
    letterSpacing: 1,
  },
  actividadesDivider: {
    height: 1,
    backgroundColor: '#b0b0b0',
    marginTop: 4,
    borderRadius: 2,
    opacity: 0.7,
    width: '100%',
  },

  // Tabla
  tableScroll: {
    maxHeight: 500,
  },
  tableButton: {
    backgroundColor: '#004989',
    borderRadius: 18,
    paddingVertical: 2,
    paddingHorizontal: 10,
    elevation: 2,
    minWidth: 50,
  },
  tableButtonLabel: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 1,
  },

  // Modal aprobar tarea
  aprobarModal: {
    backgroundColor: 'white',
    padding: 24,
    margin: 20,
    borderRadius: 16,
    alignSelf: 'center',
    maxWidth: 500,
    minWidth: 280,
  },
  aprobarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#004989',
  },
  aprobarActividadInfo: {
    marginBottom: 16,
  },
  aprobarEvidenciaLabel: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  aprobarEvidenciaButton: {
    borderColor: '#004989',
    backgroundColor: '#e3f0fa',
  },
  aprobarEvidenciaButtonLabel: {
    color: '#004989',
    fontWeight: 'bold',
  },
  aprobarEvidenciaFile: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  aprobarEvidenciaFileText: {
    marginLeft: 6,
  },
  aprobarEvidenciaNone: {
    color: '#888',
    marginTop: 8,
  },
  aprobarFechaLabel: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  aprobarFechaButton: {
    borderWidth: 1,
    borderColor: '#b0b0b0',
    borderRadius: 8,
    padding: 8,
    backgroundColor: '#f9f9f9',
  },
  aprobarFechaText: {
    color: '#222',
  },
  aprobarEstadoLabel: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  aprobarEstadoPicker: {
    borderWidth: 1,
    borderColor: '#b0b0b0',
    borderRadius: 8,
  },
  aprobarObservacionLabel: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  aprobarObservacionInput: {
    borderWidth: 1,
    borderColor: '#b0b0b0',
    borderRadius: 8,
    padding: 16,
  },
  aprobarError: {
    color: 'red',
    marginBottom: 8,
  },
  aprobarActionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  aprobarGuardarButton: {
    borderRadius: 20,
    marginRight: 8,
  },
  aprobarCerrarButton: {
    borderRadius: 20,
    borderColor: '#004989',
  },

  // Actividades búsqueda
  actividadesSearchInput: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 40, // espacio para el icono
    paddingVertical: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  actividadesSearchIcon: {
    position: 'absolute',
    left: 12,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
});