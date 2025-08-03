import React from 'react';
import CustomHeading from '../../../../components/Titles/TitleH1';
import CustomSubtitle from '../../../../components/Titles/Subtitle';
import WorkStatCard from '../../components/WorkStatCard';
import ActivitiesCard from '../../components/ActivitiesCard';
import ProjectCard from '../../components/ProjectCard';
import { Clock, ArrowUpRight, Timer } from 'lucide-react';

const userName = 'Ernesto Romero Ángel Campos'; // Puedes reemplazarlo por el nombre dinámico

const workStats = [
  { label: 'Horas laborales', value: '47h', icon: <Clock size={28} className="text-blue-600" /> },
  { label: 'Horas extra', value: '4h', icon: <ArrowUpRight size={28} className="text-yellow-500" /> },
  { label: 'Horas compensatorias', value: '3h', icon: <Timer size={28} className="text-green-600" /> },
];

const activitiesInProgress = 6; // Valor de ejemplo

const upcomingProjects = [
  { name: 'Sistema CRM', date: '1 Jun', description: 'Actualización del sistema de gestión de clientes' },
  { name: 'App Móvil DayTrack', date: '3 Jun', description: 'Desarrollo de aplicación móvil para seguimiento' },
  { name: 'Dashboard Analytics', date: '5 Jun', description: 'Implementación de panel de analíticas avanzadas' },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen w-full bg-white pb-12">
      {/* Título alineado a la izquierda */}
      <div className="px-6 pt-8 pb-2">
        <CustomHeading 
          text={`Bienvenido(a) ${userName}`}
          color="#01426A"
          className="text-left"
        />
      </div>
      <div className="h-4 md:h-8" />
      {/* Layout principal: 3 cards de horas a la izquierda, actividades a la derecha */}
      <div className="w-full px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        {/* Columna izquierda: 3 cards de horas en vertical */}
        <div className="flex flex-col gap-6 md:col-span-1 items-center">
          {workStats.map((item) => (
            <div className="w-full md:min-w-[260px] md:max-w-[340px]" key={item.label}>
              <WorkStatCard {...item} />
            </div>
          ))}
        </div>
        {/* Card de actividades pendientes ocupando 3/4 del ancho en desktop */}
        <div className="md:col-span-3 flex flex-col justify-center h-full">
          <ActivitiesCard value={activitiesInProgress} />
        </div>
      </div>
      {/* Proyectos próximos en bloque debajo */}
      <div className="w-full px-6 mt-2">
        <CustomSubtitle text="Proyectos próximos" color="#01426A" marginBottom="mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {upcomingProjects.map((project) => (
            <ProjectCard key={project.name} {...project} />
          ))}
        </div>
      </div>
    </div>
  );
}