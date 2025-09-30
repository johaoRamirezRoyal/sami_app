import { BASE_URL } from "../api/urlApi"; // Importa la URL base de la API

/**
 * Consulta si un perfil tiene permiso para una opción específica.
 * @param {number|string} id_opcion - ID de la opción a consultar.
 * @param {number|string} id_perfil - ID del perfil del usuario.
 * @returns {Promise<boolean>} - Retorna true o false según el permiso.
 */
export const permiso = async (id_opcion, id_perfil) => {
    // Construye la URL para consultar los permisos
    const url = `${BASE_URL}/permisos?id_opcion=${id_opcion}&perfil=${id_perfil}`;
    //console.log('URL de permisos:', url); // Muestra la URL construida en consola para depuración
    
    try {
        // Realiza la petición a la API
        const response = await fetch(url, {});
        if (response.ok) {
            // Si la respuesta es exitosa, obtiene el resultado en formato JSON
            const result = await response.json(); 
            // Devuelve el valor del permiso (true o false)
            return result.permiso;
        } else {
            // Si la respuesta no es exitosa, muestra el error en consola
            console.error('Error al obtener los permisos:', response.status, response.error);
        }
    } catch (error) {
        // Captura y muestra cualquier error de la solicitud
        console.error('Error en la solicitud:', error);
        return false; // Retorna false en caso de error
    }
};