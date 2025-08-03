import React from 'react';
import { CheckCircle, AlertTriangle, Hand } from 'lucide-react';

/**
 * Componente de alerta reutilizable con diferentes tipos y posiciones
 * 
 * Este componente muestra mensajes de alerta con diferentes estilos según el tipo
 * (error, success, warning, info) y puede posicionarse en diferentes lugares de la pantalla.
 * Incluye animaciones y iconos específicos para cada tipo de alerta.
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.alert - Objeto con la información de la alerta
 * @param {string} props.alert.type - Tipo de alerta ('error', 'success', 'warning', 'info')
 * @param {string} props.alert.message - Mensaje a mostrar en la alerta
 * @param {string} [props.className=''] - Clases CSS adicionales
 * @param {string} [props.position='bottom-center'] - Posición de la alerta en la pantalla
 * @returns {JSX.Element|null} El componente Alert renderizado o null si no hay alerta
 * 
 * @example
 * // Alerta de éxito en la parte inferior central
 * <Alert 
 *   alert={{ type: 'success', message: 'Operación completada exitosamente' }}
 *   position="bottom-center"
 * />
 * 
 * // Alerta de error en la esquina superior derecha
 * <Alert 
 *   alert={{ type: 'error', message: 'Ha ocurrido un error' }}
 *   position="top-right"
 * />
 */
const Alert = ({ alert, className = "", position = "bottom-center" }) => {
  if (!alert) return null;

  /**
   * Obtiene los estilos CSS según el tipo de alerta
   * @param {string} type - Tipo de alerta
   * @returns {string} Clases CSS para el tipo específico
   */
  const getAlertStyles = (type) => {
    switch (type) {
      case 'error':
        return 'bg-red-100 text-red-600';
      case 'success':
        return 'bg-[#A3D9A5] text-[#065F46]';
      case 'warning':
        return 'bg-yellow-100 text-yellow-700';
      case 'info':
        return 'bg-blue-100 text-blue-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  /**
   * Obtiene el icono correspondiente al tipo de alerta
   * @param {string} type - Tipo de alerta
   * @returns {JSX.Element} Icono de Lucide React
   */
  const getAlertIcon = (type) => {
    switch (type) {
      case 'error':
        return <AlertTriangle size={20} />;
      case 'success':
        return <CheckCircle size={20} />;
      case 'warning':
        return <Hand size={20} />;
      case 'info':
        return <CheckCircle size={20} />;
      default:
        return <CheckCircle size={20} />;
    }
  };

  /**
   * Obtiene los estilos de posicionamiento según la posición especificada
   * @param {string} position - Posición deseada
   * @returns {string} Clases CSS para el posicionamiento
   */
  const getPositionStyles = (position) => {
    switch (position) {
      case 'top-center':
        return 'fixed top-4 left-1/2 transform -translate-x-1/2';
      case 'top-right':
        return 'fixed top-4 right-4';
      case 'bottom-center':
        return 'fixed bottom-4 left-1/2 transform -translate-x-1/2';
      case 'bottom-right':
        return 'fixed bottom-4 right-4';
      case 'inline': // Para mantener el comportamiento original
        return 'mt-6';
      default:
        return 'fixed bottom-4 left-1/2 transform -translate-x-1/2';
    }
  };

  return (
    <div 
      className={`px-6 py-4 rounded-xl flex items-center gap-3 text-sm font-medium shadow-lg z-50 
        ${getAlertStyles(alert.type)} 
        ${getPositionStyles(position)} 
        ${position !== 'inline' ? 'animate-slide-up' : ''} 
        ${className}`}
      style={{
        animation: position !== 'inline' ? 'slideUp 0.3s ease-out' : undefined
      }}
    >
      {getAlertIcon(alert.type)}
      <span>{alert.message}</span>
    </div>
  );
};

export default Alert;