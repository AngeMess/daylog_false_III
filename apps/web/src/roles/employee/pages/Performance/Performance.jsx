import React, { useState } from 'react';
import { Clock, Calendar, Folder, ListChecks } from 'lucide-react';
import CustomHeading from '../../../../components/Titles/TitleH1';
import { EmployeePerformanceLineChart } from '../../../../components/charts/ActivityWeeklyChart';

// Card minimalista con escala de grises y acento amarillo
const StatCard = ({ title, value, icon, subtitle }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
    <div className="bg-gray-100 p-3 rounded-full flex items-center justify-center">
      {icon}
    </div>
    <div className="flex flex-col">
      <span className="text-sm font-medium text-gray-500">{title}</span>
      <span className="text-3xl font-bold text-gray-800">{value}</span>
      {subtitle && <span className="text-xs text-gray-400 mt-1">{subtitle}</span>}
    </div>
  </div>
);

// Card de actividad realizada
const ActivityCard = ({ name, date, duration }) => (
  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 mb-2 border border-gray-100">
    <div>
      <h4 className="text-sm font-semibold text-gray-800">{name}</h4>
      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
        <Calendar size={14} className="text-[#FFC600]" />
        <span>{date}</span>
        <span className="ml-2 px-2 py-0.5 rounded-full bg-[#000000] text-[#FFFFFF] font-medium">{duration}</span>
      </div>
    </div>
  </div>
);

export default function Performance() {
  const [period, setPeriod] = useState('week'); // 'week' o 'month'

  // Datos de ejemplo (simulan lo que se puede obtener del backend)
  const stats = [
    {
      title: 'Horas trabajadas',
      value: '38h',
      icon: <Clock size={22} className="text-[#FFC600]" />,
      subtitle: 'Esta semana'
    },
    {
      title: 'Actividades completadas',
      value: '12',
      icon: <ListChecks size={22} className="text-[#FFC600]" />,
      subtitle: 'Esta semana'
    },
    {
      title: 'Promedio diario',
      value: '7.6h',
      icon: <Clock size={22} className="text-[#FFC600]" />,
      subtitle: 'Horas/día'
    },
    {
      title: 'Proyectos activos',
      value: '3',
      icon: <Folder size={22} className="text-[#FFC600]" />,
      subtitle: 'Actualmente'
    }
  ];

  // Gráfica de rendimiento semanal y mensual
  const performanceData = {
    week: [
      { x: 'Lun', y: 7 },
      { x: 'Mar', y: 8 },
      { x: 'Mié', y: 6 },
      { x: 'Jue', y: 8 },
      { x: 'Vie', y: 7 },
      { x: 'Sáb', y: 2 },
      { x: 'Dom', y: 0 }
    ],
    month: [
      { x: 'Semana 1', y: 36 },
      { x: 'Semana 2', y: 38 },
      { x: 'Semana 3', y: 35 },
      { x: 'Semana 4', y: 39 }
    ]
  };

  // Últimas actividades realizadas
  const lastActivities = [
    { name: 'Actualización de API Rest', date: '06/06/2025', duration: '2h 30m' },
    { name: 'Corrección de errores UI', date: '05/06/2025', duration: '4h 15m' },
    { name: 'Reunión con equipo de diseño', date: '04/06/2025', duration: '1h 45m' },
    { name: 'Implementación de nuevos componentes', date: '03/06/2025', duration: '5h 20m' },
    { name: 'Optimización de base de datos', date: '02/06/2025', duration: '3h 10m' }
  ];

  return (
    <div className="py-4 -mt-4 -mb-8 pb-12">
      <CustomHeading 
        text="Mi Rendimiento"    
        color="#01426A" 
      />

      {/* Selector de período */}
      <div className="flex justify-end mb-6">
        <div className="inline-flex bg-white border rounded-lg overflow-hidden">
          {['week', 'month'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 text-sm font-medium ${
                period === p
                  ? 'bg-[#FFC600]/20 text-[#FFC600]'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {p === 'week' ? 'Semana' : 'Mes'}
            </button>
          ))}
        </div>
      </div>

      {/* Estadísticas principales */}
      <div className="w-full px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-5 mb-8 w-full">
          {stats.map((stat, idx) => (
            <StatCard key={idx} {...stat} />
          ))}
        </div>
      </div>

      {/* Gráfica de rendimiento */}
      <EmployeePerformanceLineChart data={performanceData} period={period} />

      {/* Últimas actividades realizadas */}
      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl text-gray-800 font-semibold">Últimas actividades realizadas</h2>
            <div className="bg-[#FFC600]/20 p-2 rounded-full">
              <ListChecks size={18} className="text-[#FFC600]" />
            </div>
          </div>
          <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
            {lastActivities.map((act, idx) => (
              <ActivityCard key={idx} {...act} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
