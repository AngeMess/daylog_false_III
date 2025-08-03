import React, { createContext, useContext, useState } from 'react';

// Crear el contexto
const SessionTimeoutContext = createContext();

// Hook personalizado para usar el contexto
export const useSessionTimeoutContext = () => {
  const context = useContext(SessionTimeoutContext);
  if (!context) {
    throw new Error('useSessionTimeoutContext debe usarse dentro de un SessionTimeoutProvider');
  }
  return context;
};

// Proveedor del contexto
export const SessionTimeoutProvider = ({ children }) => {
  // Estado para controlar si la detección de inactividad está habilitada
  const [isTimeoutEnabled, setIsTimeoutEnabled] = useState(true);
  
  // Función para deshabilitar temporalmente la detección
  const disableTimeout = () => {
    console.log('Detección de inactividad DESHABILITADA');
    setIsTimeoutEnabled(false);
  };
  
  // Función para volver a habilitar la detección
  const enableTimeout = () => {
    console.log('Detección de inactividad HABILITADA');
    setIsTimeoutEnabled(true);
  };
  
  // Valor que se proporcionará a través del contexto
  const value = {
    isTimeoutEnabled,
    disableTimeout,
    enableTimeout
  };
  
  return (
    <SessionTimeoutContext.Provider value={value}>
      {children}
    </SessionTimeoutContext.Provider>
  );
};
