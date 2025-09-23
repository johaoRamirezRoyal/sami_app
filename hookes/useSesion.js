import { useState, useEffect } from 'react';
import { obtenerSesion } from '../components/sesion/sesion';

/**
 * Hook para obtener y manejar la sesión del usuario.
 * @param {number|null} perfilId - ID del perfil del usuario (opcional, para lógica adicional).
 * @returns {object|null} sesion - Datos de la sesión del usuario.
 */
export function useSesion(perfilId = null) {
  const [sesion, setSesion] = useState(null);

  useEffect(() => {
    const cargarSesion = async () => {
      const datosSesion = await obtenerSesion();
      setSesion(datosSesion);
      // Si necesitas usar perfilId para lógica adicional, agrégala aquí
    };
    cargarSesion();
  }, [perfilId]);

  return sesion;
}
