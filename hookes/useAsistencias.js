import { useState, useEffect } from 'react';
import { BASE_URL } from '../components/api/urlApi';

export function useAsistencias(sesion, perfil_id) {
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
  }, [sesion, perfil_id]);

  return asistencias;
}
