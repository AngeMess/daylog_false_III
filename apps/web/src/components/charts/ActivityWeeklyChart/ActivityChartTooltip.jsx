/**
 * Componente ActivityChartTooltip - Tooltip personalizado para gráficos de actividades
 * 
 * Este componente crea un tooltip personalizado que se muestra al hacer hover sobre
 * las barras del gráfico de actividades semanales. Muestra información contextual
 * de manera clara y visualmente atractiva.
 * 
 * Información mostrada:
 * - Etiqueta del tipo de dato (Actividades o Período anterior)
 * - Valor numérico destacado
 * - Día de la semana
 * - Indicador de color correspondiente
 * 
 * Características:
 * - Diseño responsivo con tamaños adaptativos para móviles
 * - Colores corporativos consistentes
 * - Sombras y bordes para mejor legibilidad
 * - Posicionamiento automático
 * - Animaciones suaves de entrada/salida
 */

import React from 'react';

const ActivityChartTooltip = ({ id, value, color, day, isMobile = false }) => {
  const label = id === 'actividades' ? 'Actividades' : 'Período anterior';

  return (
    <div className="bg-white shadow-lg rounded-md p-2 border border-gray-100" style={{ maxWidth: isMobile ? '150px' : '200px' }}>
      <div className="flex items-center mb-1">
        <div className="w-2 h-2 rounded-sm mr-2" style={{ backgroundColor: color }}></div>
        <span className="text-xs font-medium text-gray-700">{label}</span>
      </div>
      <div className="flex justify-between items-baseline">
        <span className="text-lg font-bold text-[#01426A]">{value}</span>
        <span className="text-xs text-gray-500 ml-1">{day}</span>
      </div>
    </div>
  );
};

export default ActivityChartTooltip;
