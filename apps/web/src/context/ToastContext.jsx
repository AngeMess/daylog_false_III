import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      type: 'info',
      duration: 3000,
      position: 'top-right-centered', // Posición por defecto actualizada
      showOnNextPage: false,
      closable: true,
      ...toast
    };

    setToasts(prev => [...prev, newToast]);

    // Auto-remove toast after duration (unless it's set to persist)
    if (newToast.duration > 0 && !newToast.showOnNextPage) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Funciones de conveniencia
  const showSuccess = useCallback((message, options = {}) => {
    return addToast({ type: 'success', message, ...options });
  }, [addToast]);

  const showError = useCallback((message, options = {}) => {
    return addToast({ type: 'error', message, ...options });
  }, [addToast]);

  const showWarning = useCallback((message, options = {}) => {
    return addToast({ type: 'warning', message, ...options });
  }, [addToast]);

  const showInfo = useCallback((message, options = {}) => {
    return addToast({ type: 'info', message, ...options });
  }, [addToast]);

  // Función especial para mostrar en la siguiente página
  const showOnNextPage = useCallback((type, message, options = {}) => {
    return addToast({ 
      type, 
      message, 
      showOnNextPage: true,
      duration: 3000, // Se auto-remove después de 3 segundos en la nueva página
      ...options 
    });
  }, [addToast]);

  // Función para activar toasts que esperan a la siguiente página
  const triggerNextPageToasts = useCallback(() => {
    setToasts(prev => prev.map(toast => {
      if (toast.showOnNextPage) {
        // Activar el auto-remove ahora que estamos en la nueva página
        if (toast.duration > 0) {
          setTimeout(() => {
            removeToast(toast.id);
          }, toast.duration);
        }
        return { ...toast, showOnNextPage: false };
      }
      return toast;
    }));
  }, [removeToast]);

  const value = {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showOnNextPage,
    triggerNextPageToasts
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
};