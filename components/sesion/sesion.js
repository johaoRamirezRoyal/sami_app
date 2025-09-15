import AsyncStorage from '@react-native-async-storage/async-storage';

// Función para guardar los datos de la sesión
const guardarSesion = async (usuario, token) => {
  try {
    await AsyncStorage.setItem('@usuario', JSON.stringify(usuario));
    await AsyncStorage.setItem('@token', token);
      
  } catch (error) {
    console.error('Error al guardar la sesión:', error);
  }
};



// Función para obtener los datos de la sesión
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



// Función para cerrar sesión
const cerrarSesion = async () => {
  try {
    await AsyncStorage.removeItem('@usuario');
    await AsyncStorage.removeItem('@token');
        console.log('Sesión cerrada correctamente');
  } catch (error) {
    console.error('Error al cerrar la sesión:', error);
  }
};



// Ejemplo de uso después de login exitoso
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