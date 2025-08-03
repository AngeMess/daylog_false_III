/**
 * Componente EmployeePerformanceLineChart - Gráfico de líneas para rendimiento de empleados
 * 
 * Este componente muestra un gráfico de líneas que visualiza el rendimiento de empleados
 * a lo largo del tiempo, mostrando las horas trabajadas en diferentes períodos.
 * Utiliza la librería Nivo para crear visualizaciones interactivas y responsivas.
 * 
 * Funcionalidades:
 * - Gráfico de líneas con área sombreada
 * - Tooltips interactivos con información detallada
 * - Validación de datos para evitar errores
 * - Cálculo automático del rango Y dinámico
 * - Estados de error y datos vacíos
 * 
 * Datos mostrados:
 * - Horas trabajadas por período
 * - Tendencia temporal del rendimiento
 * - Puntos de datos interactivos
 * - Información contextual en tooltips
 * 
 * Características:
 * - Diseño responsivo y accesible
 * - Colores corporativos consistentes
 * - Animaciones suaves
 * - Manejo robusto de datos faltantes
 * - Solo visible en pantallas grandes (hidden md:block)
 */

import React from 'react';
import { ResponsiveLine } from '@nivo/line';

const EmployeePerformanceLineChart = ({ data, period }) => {
  // Validar que los datos existan y estén correctamente formateados
  if (!data || !data[period] || !Array.isArray(data[period]) || data[period].length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8 hidden lg:block">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-700">Rendimiento {period === 'week' ? 'semanal' : 'mensual'}</h2>
        </div>
        <div className="w-full h-[350px] flex items-center justify-center">
          <p className="text-gray-500">No hay datos disponibles</p>
        </div>
      </div>
    );
  }

  // Filtrar datos válidos (con x e y definidos y numéricos)
  const validData = data[period].filter(item => 
    item && 
    typeof item.x !== 'undefined' && 
    typeof item.y !== 'undefined' && 
    !isNaN(Number(item.y))
  );

  if (validData.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8 hidden lg:block">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-700">Rendimiento {period === 'week' ? 'semanal' : 'mensual'}</h2>
        </div>
        <div className="w-full h-[350px] flex items-center justify-center">
          <p className="text-gray-500">No hay datos válidos disponibles</p>
        </div>
      </div>
    );
  }

  // Calcular el máximo dinámicamente basado en los datos válidos
  const maxValue = Math.max(...validData.map(item => Number(item.y)));
  const yMax = Math.ceil(maxValue * 1.2); // 20% más del máximo para dar espacio

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8 hidden lg:block">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-700">Rendimiento {period === 'week' ? 'semanal' : 'mensual'}</h2>
      </div>
      <div className="w-full h-[350px]">
        <ResponsiveLine
          data={[
            {
              id: period === 'week' ? 'Horas trabajadas' : 'Total horas',
              color: '#FFC600',
              data: validData
            }
          ]}
          theme={{
            axis: {
              ticks: { text: { fontSize: 12, fill: '#718096' } },
              legend: { text: { fontSize: 12, fill: '#4A5568' } }
            },
            grid: { line: { stroke: '#E2E8F0', strokeWidth: 1 } },
            tooltip: {
              container: {
                background: '#fffbe6',
                color: '#374151',
                fontSize: 13,
                borderRadius: 6,
                boxShadow: '0 3px 8px rgba(0,0,0,0.08)',
                border: '1px solid #FFC600',
                padding: '10px 14px'
              }
            }
          }}
          margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
          xScale={{ type: 'point' }}
          yScale={{ type: 'linear', min: 0, max: yMax, stacked: false }}
          curve="monotoneX"
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legendOffset: 36,
            legendPosition: 'middle'
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legendOffset: -40,
            legendPosition: 'middle'
          }}
          colors={['#FFC600']}
          pointSize={8}
          pointColor="#FFC600"
          pointBorderWidth={2}
          pointBorderColor="#FFC600"
          pointLabelYOffset={-12}
          useMesh={true}
          enableArea={true}
          areaOpacity={0.08}
          enableSlices="x"
          crosshairType="bottom"
          legends={[]}
          tooltip={({ point }) => (
            <div className="bg-white border border-[#000000] rounded-lg shadow-lg p-3">
              <div className="font-semibold text-gray-800">{point.data.x}</div>
              <div className="text-sm text-gray-600">
                Horas trabajadas <span className="font-medium text-[#FFC600]">{point.data.y}h</span>
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default EmployeePerformanceLineChart; 