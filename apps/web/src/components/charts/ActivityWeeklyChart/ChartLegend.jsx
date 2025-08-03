/**
 * Componente ChartLegend - Leyenda para gráficos de actividades
 * 
 * Este componente crea una leyenda visual que explica los elementos del gráfico
 * de actividades semanales. Muestra los colores y etiquetas correspondientes
 * a cada tipo de dato representado en el gráfico.
 * 
 * Elementos de la leyenda:
 * - Actividades actuales (color azul corporativo)
 * - Período anterior (color gris)
 * 
 * Características:
 * - Diseño responsivo que se adapta a móviles y desktop
 * - Colores consistentes con el gráfico principal
 * - Layout flexible según el espacio disponible
 * - Indicadores visuales claros con cuadrados de color
 * - Texto descriptivo para cada elemento
 */

import React from 'react';

const ChartLegend = ({ isMobile = false }) => {
  const legendItems = [
    { id: 'actividades', label: 'Actividades actuales', color: '#01426A' },
    { id: 'semanaAnterior', label: 'Período anterior', color: '#A0AEC0' }
  ];

  return (
    <div className={`flex ${isMobile ? 'flex-col space-y-2' : 'items-center space-x-4'}`}>
      {legendItems.map((item) => (
        <div key={item.id} className="flex items-center">
          <div
            className="w-3 h-3 rounded-sm mr-2"
            style={{ backgroundColor: item.color }}
          ></div>
          <span className="text-sm text-gray-600">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default ChartLegend;
