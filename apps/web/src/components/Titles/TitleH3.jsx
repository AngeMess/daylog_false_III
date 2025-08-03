import React from 'react';

/**
 * Componente de título terciario (H3) personalizable
 * 
 * Este componente renderiza un título de nivel 3 con estilos personalizables.
 * Utiliza un peso de fuente ligero por defecto, ideal para descripciones y subtítulos.
 * Puede personalizarse con diferentes colores y clases CSS adicionales.
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} [props.text='Empleados dentro de DayLog'] - Texto del título
 * @param {string} [props.color='#000'] - Color del texto (hexadecimal)
 * @param {string} [props.className=''] - Clases CSS adicionales
 * @returns {JSX.Element} El componente TitleH3 renderizado
 * 
 * @example
 * // Título básico
 * <CustomDescription text="Empleados dentro de DayLog" />
 * 
 * // Título con color personalizado
 * <CustomDescription 
 *   text="Información del Proyecto" 
 *   color="#194167"
 * />
 * 
 * // Título con clases adicionales
 * <CustomDescription 
 *   text="Detalles de la Actividad" 
 *   color="#2C85BC"
 *   className="mb-2 text-center"
 * />
 */
const CustomDescription = ({ 
  text = "Empleados dentro de DayLog", 
  color = "#000",
  className = ""
}) => {
  return (
    <h3 
      className={`text-l font-light ${className}`}
      style={{ color: color }}
    >
      {text}
    </h3>
  );
};

export default CustomDescription;