import { useState, useEffect } from 'react';
import { permiso } from '../components/utils/permisos';

/**
 * Hook para verificar permisos de usuario
 * @param {number} idOpcion - ID de la opción de permiso
 * @param {number} idPerfil - ID del perfil del usuario
 * @returns {boolean} hasPermission - Resultado del permiso
 */
export function usePermiso(idOpcion, idPerfil) {
  // Estado para almacenar si el usuario tiene permiso o no
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    // Función asíncrona para verificar el permiso
    const verificarPermiso = async () => {
      // Solo verifica si ambos parámetros están definidos
      if (idPerfil && idOpcion) {
        // Llama a la función permiso y actualiza el estado
        const permisoResultado = await permiso(idOpcion, idPerfil);
        setHasPermission(permisoResultado);
      }
    };
    // Ejecuta la verificación cuando cambian los parámetros
    verificarPermiso();
  }, [idOpcion, idPerfil]);

  // Retorna el resultado del permiso
  return hasPermission;
}
