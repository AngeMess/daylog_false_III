import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './authContext';

// Contexto para las notificaciones
const NotificationContext = createContext();

// Hook personalizado para usar el contexto de notificaciones
export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  
  // Obtener notificaciones del localStorage al iniciar
  const [notifications, setNotifications] = useState(() => {
    const savedNotifications = localStorage.getItem('notifications');
    return savedNotifications ? JSON.parse(savedNotifications) : [];
  });

  // Filtrar notificaciones por rol del usuario actual
  const getFilteredNotifications = () => {
    if (!user || !user.role) return [];
    
    return notifications.filter(notification => {
      // Si no tiene targetRoles o incluye 'all', mostrarla
      if (!notification.targetRoles || notification.targetRoles.includes('all')) {
        return true;
      }
      
      // Si incluye el rol del usuario actual, mostrarla
      return notification.targetRoles.includes(user.role);
    });
  };

  // Guardar notificaciones en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Comprobar y eliminar notificaciones más antiguas que una semana
  useEffect(() => {
    const cleanupOldNotifications = () => {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7); // Resta 7 días a la fecha actual
      
      setNotifications(prevNotifications => 
        prevNotifications.filter(notification => {
          if (!notification.createdAt) return true; // Si no tiene fecha, se mantiene
          
          const notificationDate = new Date(notification.createdAt);
          return notificationDate > oneWeekAgo; // Conserva solo notificaciones más nuevas que una semana
        })
      );
    };
    
    // Ejecutar al cargar el componente
    cleanupOldNotifications();
    
    // Configurar un intervalo para verificar periódicamente (cada 24 horas)
    const intervalId = setInterval(cleanupOldNotifications, 24 * 60 * 60 * 1000);
    
    // Limpiar el intervalo al desmontar
    return () => clearInterval(intervalId);
  }, []); // Dependencia vacía para ejecutarse solo al montar/desmontar

  // Añadir una nueva notificación con segmentación por roles
  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      isRead: false,
      targetRoles: ['all'], // Por defecto, visible para todos
      ...notification
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    return newNotification.id;
  };

  // Marcar una notificación como leída
  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true } 
          : notification
      )
    );
  };

  // Marcar todas las notificaciones como leídas
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  // Eliminar una notificación
  const removeNotification = (notificationId) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  // Obtener solo notificaciones no leídas (filtradas por rol)
  const getUnreadNotifications = () => {
    const filteredNotifications = getFilteredNotifications();
    return filteredNotifications.filter(notification => !notification.isRead);
  };

  const value = {
    notifications: getFilteredNotifications(), // Solo notificaciones filtradas por rol
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    getUnreadNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
