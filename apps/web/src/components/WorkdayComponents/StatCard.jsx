import React from 'react';

/**
 * Componente de tarjeta de estadísticas
 * 
 * Este componente renderiza una tarjeta que muestra una estadística con su etiqueta,
 * valor principal y opcionalmente una subetiqueta. Ideal para mostrar métricas
 * y KPIs en dashboards y reportes.
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.label - Etiqueta o título de la estadística
 * @param {string|number} props.value - Valor principal de la estadística
 * @param {string} [props.sublabel] - Subetiqueta opcional (ej: unidad de medida)
 * @returns {JSX.Element} El componente StatCard renderizado
 * 
 * @example
 * // Estadística básica
 * <StatCard 
 *   label="Horas trabajadas" 
 *   value="42" 
 * />
 * 
 * // Estadística con subetiqueta
 * <StatCard 
 *   label="Proyectos activos" 
 *   value="8" 
 *   sublabel="proyectos"
 * />
 * 
 * // Estadística con valor numérico
 * <StatCard 
 *   label="Eficiencia" 
 *   value="95" 
 *   sublabel="%"
 * />
 */
const StatCard = ({ label, value, sublabel }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 flex flex-col justify-between h-full">
    <div className="text-gray-600 text-sm">{label}</div>
    <div className="flex items-end mt-2">
      <div className="text-gray-800 text-4xl font-bold leading-none">{value}</div>
      {sublabel && <div className="text-gray-500 text-sm ml-2 mb-1">{sublabel}</div>}
    </div>
  </div>
);

export default StatCard; 