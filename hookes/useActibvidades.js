import { useState, useEffect } from 'react';
import { BASE_URL } from '../components/api/urlApi';

/**
 * Hook personalizado para obtener las asistencias del día de hoy.
 * 
 * @param {string} sesion - Token o identificador de sesión del usuario.
 * @param {string|number} perfil_id - ID del perfil del usuario.
 * @returns {Array} actividades - Lista de actividades obtenidas del backend.
 *
 * Este hook realiza una petición al endpoint de actividades del día actual
 * cuando cambian los valores de 'sesion' o 'perfil_id'.
 */
export function useActividades(sesion, perfil_id, refresh) {
  const [actividades, setActividades] = useState([]);

  useEffect(() => {
    if (!sesion || !perfil_id) return;
    const fetchActividades = async () => {
      try {
        const response = await fetch(`${BASE_URL}/actividades_mensajero/`);
        const data = await response.json();
        setActividades(data);
        //console.log('Actividades recibidas:', data); // Muestra en consola
      } catch (error) {
        console.error('Error al obtener actividades:', error);
      }
    };
    fetchActividades();
  }, [sesion, perfil_id, refresh]);

  return actividades;
}
