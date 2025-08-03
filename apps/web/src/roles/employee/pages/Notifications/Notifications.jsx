import React from 'react';
import CustomHeading from '../../../../components/Titles/TitleH1';
import CustomDescription from '../../../../components/Titles/TitleH3';
import { useNotifications } from '../../../../context/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { Trash2, Check } from 'lucide-react';

export default function Notifications() {
  const { notifications, markAsRead, markAllAsRead, removeNotification } = useNotifications();
  const navigate = useNavigate();

  const handleActionClick = (notification) => {
    markAsRead(notification.id);
    if (notification.projectId) {
      navigate(`/employee/proyectos/detalle-proyecto`); // Ajusta la ruta si usas IDs
    }
  };

  const deleteAllReadNotifications = () => {
    notifications.forEach(notification => {
      if (notification.isRead) {
        removeNotification(notification.id);
      }
    });
  };

  const hasReadNotifications = notifications.some(notification => notification.isRead);

  return (
    <div>
      <CustomHeading 
        text="Notificaciones"    
        color="#01426A" 
      />
      <div className="mt-6 mb-4 flex justify-between items-center">
        <div></div>
        {notifications.length > 0 && (
          <div className="flex gap-3 ml-auto">
            <button 
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
              onClick={markAllAsRead}
            >
              <Check className="w-4 h-4" /> Marcar todas como leídas
            </button>
            {hasReadNotifications && (
              <button 
                className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm font-medium"
                onClick={deleteAllReadNotifications}
              >
                <Trash2 className="w-4 h-4" /> Eliminar leídas
              </button>
            )}
          </div>
        )}
      </div>
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div 
            key={notification.id} 
            className={`border rounded-lg shadow-sm p-4 ${notification.isRead ? 'bg-white' : 'bg-blue-50 border-blue-200 '}`}
          >
            <div className="flex justify-between">
              <div className="font-medium">{notification.title}</div>
              <button 
                className="text-gray-400 hover:text-gray-600"
                onClick={() => removeNotification(notification.id)}
                title={notification.isRead ? 'Eliminar notificación' : 'Cerrar notificación'}
              >
                <span className="sr-only">{notification.isRead ? 'Eliminar' : 'Cerrar'}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-gray-600 mt-1">{notification.message}</p>
            <div className="mt-2">
              <button 
                onClick={() => handleActionClick(notification)} 
                className="text-blue-600 hover:text-blue-800 text-sm font-medium underline"
              >
                {notification.actionText || "Ver detalles"}
              </button>
            </div>
          </div>
        ))}
        {notifications.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600">No tienes notificaciones pendientes.</p>
          </div>
        )}
      </div>
    </div>
  );
}
