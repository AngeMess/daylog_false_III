/**
 * Componente EmployeePerformanceChart - Gráfico de rendimiento de empleados para supervisores
 * 
 * Este componente muestra un gráfico de barras que visualiza el rendimiento de empleados
 * desde la perspectiva de un supervisor. Incluye horas trabajadas y actividades realizadas
 * con elementos decorativos futuristas y animaciones.
 * 
 * Funcionalidades:
 * - Gráfico de barras con colores dinámicos basados en rendimiento
 * - Tooltips interactivos con información detallada
 * - Indicador de datos en tiempo real
 * - Validación robusta de datos de entrada
 * - Elementos decorativos de fondo
 * 
 * Datos mostrados:
 * - Horas trabajadas por empleado
 * - Número de actividades realizadas
 * - Resaltado del empleado con mejor rendimiento
 * - Estadísticas totales y por empleado
 * 
 * Características:
 * - Diseño responsivo solo para pantallas medianas y grandes
 * - Colores corporativos con resaltado amarillo para mejor rendimiento
 * - Animaciones fluidas con Framer Motion
 * - Elementos decorativos futuristas
 * - Manejo de datos faltantes o inválidos
 * - Integración con el sistema de diseño corporativo
 */

import React from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { motion } from 'framer-motion';

const EmployeePerformanceChart = ({ data }) => {
  // Validar que los datos existan y estén correctamente formateados
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden hidden md:block"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Rendimiento de Empleados</h2>
        </div>
        <div className="h-80 flex items-center justify-center">
          <p className="text-gray-500">No hay datos disponibles</p>
        </div>
      </motion.div>
    );
  }

  // Filtrar datos válidos (con empleado, horasTrabajadas y actividades definidos y numéricos)
  const validData = data.filter(item => 
    item && 
    typeof item.empleado !== 'undefined' && 
    typeof item.horasTrabajadas !== 'undefined' && 
    typeof item.actividades !== 'undefined' && 
    !isNaN(Number(item.horasTrabajadas)) &&
    !isNaN(Number(item.actividades))
  );

  if (validData.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden hidden md:block"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Rendimiento de Empleados</h2>
        </div>
        <div className="h-80 flex items-center justify-center">
          <p className="text-gray-500">No hay datos válidos disponibles</p>
        </div>
      </motion.div>
    );
  }

  // Encontrar el valor máximo de horas trabajadas
  const maxHours = Math.max(...validData.map(item => Number(item.horasTrabajadas)));
  
  // Función para determinar el color de cada barra
  const getBarColor = (hours) => {
    return Number(hours) === maxHours ? '#FFC600' : '#000000';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden hidden md:block"
    >
      {/* Elementos decorativos futuristas */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#FFC600]/20 to-transparent rounded-full blur-2xl"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#FFC600]/15 to-transparent rounded-full blur-xl"></div>
      
      {/* Líneas decorativas */}
      <div className="absolute top-4 right-4 w-16 h-px bg-gradient-to-r from-transparent via-[#FFC600] to-transparent"></div>
      <div className="absolute bottom-4 left-4 w-12 h-px bg-gradient-to-r from-[#FFC600] via-[#FFC600]/50 to-transparent"></div>
      
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <h2 className="text-xl font-semibold text-gray-800">Rendimiento de Empleados</h2>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#FFC600] rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">En tiempo real</span>
        </div>
      </div>
      
      {/* Gráfica */}
      <div className="h-80 relative z-10">
        <ResponsiveBar
          data={validData}
          keys={['horasTrabajadas']}
          indexBy="empleado"
          margin={{ top: 20, right: 20, bottom: 80, left: 60 }}
          padding={0.4}
          valueScale={{ type: 'linear' }}
          indexScale={{ type: 'band', round: true }}
          colors={({ data }) => getBarColor(data.horasTrabajadas)}
          borderRadius={6}
          borderWidth={0}
          axisBottom={{
            tickSize: 0,
            tickPadding: 12,
            tickRotation: -45,
            legend: '',
            legendOffset: 50,
            legendPosition: 'middle',
            tickComponent: ({ value, ...props }) => (
              <text
                {...props}
                style={{
                  fontSize: '12px',
                  fill: '#6B7280',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                {value}
              </text>
            )
          }}
          axisLeft={{
            tickSize: 0,
            tickPadding: 8,
            tickRotation: 0,
            legend: '',
            legendOffset: -40,
            legendPosition: 'middle',
            tickComponent: ({ value, ...props }) => (
              <text
                {...props}
                style={{
                  fontSize: '12px',
                  fill: '#9CA3AF',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                {value}h
              </text>
            )
          }}
          enableGridX={false}
          enableGridY={true}
          gridYValues={5}
          enableLabel={false}
          theme={{
            grid: {
              line: {
                stroke: '#F3F4F6',
                strokeWidth: 1
              }
            },
            axis: {
              ticks: {
                text: {
                  fontSize: 12,
                  fill: '#9CA3AF',
                  fontFamily: 'Inter, sans-serif'
                }
              }
            },
            tooltip: {
              container: {
                background: 'white',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                borderRadius: '12px',
                color: '#374151',
                padding: '16px',
                fontSize: '14px',
                fontFamily: 'Inter, sans-serif',
                border: '1px solid #E5E7EB'
              }
            }
          }}
          tooltip={({ data }) => (
            <div className="bg-white rounded-lg shadow-lg p-3 border border-gray-200">
              <div className="font-semibold text-gray-800">{data.empleado}</div>
              <div className="text-sm text-gray-600">
                Horas trabajadas: <span className="font-medium">{data.horasTrabajadas}h</span>
              </div>
              <div className="text-sm text-gray-600">
                Actividades: <span className="font-medium">{data.actividades}</span>
              </div>
            </div>
          )}
          animate={true}
          motionStiffness={90}
          motionDamping={15}
        />
      </div>
      
      {/* Indicadores de rendimiento futuristas */}
      <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-100">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#FFC600] rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-500">Rendimiento alto</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-black rounded-full"></div>
            <span className="text-xs text-gray-500">Promedio</span>
          </div>
        </div>
        
        {/* Estadísticas rápidas */}
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-black">{validData.reduce((sum, item) => sum + Number(item.horasTrabajadas), 0)}h</div>
            <div className="text-xs text-gray-500">Total</div>
          </div>
          <div className="w-px h-8 bg-gray-200"></div>
          <div className="text-center">
            <div className="text-lg font-bold text-[#FFC600]">{validData.length}</div>
            <div className="text-xs text-gray-500">Empleados</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EmployeePerformanceChart; 