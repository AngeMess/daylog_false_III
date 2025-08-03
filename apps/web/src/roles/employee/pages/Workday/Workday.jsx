import React, { useState, useEffect } from 'react';
import CustomHeading from '../../../../components/Titles/TitleH1';
import StatCard from '../../../../components/WorkdayComponents/StatCard';
import WeeklySummaryCard from '../../../../components/WorkdayComponents/WeeklySummaryCard';
import WorkdayChart from '../../../../components/WorkdayComponents/WorkdayChart';
import CompletedActivitiesCard from '../../../../components/WorkdayComponents/CompletedActivitiesCard';
import CompletedProjectsCard from '../../../../components/WorkdayComponents/CompletedProjectsCard';

export default function Workday() {
  // Datos para el gráfico semanal de horas
  const weeklyHoursData = [
    { day: 'Lunes', horas: 8, color: '#f3f4f6' },
    { day: 'Martes', horas: 6, color: '#1f2937' },
    { day: 'Miércoles', horas: 8, color: '#f3f4f6' },
    { day: 'Jueves', horas: 8, color: '#1f2937' },
    { day: 'Viernes', horas: 7, color: '#f3f4f6' },
    { day: 'Sábado', horas: 4, color: '#1f2937' },
    { day: 'Domingo', horas: 0, color: '#f3f4f6' },
  ];

  // Datos de actividades completadas esta semana
  const actividadesCompletadas = [
    { nombre: "Actualización de API Rest", fecha: "06/06/2025", tiempo: "2h 30m" },
    { nombre: "Corrección de errores UI", fecha: "05/06/2025", tiempo: "4h 15m" },
    { nombre: "Reunión con equipo de diseño", fecha: "04/06/2025", tiempo: "1h 45m" },
    { nombre: "Implementación de nuevos componentes", fecha: "03/06/2025", tiempo: "5h 20m" },
    { nombre: "Optimización de base de datos", fecha: "02/06/2025", tiempo: "3h 10m" }
  ];

  // Datos de proyectos completados esta semana
  const proyectosCompletados = [
    { nombre: "Integración de pasarela de pagos", fecha: "05/06/2025"},
    { nombre: "Rediseño de dashboard", fecha: "03/06/2025"},
    { nombre: "Actualización de sistema de autenticación", fecha: "02/06/2025"},
    { nombre: "Actualización de sistema de autenticación", fecha: "02/06/2025"}
  ];

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="py-4 mb-10 ">
      <CustomHeading 
        text="Mi Jornada"
        color="#01426A"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-6 mt-4">
        <StatCard label="Total horas trabajadas" value="160h" />
        <StatCard label="Horas de esta semana" value="38h" />
        <StatCard label="Horas extras generadas" value="10h" />
        <StatCard label="Horas totales compensatorias" value="5h" />
      </div>
      {/* Gráfico semanal solo en desktop/tablet */}
      {!isMobile ? (
        <WorkdayChart data={weeklyHoursData} />
      ) : (
        <WeeklySummaryCard
          totalHoras="38h"
          dias={[
            { dia: 'Lunes', horas: 8 },
            { dia: 'Martes', horas: 6 },
            { dia: 'Miércoles', horas: 8 },
            { dia: 'Jueves', horas: 8 },
            { dia: 'Viernes', horas: 7 },
            { dia: 'Sábado', horas: 4 },
            { dia: 'Domingo', horas: 0 },
          ]}
        />
      )}

      {/* Card de actividades y proyectos completados */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <CompletedActivitiesCard actividades={actividadesCompletadas} />
        <CompletedProjectsCard proyectos={proyectosCompletados} />
      </div>
    </div>
  );
}
