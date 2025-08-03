import React from 'react';

/**
 * Componente de subtítulo personalizable
 * 
 * Este componente renderiza un subtítulo con estilos personalizables.
 * Utiliza un tamaño de fuente xl y peso semibold, ideal para subtítulos de secciones.
 * Incluye soporte para diferentes colores y márgenes inferiores.
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} [props.text='Subtítulo'] - Texto del subtítulo
 * @param {string} [props.color='#01426A'] - Color del texto (hexadecimal)
 * @param {string} [props.marginBottom='mb-4'] - Clase CSS para el margen inferior
 * @param {string} [props.className=''] - Clases CSS adicionales
 * @returns {JSX.Element} El componente Subtitle renderizado
 * 
 * @example
 * // Subtítulo básico
 * <CustomSubtitle text="Cambia tu contraseña" />
 * 
 * // Subtítulo con color personalizado
 * <CustomSubtitle 
 *   text="Configuración de Seguridad" 
 *   color="#194167"
 * />
 * 
 * // Subtítulo con margen personalizado
 * <CustomSubtitle 
 *   text="Información Personal" 
 *   marginBottom="mb-6"
 *   className="text-center"
 * />
 */
const CustomSubtitle = ({ 
  text = "Subtítulo", 
  color = "#01426A",
  marginBottom = "mb-4",
  className = "",

}) => {
  return (
    <h2 
      className={`text-xl font-semibold ${marginBottom} ${className}`}
      style={{ color: color }}
    >
      {text}
    </h2>
  );
};

export default CustomSubtitle;