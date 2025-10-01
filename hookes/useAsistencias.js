import { useState, useEffect } from 'react';
import { BASE_URL } from '../components/api/urlApi';

/**
 * Hook personalizado para obtener las asistencias del día de hoy.
 * 
 * @param {string} sesion - Token o identificador de sesión del usuario.
 * @param {string|number} perfil_id - ID del perfil del usuario.
 * @returns {Array} asistencias - Lista de asistencias obtenidas del backend.
 * 
 * Este hook realiza una petición al endpoint de asistencias del día actual
 * cuando cambian los valores de 'sesion' o 'perfil_id'.
 */
export function useAsistencias(sesion, perfil_id, refresh) {
  const [asistencias, setAsistencias] = useState([]);

  useEffect(() => {
    if (!sesion || !perfil_id) return;
    const fetchAsistencias = async () => {
      try {
        const response = await fetch(`${BASE_URL}/asistencias_estudiantes/asistenciasDiaHoy`);
        const data = await response.json();
        setAsistencias(data);
      } catch (error) {
        console.error('Error al obtener asistencias:', error);
      }
    };
    fetchAsistencias();
  }, [sesion, perfil_id, refresh]);

  return asistencias;
}
