import { useState, useEffect } from 'react';
import { permiso } from '../components/utils/permisos';

/**
 * Hook para verificar permisos de usuario
 * @param {number} idOpcion - ID de la opción de permiso
 * @param {number} idPerfil - ID del perfil del usuario
 * @returns {boolean} hasPermission - Resultado del permiso
 */
export function usePermiso(idOpcion, idPerfil) {
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    const verificarPermiso = async () => {
      if (idPerfil && idOpcion) {
        const permisoResultado = await permiso(idOpcion, idPerfil);
        setHasPermission(permisoResultado);
      }
    };
    verificarPermiso();
  }, [idOpcion, idPerfil]);

  return hasPermission;
}
