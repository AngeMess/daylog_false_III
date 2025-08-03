import React from 'react';

/**
 * Componente de título principal (H1) personalizable
 * 
 * Este componente renderiza un título de nivel 1 con estilos personalizables.
 * Puede renderizarse como un elemento h1 o span según la prop asSpan.
 * Utiliza el sistema de colores de DayLog por defecto.
 * Por defecto muestra "Proyectos", pero acepta cualquier texto personalizado.
 * 
 * @param {string} text - Texto a mostrar en el título (por defecto: "Proyectos")
 * @param {string} color - Color del texto (por defecto: "#01426A")
 * @param {string} className - Clases CSS adicionales
 * @param {boolean} asSpan - Si debe renderizarse como span en lugar de h1
 * 
 * @examples
 * // Título por defecto
 * <CustomHeading />
 * 
 * // Título personalizado (tiene prioridad sobre el defecto)
 * <CustomHeading text="Dashboard Principal" />
 * 
 * // Título personalizado con color
 * <CustomHeading 
 *   text="Gestión de Empleados" 
 *   color="#194167" 
 * />
 * 
 * // Título como span con clases adicionales
 * <CustomHeading 
 *   text="Sección Importante" 
 *   color="#2C85BC"
 *   className="mb-4 text-center"
 *   asSpan={true}
 * />
 * 
 * // Si no pasas text, muestra "Proyectos"
 * <CustomHeading color="#ff0000" />
 * 
 * // Si pasas text, tiene prioridad sobre "Proyectos"
 * <CustomHeading text="Mi Título Personalizado" />
 */
const CustomHeading = ({ 
  text = "Proyectos", 
  color = "#01426A",
  className = "",
  asSpan = false
}) => {
  const Component = asSpan ? 'span' : 'h1';
  
  return (
    <Component 
      className={`text-3xl font-bold ${className}`}
      style={{ color: color }}
      title={text} // Añade tooltip con el texto completo
    >
      {text}
    </Component>
  );
};

export default CustomHeading;