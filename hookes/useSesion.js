import { useState, useEffect } from 'react';
import { obtenerSesion } from '../components/sesion/sesion';

/**
 * Hook para obtener y manejar la sesión del usuario.
 * @param {number|null} perfilId - ID del perfil del usuario (opcional, para lógica adicional).
 * @returns {object|null} sesion - Datos de la sesión del usuario.
 */
export function useSesion(perfilId = null) {
  // Estado local para almacenar los datos de la sesión
  const [sesion, setSesion] = useState(null);

  useEffect(() => {
    // Función asíncrona para cargar la sesión del usuario
    const cargarSesion = async () => {
      const datosSesion = await obtenerSesion(); // Llama a la función que obtiene la sesión
    //console.log('datosSesion:', datosSesion); // <-- Agrega este log
      setSesion(datosSesion); // Actualiza el estado con los datos obtenidos
      // Si necesitas usar perfilId para lógica adicional, agrégala aquí
    };
    cargarSesion(); // Ejecuta la función al montar el componente o cambiar perfilId
  }, [perfilId]); // Dependencia: se ejecuta cuando cambia perfilId

  return sesion; // Retorna los datos de la sesión
}
