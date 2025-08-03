import React, { useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { lazyLoadConfig, lazyLoadWithRetry } from '../utils/lazyLoadConfig';

/**
 * Componente gestor de precarga de módulos según el rol del usuario
 *
 * Este componente se encarga de precargar (preload) componentes o módulos de la aplicación
 * de manera dinámica según el rol del usuario autenticado. Utiliza una configuración
 * centralizada para determinar qué componentes deben precargarse para cada rol, mejorando
 * la experiencia de usuario al reducir los tiempos de espera cuando navega por la app.
 *
 * No renderiza nada en pantalla, solo ejecuta lógica de precarga en segundo plano.
 *
 * @returns {null} No renderiza ningún elemento visual
 *
 * @example
 * // Uso típico en el layout principal
 * <PreloadManager />
 */
const PreloadManager = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    /**
     * Precarga los componentes según el rol del usuario usando la configuración global
     */
    const preloadComponents = async () => {
      try {
        const componentsToPreload = lazyLoadConfig.preloadByRole[user.role] || [];
        
        if (componentsToPreload.length > 0) {
          const preloadPromises = componentsToPreload.map(componentKey => {
            const importFn = lazyLoadConfig.chunks[componentKey];
            if (importFn) {
              return lazyLoadWithRetry(importFn);
            }
            return Promise.resolve();
          });

          await Promise.all(preloadPromises);
          console.log(`Preloaded ${componentsToPreload.length} components for role: ${user.role}`);
        }
      } catch (error) {
        console.warn('Error preloading components:', error);
      }
    };

    // Retrasa la precarga para no interferir con la carga inicial
    const timeoutId = setTimeout(preloadComponents, 3000);

    return () => clearTimeout(timeoutId);
  }, [user]);

  // Este componente no renderiza nada
  return null;
};

export default PreloadManager; 