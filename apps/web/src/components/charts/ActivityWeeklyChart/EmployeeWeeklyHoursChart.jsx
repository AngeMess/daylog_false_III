/**
 * Componente EmployeeWeeklyHoursChart - Gráfico de barras para horas semanales de empleados
 * 
 * Este componente muestra un gráfico de barras que visualiza las horas trabajadas
 * por un empleado durante la semana. Cada barra representa un día y su altura
 * indica las horas trabajadas, con colores personalizados para cada día.
 * 
 * Funcionalidades:
 * - Gráfico de barras verticales con colores dinámicos
 * - Tooltips interactivos con información detallada
 * - Validación robusta de datos de entrada
 * - Escala fija de 0-8 horas para consistencia
 * - Estados de error y datos vacíos
 * 
 * Datos mostrados:
 * - Horas trabajadas por día de la semana
 * - Colores diferenciados para cada día
 * - Información contextual en tooltips
 * - Grid de referencia para mejor lectura
 * 
 * Características:
 * - Diseño responsivo y accesible
 * - Colores dinámicos basados en los datos
 * - Animaciones suaves de entrada
 * - Manejo de datos faltantes o inválidos
 * - Integración con el sistema de diseño corporativo
 */

import React from 'react';
import { ResponsiveBar } from '@nivo/bar';

const EmployeeWeeklyHoursChart = ({ data }) => {
  // Validar que los datos existan y estén correctamente formateados
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="h-80 -mx-2 flex items-center justify-center">
        <p className="text-gray-500">No hay datos disponibles</p>
      </div>
    );
  }

  // Filtrar datos válidos (con day, horas y color definidos y horas numérico)
  const validData = data.filter(item => 
    item && 
    typeof item.day !== 'undefined' && 
    typeof item.horas !== 'undefined' && 
    typeof item.color !== 'undefined' && 
    !isNaN(Number(item.horas))
  );

  if (validData.length === 0) {
    return (
      <div className="h-80 -mx-2 flex items-center justify-center">
        <p className="text-gray-500">No hay datos válidos disponibles</p>
      </div>
    );
  }

  return (
    <div className="h-80 -mx-2">
      <ResponsiveBar
        data={validData}
        keys={['horas']}
        indexBy="day"
        margin={{ top: 10, right: 20, bottom: 50, left: 60 }}
        padding={0.5}
        valueScale={{ type: 'linear' }}
        colors={({ data }) => data.color}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 0,
          tickPadding: 12,
          tickRotation: 0,
        }}
        axisLeft={{
          tickSize: 0,
          tickPadding: 8,
          tickRotation: 0,
        }}
        enableLabel={false}
        borderRadius={20}
        borderWidth={0}
        gridYValues={[0, 2, 4, 6, 8]}
        maxValue={8}
        theme={{
          grid: { line: { stroke: '#e5e7eb', strokeWidth: 1 } },
          axis: { ticks: { text: { fontSize: 12, fill: '#6b7280' } } }
        }}
        animate={true}
        motionStiffness={90}
        motionDamping={15}
        isInteractive={true}
        role="application"
        enableGridY={true}
        tooltip={({ data }) => (
          <div className="bg-white shadow-lg rounded-md p-2 border border-gray-100 min-w-[110px]">
            <div className="flex items-center mb-1">
              <div className="w-2 h-2 rounded-sm mr-2" style={{ backgroundColor: data.color }}></div>
              <span className="text-xs font-medium text-gray-700">{data.day}</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-lg font-bold text-[#01426A]">{data.horas}h</span>
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default EmployeeWeeklyHoursChart; 