import { useState } from 'react';

const useAlert = (duration = 3000, defaultPosition = "bottom-center") => {
  const [alert, setAlert] = useState(null);

  const showAlert = (type, message, options = {}) => {
    const { 
      customDuration = duration, 
      position = defaultPosition,
      autoHide = true 
    } = options;

    setAlert({ 
      type, 
      message, 
      position 
    });
    
    if (autoHide && customDuration > 0) {
      setTimeout(() => setAlert(null), customDuration);
    }
  };

  const hideAlert = () => {
    setAlert(null);
  };

  // Funciones de conveniencia
  const showSuccess = (message, options = {}) => {
    showAlert('success', message, options);
  };

  const showError = (message, options = {}) => {
    showAlert('error', message, options);
  };

  const showWarning = (message, options = {}) => {
    showAlert('warning', message, options);
  };

  const showInfo = (message, options = {}) => {
    showAlert('info', message, options);
  };

  return {
    alert,
    showAlert,
    hideAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};

export default useAlert;