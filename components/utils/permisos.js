import { BASE_URL } from "../api/urlApi";

export const permiso = async (id_opcion, id_perfil) => {
    const url = `${BASE_URL}/permisos?id_opcion=${id_opcion}&perfil=${id_perfil}`;
    console.log('URL de permisos:', url); // Verifica la URL construida
    
    try {
        const response = await fetch(url, {});
        if (response.ok) {
            // Aquí se trae el true o false del permiso
            const result = await response.json(); 
            
            return result.permiso; // Devuelve true o false según el permiso
        } else {
            console.error('Error al obtener los permisos:', response.status, response.error);
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
        return false;
    }
};