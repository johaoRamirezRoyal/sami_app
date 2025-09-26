import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Guarda los datos de la sesión (usuario y token) en AsyncStorage.
 * @param {Object} usuario - Objeto con los datos del usuario.
 * @param {string} token - Token de autenticación.
 */
const guardarSesion = async (usuario, token) => {
  try {
    await AsyncStorage.setItem('@usuario', JSON.stringify(usuario));
    await AsyncStorage.setItem('@token', token);
  } catch (error) {
    console.error('Error al guardar la sesión:', error);
  }
};

/**
 * Obtiene los datos de la sesión almacenados en AsyncStorage.
 * @returns {Object|null} Objeto con usuario, token y mensaje, o null si hay error.
 */
const obtenerSesion = async () => {
  try {
    const usuario = await AsyncStorage.getItem('@usuario');
    const token = await AsyncStorage.getItem('@token');
    return {
      usuario: usuario ? JSON.parse(usuario) : null,
      token: token || null,
      message: 'Sesión obtenida correctamente'
    };
  } catch (error) {
    console.error('Error al obtener la sesión:', error);
    return null;
  }
};

/**
 * Elimina los datos de la sesión del almacenamiento (cierra sesión).
 */
const cerrarSesion = async () => {
  try {
    await AsyncStorage.removeItem('@usuario');
    await AsyncStorage.removeItem('@token');
    console.log('Sesión cerrada correctamente');
  } catch (error) {
    console.error('Error al cerrar la sesión:', error);
  }
};

/**
 * Realiza el login del usuario, guarda la sesión si es exitoso.
 * @param {string} email - Email del usuario.
 * @param {string} password - Contraseña del usuario.
 * @param {string} urlLogin - URL del endpoint de login.
 * @returns {Object} Resultado del login (success, usuario, token, error).
 */
const login = async (email, password, urlLogin = 'URL_LOGIN') => {
  try {
    const respuesta = await fetch(urlLogin, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await respuesta.json();

    if (respuesta.ok) {
      await guardarSesion(data.usuario, data.token);
      return { success: true, usuario: data.usuario, token: data.token };
    } else {
      return { success: false, error: data.error || 'Login fallido' };
    }
  } catch (error) {  
    console.error('Error en login:', error);
    return { success: false, error: error.message };
  }
};

export { guardarSesion, obtenerSesion, login, cerrarSesion };