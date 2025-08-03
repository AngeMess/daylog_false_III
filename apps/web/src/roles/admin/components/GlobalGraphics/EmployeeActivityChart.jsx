// =================================================================
// EmployeeActivityChart - Componente moderno para mostrar actividad de empleados
// =================================================================
// Este componente muestra información sobre empleados destacados con un diseño
// moderno y minimalista, utilizando elementos visuales de Nivo para mejorar
// la presentación de datos de rendimiento.
// =================================================================

import React from 'react';
import { motion as Motion } from 'framer-motion';
import { ResponsiveBar } from '@nivo/bar';

const EmployeeActivityChart = ({ title, name, isPositive, value }) => {
  // Validar que los valores existan y sean numéricos
  const validValue = typeof value === 'number' && !isNaN(value) ? value : (isPositive ? 85 : 35);
  
  // Datos para el mini gráfico de barras
  const chartData = [
    {
      id: 'current',
      value: validValue,
      color: isPositive ? '#10B981' : '#EF4444'
    },
    {
      id: 'average',
      value: 50,
      color: '#E5E7EB'
    }
  ];

  return (
    <Motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden"
    >
      {/* Elementos decorativos */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-100 to-transparent rounded-full blur-xl"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-red-100 to-transparent rounded-full blur-lg"></div>
      
      {/* Contenido principal */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            <p className="text-sm text-gray-600">{name}</p>
          </div>
          <div className={`text-2xl font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {validValue}%
          </div>
        </div>
        
        {/* Mini gráfico de barras */}
        <div className="w-24 h-10">
          <ResponsiveBar
            data={chartData}
            keys={['value']}
            indexBy="id"
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            padding={0.3}
            layout="horizontal"
            valueScale={{ type: 'linear' }}
            indexScale={{ type: 'band', round: true }}
            colors={{ datum: 'data.color' }}
            borderRadius={2}
            enableGridY={false}
            enableGridX={false}
            axisTop={null}
            axisRight={null}
            axisBottom={null}
            axisLeft={null}
            enableLabel={false}
            animate={true}
            motionConfig="gentle"
            isInteractive={false}
          />
        </div>
      </div>
      
      {/* Indicador de tendencia */}
      <div className="mt-3 flex items-center">
        <div className={`text-xs font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {isPositive ? '+12%' : '-8%'} 
          <span className="text-gray-500 ml-1">vs. promedio</span>
        </div>
      </div>
    </Motion.div>
  );
};

export default EmployeeActivityChart;
