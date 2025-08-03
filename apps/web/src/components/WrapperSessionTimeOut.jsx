// components/SessionTimeoutWrapper.js
import React, { useEffect } from 'react';
import useSessionTimeout from '../hooks/useSessionTimeout.js';
import SessionTimeoutModal from './SessionTimeOutModel.jsx';
import { useAuth } from '../context/authContext';
import { useSessionTimeoutContext } from '../context/SessionTimeoutContext';

const SessionTimeoutWrapper = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const { isTimeoutEnabled } = useSessionTimeoutContext();
  const { 
    showWarning, 
    countdown, 
    continueSession, 
    handleLogout 
  } = useSessionTimeout();

  // Log para saber cuándo el wrapper se renderiza y el estado del timeout
  useEffect(() => {
    console.log(`SessionTimeoutWrapper renderizado - Timeout ${isTimeoutEnabled ? 'HABILITADO' : 'DESHABILITADO'}`);
    
    return () => {
      console.log('SessionTimeoutWrapper desmontado');
    };
  }, [isTimeoutEnabled]);

  // Log cuando cambia el estado de la advertencia
  useEffect(() => {
    if (showWarning) {
      console.log(`Modal de advertencia MOSTRADO - Countdown: ${countdown}s`);
    } else {
      console.log('Modal de advertencia OCULTO');
    }
  }, [showWarning, countdown]);

  return (
    <>
      {children}
      {isLoggedIn && (
        <SessionTimeoutModal
          isOpen={showWarning}
          countdown={countdown}
          onContinue={() => {
            console.log('Usuario eligió CONTINUAR sesión');
            continueSession();
          }}
          onLogout={() => {
            console.log('Usuario eligió CERRAR sesión');
            handleLogout();
          }}
        />
      )}
    </>
  );
};

export default SessionTimeoutWrapper;