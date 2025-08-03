import React from 'react';

/**
 * Componente de título secundario (H2) personalizable
 * 
 * Este componente renderiza un título de nivel 2 con estilos personalizables.
 * Incluye soporte para iconos opcionales y diferentes márgenes inferiores.
 * Utiliza el sistema de colores de DayLog por defecto.
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} [props.text='Título'] - Texto del título
 * @param {string} [props.color='#01426A'] - Color del texto (hexadecimal)
 * @param {string} [props.marginBottom='mb-3'] - Clase CSS para el margen inferior
 * @param {string} [props.className=''] - Clases CSS adicionales
 * @param {React.ReactNode} [props.icon=null] - Icono opcional a mostrar junto al título
 * @returns {JSX.Element} El componente TitleH2 renderizado
 * 
 * @example
 * // Título básico
 * <CustomHeadingH2 text="Cambia tu contraseña" />
 * 
 * // Título con icono
 * <CustomHeadingH2 
 *   text="Configuración de Perfil" 
 *   icon={<UserIcon />}
 *   color="#194167"
 * />
 * 
 * // Título con margen personalizado
 * <CustomHeadingH2 
 *   text="Sección de Proyectos" 
 *   marginBottom="mb-6"
 *   className="text-center"
 * />
 */
const CustomHeadingH2 = ({ 
  text = "Título", 
  color = "#01426A",
  marginBottom = "mb-3",
  className = "",
  icon = null
}) => {
  return (
    <h2 
      className={`text-4xl font-bold ${marginBottom} ${icon ? 'flex items-center gap-3' : ''} ${className}`}
      style={{ color: color }}
    >
      {icon && (
        <span style={{ color: color }}>
          {icon}
        </span>
      )}
      {text}
    </h2>
  );
};

export default CustomHeadingH2;