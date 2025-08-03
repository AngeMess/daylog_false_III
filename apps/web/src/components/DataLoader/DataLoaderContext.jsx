/**
 * Componente DataLoaderContext - Proveedor de contexto para DataLoader
 * 
 * Este componente actúa como proveedor del contexto para el sistema DataLoader,
 * proporcionando acceso global a las funcionalidades de carga y gestión de datos
 * a través de React Context API.
 * 
 * Funcionalidades:
 * - Proveedor del contexto DataLoaderContext
 * - Integración con el hook useDataLoaderState
 * - Distribución global del estado de datos
 * - Acceso a funciones de manipulación de datos
 * 
 * Uso:
 * - Envuelve la aplicación o sección que necesita acceso a datos
 * - Permite que componentes hijos accedan al contexto via useDataLoader
 * - Mantiene el estado de datos sincronizado globalmente
 * 
 * Características:
 * - Integración transparente con React Context
 * - Reutilización del estado del DataLoader
 * - Acceso global a funcionalidades de datos
 * - Patrón de diseño Provider/Consumer
 */

import React from 'react';
import { DataLoaderContext, useDataLoaderState } from './dataLoaderState';

const DataLoaderProvider = ({ children }) => {
  const dataLoaderState = useDataLoaderState();

  return (
    <DataLoaderContext.Provider value={dataLoaderState}>
      {children}
    </DataLoaderContext.Provider>
  );
};

export default DataLoaderProvider;