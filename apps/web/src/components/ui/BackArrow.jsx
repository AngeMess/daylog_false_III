import React from 'react';
import { ArrowLeft } from 'lucide-react';

/**
 * Componente de flecha de regreso reutilizable
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Function} props.onClick - Función a ejecutar cuando se hace clic en la flecha
 * @param {string} [props.className=''] - Clases CSS adicionales
 * @param {number} [props.size=24] - Tamaño del icono
 * @param {string} [props.color='text-gray-600'] - Color del icono
 * @returns {JSX.Element} El componente BackArrow
 */
const BackArrow = ({ 
  onClick, 
  className = '', 
  size = 24, 
  color = 'text-gray-600' 
}) => {
  return (
    <button 
      onClick={onClick}
      className={`mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors ${className}`}
      aria-label="Volver atrás"
    >
      <ArrowLeft size={size} className={color} />
    </button>
  );
};

export default BackArrow; 