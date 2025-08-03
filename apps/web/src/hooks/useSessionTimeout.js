import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import { useSessionTimeoutContext } from '../context/SessionTimeoutContext';

const useSessionTimeout = () => {
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [isActive, setIsActive] = useState(true);
  
  const { logOut, isLoggedIn } = useAuth();
  const { isTimeoutEnabled } = useSessionTimeoutContext();
  const navigate = useNavigate();
  
  const timeoutRef = useRef(null);
  const warningTimeoutRef = useRef(null);
  const countdownIntervalRef = useRef(null);
  
  // Configuración de timeouts (en milisegundos)
  const INACTIVITY_TIME = 25 * 60 * 1000; // 25 minutos
  const WARNING_TIME = 1 * 60 * 1000; // 1 minuto antes del logout
  const COUNTDOWN_START = 60; // 60 segundos de countdown

  // Reiniciar el timeout de inactividad
  const resetTimeout = useCallback(() => {
    if (!isTimeoutEnabled || !isLoggedIn) return;

    console.log('🔄 Reiniciando timeout de inactividad');
    
    // Limpiar timeouts existentes
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
    
    // Ocultar warning si está visible
    setShowWarning(false);
    setCountdown(COUNTDOWN_START);
    setIsActive(true);

    // Configurar timeout para mostrar warning
    warningTimeoutRef.current = setTimeout(() => {
      console.log('⚠️ Mostrando advertencia de timeout');
      setShowWarning(true);
      setCountdown(COUNTDOWN_START);
      
      // Iniciar countdown
      countdownIntervalRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            console.log('⏰ Tiempo agotado, cerrando sesión automáticamente');
            handleLogout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
    }, INACTIVITY_TIME - WARNING_TIME);

    // Configurar timeout para logout automático
    timeoutRef.current = setTimeout(() => {
      console.log('🚪 Logout automático por inactividad');
      handleLogout();
    }, INACTIVITY_TIME);
    
  }, [isTimeoutEnabled, isLoggedIn]);

  // Manejar logout
  const handleLogout = useCallback(async () => {
    console.log('🚪 Ejecutando logout...');
    
    // Limpiar todos los timeouts
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    
    setShowWarning(false);
    setIsActive(false);
    
    try {
      await logOut();
      navigate('/login');
    } catch (error) {
      console.error('Error durante logout:', error);
      // Forzar navegación al login incluso si hay error
      navigate('/login');
    }
  }, [logOut, navigate]);

  // Continuar sesión
  const continueSession = useCallback(() => {
    console.log('✅ Usuario decidió continuar la sesión');
    setShowWarning(false);
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
    resetTimeout();
  }, [resetTimeout]);

  // Manejar actividad del usuario
  const handleUserActivity = useCallback(() => {
    if (!isTimeoutEnabled || !isLoggedIn || !isActive) return;
    resetTimeout();
  }, [isTimeoutEnabled, isLoggedIn, isActive, resetTimeout]);

  // Configurar listeners de eventos
  useEffect(() => {
    if (!isTimeoutEnabled || !isLoggedIn) {
      console.log('🔇 Timeout deshabilitado o usuario no logueado');
      return;
    }

    console.log('🎧 Configurando listeners de actividad');
    
    const events = [
      'mousedown',
      'mousemove', 
      'keypress',
      'scroll',
      'touchstart',
      'click'
    ];

    // Agregar listeners
    events.forEach(event => {
      document.addEventListener(event, handleUserActivity, true);
    });

    // Inicializar timeout
    resetTimeout();

    // Cleanup
    return () => {
      console.log('🧹 Limpiando listeners y timeouts');
      
      events.forEach(event => {
        document.removeEventListener(event, handleUserActivity, true);
      });
      
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [isTimeoutEnabled, isLoggedIn, handleUserActivity, resetTimeout]);

  // Limpiar cuando se desmonta o cambia el estado de login
  useEffect(() => {
    if (!isLoggedIn) {
      console.log('👋 Usuario no logueado, limpiando timeouts');
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      setShowWarning(false);
      setIsActive(false);
    }
  }, [isLoggedIn]);

  return {
    showWarning,
    countdown,
    continueSession,
    handleLogout,
    resetTimeout
  };
};

export default useSessionTimeout; 