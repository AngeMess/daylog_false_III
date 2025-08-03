/**
 * Componente PortfolioDashboardChart - Gráfico de actividades para dashboard de portfolio
 * 
 * Este componente muestra un gráfico de barras que visualiza las actividades realizadas
 * por mes en el dashboard de portfolio. Incluye funcionalidades de datos en tiempo real
 * y diseño responsivo con elementos decorativos.
 * 
 * Funcionalidades:
 * - Gráfico de barras verticales con colores dinámicos
 * - Indicador de datos en tiempo real (LIVE)
 * - Tooltips interactivos con información detallada
 * - Validación robusta de datos de entrada
 * - Elementos decorativos de fondo
 * 
 * Datos mostrados:
 * - Actividades por mes
 * - Resaltado de la barra más alta
 * - Información contextual en tooltips
 * - Estadísticas de rendimiento
 * 
 * Características:
 * - Diseño responsivo y accesible
 * - Colores corporativos consistentes
 * - Animaciones suaves con Framer Motion
 * - Manejo de datos faltantes o inválidos
 * - Elementos decorativos futuristas
 * - Integración con el sistema de diseño corporativo
 */

import React from 'react';
import { ResponsiveBar } from '@nivo/bar';

const PortfolioDashboardChart = ({ data, height = 320, showLive = false }) => {
  // Validar que los datos existan y estén correctamente formateados
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden flex flex-col flex-1 min-h-0">
        <div className="flex items-center justify-between mb-6 relative z-10">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Actividades por mes</h3>
          {showLive && (
            <div className="px-3 py-1 bg-gradient-to-r from-[#3182CE]/10 to-[#3182CE]/5 rounded-full border border-[#3182CE]/20 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#3182CE] rounded-full animate-pulse"></span>
              <span className="text-xs font-medium text-[#3182CE]">LIVE</span>
            </div>
          )}
        </div>
        <div className="flex-1 min-h-0 w-full relative z-10 flex items-center justify-center">
          <p className="text-gray-500">No hay datos disponibles</p>
        </div>
      </div>
    );
  }

  // Filtrar datos válidos (con month y value definidos y value numérico)
  const validData = data.filter(item => 
    item && 
    typeof item.month !== 'undefined' && 
    typeof item.value !== 'undefined' && 
    !isNaN(Number(item.value))
  );

  if (validData.length === 0) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden flex flex-col flex-1 min-h-0">
        <div className="flex items-center justify-between mb-6 relative z-10">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Actividades por mes</h3>
          {showLive && (
            <div className="px-3 py-1 bg-gradient-to-r from-[#3182CE]/10 to-[#3182CE]/5 rounded-full border border-[#3182CE]/20 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#3182CE] rounded-full animate-pulse"></span>
              <span className="text-xs font-medium text-[#3182CE]">LIVE</span>
            </div>
          )}
        </div>
        <div className="flex-1 min-h-0 w-full relative z-10 flex items-center justify-center">
          <p className="text-gray-500">No hay datos válidos disponibles</p>
        </div>
      </div>
    );
  }

  // Encontrar el valor máximo para resaltar la barra más alta
  const maxValue = Math.max(...validData.map(item => Number(item.value)));

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden flex flex-col flex-1 min-h-0">
      {/* Decoraciones de fondo tipo supervisor pero en azul */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#3182CE]/20 to-transparent rounded-full blur-2xl"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#3182CE]/15 to-transparent rounded-full blur-xl"></div>
      <div className="absolute top-4 right-4 w-16 h-px bg-gradient-to-r from-transparent via-[#3182CE] to-transparent"></div>
      <div className="absolute bottom-4 left-4 w-12 h-px bg-gradient-to-r from-[#3182CE] via-[#3182CE]/50 to-transparent"></div>
      <div className="flex items-center justify-between mb-6 relative z-10">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Actividades por mes</h3>
        {showLive && (
          <div className="px-3 py-1 bg-gradient-to-r from-[#3182CE]/10 to-[#3182CE]/5 rounded-full border border-[#3182CE]/20 flex items-center gap-2">
            <span className="w-2 h-2 bg-[#3182CE] rounded-full animate-pulse"></span>
            <span className="text-xs font-medium text-[#3182CE]">LIVE</span>
          </div>
        )}
      </div>
      <div className="flex-1 min-h-0 w-full relative z-10">
        <ResponsiveBar
          data={validData}
          keys={['value']}
          indexBy="month"
          margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
          padding={0.4}
          valueScale={{ type: 'linear' }}
          indexScale={{ type: 'band', round: true }}
          layout="vertical"
          colors={({ data }) => Number(data.value) === maxValue ? '#01426A' : '#3182CE'}
          borderRadius={6}
          borderWidth={0}
          axisBottom={{
            tickSize: 0,
            tickPadding: 12,
            tickRotation: -30,
            legend: '',
            legendOffset: 40,
            legendPosition: 'middle',
            tickComponent: ({ value, ...props }) => (
              <text
                {...props}
                style={{
                  fontSize: '12px',
                  fill: '#6B7280',
                  fontFamily: 'Montserrat, Inter, sans-serif'
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
                  fontFamily: 'Montserrat, Inter, sans-serif'
                }}
              >
                {value}
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
                  fontFamily: 'Montserrat, Inter, sans-serif'
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
                fontFamily: 'Montserrat, Inter, sans-serif',
                border: '1px solid #E5E7EB'
              }
            }
          }}
          tooltip={({ data }) => (
            <div className="bg-white rounded-lg shadow-lg p-3 border border-gray-200">
              <div className="font-semibold text-gray-800">{data.month}</div>
              <div className="text-sm text-gray-600">
                Actividades: <span className="font-medium">{data.value}</span>
              </div>
            </div>
          )}
          animate={true}
          motionStiffness={90}
          motionDamping={15}
        />
      </div>
    </div>
  );
};

export default PortfolioDashboardChart; 