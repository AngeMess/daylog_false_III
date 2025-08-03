// components/SessionTimeoutModal.js
import React from 'react';
import ConfirmationModal from './ui/ConfirmationModal';

const SessionTimeoutModal = ({ 
  isOpen, 
  countdown, 
  onContinue, 
  onLogout 
}) => {
  // Logs para depuración
  console.log('SessionTimeoutModal - isOpen:', isOpen);
  console.log('SessionTimeoutModal - countdown:', countdown);
  
  // Mensaje del modal con contador integrado
  const message = `Tu sesión se cerrará automáticamente en ${countdown} segundos por inactividad.`;

  return (
    <ConfirmationModal
      isOpen={isOpen}
      title="Sesión por expirar"
      message={message}
      warningText="¿Deseas continuar con tu sesión?"
      cancelButtonText="Cerrar sesión"
      confirmButtonText="Continuar sesión"
      confirmButtonColor="#4CAF50" // Verde para el botón de continuar
      onCancel={() => {
        console.log('Usuario eligió cerrar sesión');
        onLogout();
      }}
      onConfirm={() => {
        console.log('Usuario eligió continuar sesión');
        onContinue();
      }}
    />
  );
};

export default SessionTimeoutModal;