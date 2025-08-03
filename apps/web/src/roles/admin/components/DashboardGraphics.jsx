import React from 'react';
import { ResponsivePie } from '@nivo/pie';

export default function DashboardGraphics() {
  // Datos para el gráfico de Nivo - solo positivas y negativas con colores corporativos
  const reviewData = [
    {
      id: 'Positivas',
      label: 'Positivas',
      value: 520,
      color: '#194167'
    },
    {
      id: 'Negativas',
      label: 'Negativas',
      value: 68,
      color: '#4d82bc'
    }
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col flex-grow min-h-0">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base font-medium" style={{ color: '#01243A' }}>Valoraciones</h2>
        <span className="px-3 py-1 rounded-lg bg-gray-50 text-xs text-gray-500">Este mes</span>
      </div>
      <div className="flex-1 relative" style={{ height: '220px' }}>
        <ResponsivePie
          data={reviewData}
          margin={{ top: 10, right: 20, bottom: 10, left: 20 }}
          innerRadius={0.7}
          padAngle={0.7}
          cornerRadius={3}
          activeOuterRadiusOffset={8}
          colors={{ datum: 'data.color' }}
          borderWidth={0}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor="#333333"
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: 'color' }}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor="#ffffff"
          defs={[
            {
              id: 'dots',
              type: 'patternDots',
              background: 'inherit',
              color: 'rgba(255, 255, 255, 0.3)',
              size: 4,
              padding: 1,
              stagger: true
            }
          ]}
          legends={[]}
          motionConfig="gentle"
          valueFormat=" >-"
          enableArcLinkLabels={false}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-bold" style={{ color: '#01426A' }}>88%</span>
          <span className="text-xs" style={{ color: '#01243A' }}>Reseñas</span>
        </div>
      </div>

      {/* Mini-cards - Solo positivas y negativas con fondo gris y texto del color de la grafica */}
      <div className="mt-6 grid grid-cols-2 gap-4 text-center">
        <div className="p-3 rounded-lg bg-gray-100 hover:shadow-md transition-shadow duration-200">
          <div className="flex flex-col items-center">
            <p className="text-xs font-medium mb-1" style={{ color: '#194167' }}>Reseñas Positivas</p>
            <p className="text-2xl font-bold" style={{ color: '#194167' }}>520</p>
          </div>
        </div>
        <div className="p-3 rounded-lg bg-gray-100 hover:shadow-md transition-shadow duration-200">
          <div className="flex flex-col items-center">
            <p className="text-xs font-medium mb-1" style={{ color: '#4d82bc' }}>Reseñas Negativas</p>
            <p className="text-2xl font-bold" style={{ color: '#4d82bc' }}>68</p>
          </div>
        </div>
      </div>
    </div>
  );
}
