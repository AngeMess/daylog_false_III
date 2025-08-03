
import React from 'react';

/**
 * Componente de párrafo con tarjeta de fondo
 * 
 * Este componente renderiza un párrafo de texto dentro de una tarjeta con fondo blanco.
 * Incluye sombra suave y bordes redondeados, ideal para mostrar información destacada.
 * El texto puede personalizarse con diferentes colores y clases CSS adicionales.
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} [props.content='LEGENDS'] - Contenido del párrafo
 * @param {string} [props.contentColor='#194167'] - Color del texto (hexadecimal)
 * @param {string} [props.className=''] - Clases CSS adicionales para la tarjeta
 * @returns {JSX.Element} El componente Paragraph renderizado
 * 
 * @example
 * // Párrafo básico
 * <Paragraph content="Sistema de Gestión" />
 * 
 * // Párrafo con color personalizado
 * <Paragraph 
 *   content="Información Importante" 
 *   contentColor="#374151"
 * />
 * 
 * // Párrafo con clases adicionales
 * <Paragraph 
 *   content="Descripción del Proyecto" 
 *   contentColor="#2C85BC"
 *   className="mb-4 border-l-4 border-blue-500"
 * />
 */
const Paragraph = ({ 
  content = "LEGENDS",
  contentColor = "#194167",
  className = ""
}) => {
  return (
    <div className={`bg-white rounded-xl p-6 shadow-sm ${className}`}>
      <p 
        className=""
        style={{ color: contentColor }}
      >
        {content}
      </p>
    </div>
  );
};

export default Paragraph;