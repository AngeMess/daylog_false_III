import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import { ResponsiveLine } from '@nivo/line';
import CustomHeading from '../../../../components/Titles/TitleH1';
import { Card, CardContent, Stat } from '../../components/PerformancePortfolio';

// Datos para el gráfico de línea
const activitiesData = [
  {
    id: "actividades",
    color: "#3498db",
    data: [
      { x: "1", y: 65 },
      { x: "2", y: 35 },
      { x: "3", y: 50 },
      { x: "4", y: 55 },
      { x: "5", y: 52 },
      { x: "6", y: 75 },
      { x: "7", y: 58 },
      { x: "8", y: 95 },
      { x: "9", y: 78 },
      { x: "10", y: 58 },
      { x: "11", y: 52 },
      { x: "12", y: 15 }
    ]
  },
  {
    id: "rendimiento",
    color: "#2ecc71",
    data: [
      { x: "1", y: 45 },
      { x: "2", y: 60 },
      { x: "3", y: 68 },
      { x: "4", y: 70 },
      { x: "5", y: 72 },
      { x: "6", y: 85 },
      { x: "7", y: 98 },
      { x: "8", y: 68 },
      { x: "9", y: 75 },
      { x: "10", y: 72 },
      { x: "11", y: 85 },
      { x: "12", y: 88 }
    ]
  }
];

// Componente principal
export default function PerformancePortfolio() {
  // Estado para el selector del mes
  const [selectedMonth, setSelectedMonth] = useState("Este mes");

  // Estadísticas de horas laborales
  const workingHours = "3450h";
  
  // Validar y filtrar datos válidos para la gráfica
  const validActivitiesData = activitiesData.map(series => ({
    ...series,
    data: series.data.filter(item => 
      item && 
      typeof item.x !== 'undefined' && 
      typeof item.y !== 'undefined' && 
      !isNaN(Number(item.y))
    )
  })).filter(series => series.data.length > 0);

  // Calcular el total de actividades para la card LIVE
  const totalActivities = validActivitiesData.length > 0 
    ? validActivitiesData[0].data.reduce((acc, d) => acc + Number(d.y), 0)
    : 0;
  
  // Tema personalizado para el gráfico de línea
  const lineChartTheme = {
    axis: {
      ticks: {
        text: {
          fontSize: 12,
          fill: "#718096"
        }
      },
      legend: {
        text: {
          fontSize: 12,
          fill: "#4A5568"
        }
      }
    },
    grid: {
      line: {
        stroke: "#E2E8F0",
        strokeWidth: 1
      }
    },
    crosshair: {
      line: {
        stroke: "#CBD5E0",
        strokeWidth: 1,
        strokeOpacity: 0.75
      }
    },
    tooltip: {
      container: {
        background: "#1A202C",
        color: "white",
        fontSize: 12,
        borderRadius: 4,
        boxShadow: "0 3px 8px rgba(0,0,0,0.2)"
      }
    }
  };

  return (
    <div className="flex flex-col p-4 -mt-4 -mb-8 pb-12 h-auto md:h-screen">
      <CustomHeading 
        text="Rendimiento"    
        color="#01426A" 
      />
      {/* Cards de estadísticas siempre visibles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-6 mb-6 mt-6 px-1 md:px-0 min-h-[400px] md:min-h-0">
        <Card>
          <div className="flex items-center">
            <Clock size={20} className="text-blue-600 mr-2 md:mr-3" />
            <h2 className="text-sm md:text-lg font-semibold text-gray-700 truncate">Horas trabajadas</h2>
          </div>
          <CardContent className="flex justify-center pt-4 pb-2 md:pt-6 md:pb-4">
            <Stat value={workingHours} label="Este mes" />
          </CardContent>
        </Card>
        <Card>
          <div className="flex items-center">
            <Clock size={20} className="text-emerald-600 mr-2 md:mr-3" />
            <h2 className="text-sm md:text-lg font-semibold text-gray-700 truncate">Promedio diario</h2>
          </div>
          <CardContent className="flex justify-center pt-4 pb-2 md:pt-6 md:pb-4">
            <Stat value={"7.6h"} label="Horas/día" />
          </CardContent>
        </Card>
      </div>
      {/* Mobile: card especial de LIVE debajo de las cards */}
      <div className="block md:hidden mb-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden flex flex-col items-center">
          <div className="flex flex-col items-center w-full">
            <div className="text-lg font-semibold text-gray-700 mb-2">Mes actual</div>
            {/* Badge LIVE en columna debajo del mes */}
            <div className="flex flex-col items-center w-full mb-2">
              <div className="mt-1 px-3 py-1 bg-gradient-to-r from-[#3182CE]/10 to-[#3182CE]/5 rounded-full border border-[#3182CE]/20 flex items-center gap-2">
                <span className="w-2 h-2 bg-[#3182CE] rounded-full animate-pulse"></span>
                <span className="text-xs font-medium text-[#3182CE]">LIVE</span>
              </div>
            </div>
            <div className="text-5xl font-bold text-[#01426A]">
              {totalActivities}
            </div>
            <div className="text-sm text-gray-500 mt-1">Actividades este mes</div>
          </div>
        </div>
      </div>
      {/* Desktop: gráfica */}
      <div className="hidden md:flex flex-col flex-1 min-h-0">
        <Card className="flex flex-col flex-1 min-h-0 h-full">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-700">Actividades en mi área</h2>
            {/* Selector de mes */}
            <div className="relative">
              <button 
                className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2"
                onClick={() => setSelectedMonth(prev => prev === "Este mes" ? "Mes pasado" : "Este mes")}
              >
                {selectedMonth}
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
            </div>
          </div>
          <CardContent className="flex-grow overflow-visible relative">
            <div className="w-full md:min-w-[600px] h-full min-h-[400px]">
              {validActivitiesData.length > 0 ? (
                <ResponsiveLine
                  data={validActivitiesData}
                  theme={lineChartTheme}
                  margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
                  xScale={{ type: 'point' }}
                  yScale={{
                    type: 'linear',
                    min: 0,
                    max: 100,
                    stacked: false
                  }}
                  curve="cardinal"
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
                  colors={d => d.color}
                  pointSize={6}
                  pointColor={{ theme: 'background' }}
                  pointBorderWidth={2}
                  pointBorderColor={{ from: 'serieColor' }}
                  pointLabelYOffset={-12}
                  useMesh={true}
                  enableArea={true}
                  areaOpacity={0.1}
                  enableSlices="x"
                  crosshairType="bottom"
                  legends={[]}
                  tooltip={({ point }) => (
                    <div 
                      className="bg-white rounded-lg shadow-lg p-3 border border-gray-200 text-gray-800 min-w-[120px] z-50"
                      style={{
                        position: 'absolute',
                        transform: 'translate(-50%, -100%)',
                        marginTop: '-12px',
                        pointerEvents: 'none'
                      }}
                    >
                      <div className="font-semibold text-gray-800 mb-1 text-center">
                        Mes {point.data.xFormatted || point.data.x}
                      </div>
                      <div className="text-sm text-gray-600 text-center">
                        <span className="font-medium">{point.data.yFormatted || point.data.y}%</span>
                      </div>
                      <div className="text-xs text-gray-500 text-center mt-1">
                        {point.serieId === 'actividades' ? 'Actividades' : 'Rendimiento'}
                      </div>
                      {/* Flecha del tooltip */}
                      <div 
                        className="absolute left-1/2 transform -translate-x-1/2 top-full"
                        style={{
                          width: 0,
                          height: 0,
                          borderLeft: '6px solid transparent',
                          borderRight: '6px solid transparent',
                          borderTop: '6px solid white'
                        }}
                      />
                    </div>
                  )}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-gray-500">No hay datos disponibles para mostrar</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}