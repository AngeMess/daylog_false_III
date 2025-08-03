import React from 'react';
import { Folders, User } from 'lucide-react';
import { motion as Motion } from 'framer-motion';
import CustomHeading from '../../../components/Titles/TitleH1';
import { BentoDemo } from '@/components/ui/bento-demo';
import { BentoGrid } from '@/components/ui/bento-grid';
import { cn } from '@/lib/utils';
import useDashboardData from '../hooks/useDashboardData';
import { LoadingState, ErrorState, EmptyState } from '../../../components/ui/stateHandler'; // Importar los componentes de estado

// Componente para tarjetas de supervisores
const SupervisorCard = (props) => {
  const {
    name,
    className,
    background,
    Icon,
    description,
    value,
  } = props;
  
  return (
    <div
      className={cn(
        "group relative col-span-1 flex flex-col justify-between overflow-hidden rounded-xl h-40",
        "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
        "transform-gpu dark:bg-black dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
        className,
      )}
    >
      {background}
      <div className="pointer-events-none z-10 flex h-full transform-gpu flex-col p-6">
        <div className="flex items-center justify-between">
          <Icon className="h-10 w-10 text-[#D6AC50] transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" />
          <span className="text-2xl font-bold text-[#01426A] transition-all duration-300 group-hover:scale-105">{value}</span>
        </div>
        
        <div className="mt-auto transform-gpu transition-all duration-300 group-hover:-translate-y-2">
          <h3 className="text-xl font-semibold text-gray-800">
            {name}
          </h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-black/[.03] group-hover:dark:bg-neutral-800/10" />
    </div>
  );
};

// Componente para tarjetas de proyectos
const ProyectoCard = (props) => {
  const {
    name,
    className,
    background,
    Icon,
    description,
    value,
  } = props;
  
  return (
    <div
      className={cn(
        "group relative col-span-1 flex flex-col justify-between overflow-hidden rounded-xl h-40",
        "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
        "transform-gpu dark:bg-black dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
        className,
      )}
    >
      {background}
      <div className="pointer-events-none z-10 flex h-full transform-gpu flex-col p-6">
        <div className="flex items-center justify-between">
          <Icon className="h-10 w-10 text-[#D6AC50] transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" />
          <span className="text-lg font-bold text-[#01426A] bg-blue-50 px-2 py-1 rounded transition-all duration-300 group-hover:scale-105">
            Inicia: {value}
          </span>
        </div>
        
        <div className="mt-auto transform-gpu transition-all duration-300 group-hover:-translate-y-2">
          <h3 className="text-xl font-semibold text-gray-800">
            {name}
          </h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-black/[.03] group-hover:dark:bg-neutral-800/10" />
    </div>
  );
};

export default function Dashboard() {
  const { 
    supervisores, 
    proximosProyectos, 
    loading, 
    error, 
    refreshData 
  } = useDashboardData();

  // Datos estáticos para supervisores con el mismo diseño
  const supervisoresData = loading ? [] : supervisores.length > 0 ? supervisores.map(supervisor => ({
    ...supervisor,
    Icon: User,
    background: (
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 opacity-60"></div>
        <div className="absolute right-0 bottom-0 w-32 h-32 transform translate-x-1/3 translate-y-1/4 opacity-10 group-hover:opacity-15 transition-all duration-300">
          <svg className="w-full h-full text-[#01426A]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
          </svg>
        </div>
      </div>
    ),
    className: "lg:col-span-1"
  })) : [
    {
      Icon: User,
      name: "Ana Martínez",
      description: "Líder de equipo, departamento de desarrollo",
      background: (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 opacity-60"></div>
          <div className="absolute right-0 bottom-0 w-32 h-32 transform translate-x-1/3 translate-y-1/4 opacity-10 group-hover:opacity-15 transition-all duration-300">
            <svg className="w-full h-full text-[#01426A]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
            </svg>
          </div>
        </div>
      ),
      className: "lg:col-span-1",
      value: "8 proyectos"
    },
    {
      Icon: User,
      name: "Jorge Pérez",
      description: "Supervisor senior, departamento de diseño",
      background: (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 opacity-60"></div>
          <div className="absolute right-0 bottom-0 w-32 h-32 transform translate-x-1/3 translate-y-1/4 opacity-10 group-hover:opacity-15 transition-all duration-300">
            <svg className="w-full h-full text-[#01426A]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
            </svg>
          </div>
        </div>
      ),
      className: "lg:col-span-1",
      value: "7 proyectos"
    },
    {
      Icon: User,
      name: "María López",
      description: "Coordinadora de proyectos tecnológicos",
      background: (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 opacity-60"></div>
          <div className="absolute right-0 bottom-0 w-32 h-32 transform translate-x-1/3 translate-y-1/4 opacity-10 group-hover:opacity-15 transition-all duration-300">
            <svg className="w-full h-full text-[#01426A]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
            </svg>
          </div>
        </div>
      ),
      className: "lg:col-span-1",
      value: "6 proyectos"
    }
  ];

  // Datos estáticos para próximos proyectos con el mismo diseño
  const proximosProyectosData = loading ? [] : proximosProyectos.length > 0 ? proximosProyectos.map(proyecto => ({
    ...proyecto,
    Icon: Folders,
    background: (
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 opacity-60"></div>
        <div className="absolute right-0 bottom-0 w-36 h-36 transform translate-x-1/3 translate-y-1/4 opacity-10 group-hover:opacity-15 transition-all duration-300">
          <svg className="w-full h-full text-[#01426A]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>
          </svg>
        </div>
      </div>
    ),
    className: "lg:col-span-1"
  })) : [
    {
      Icon: Folders,
      name: "Sistema CRM",
      description: "Actualización del sistema de gestión de clientes",
      background: (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 opacity-60"></div>
          <div className="absolute right-0 bottom-0 w-36 h-36 transform translate-x-1/3 translate-y-1/4 opacity-10 group-hover:opacity-15 transition-all duration-300">
            <svg className="w-full h-full text-[#01426A]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>
            </svg>
          </div>
        </div>
      ),
      className: "lg:col-span-1",
      value: "1 Jun"
    },
    {
      Icon: Folders,
      name: "App Móvil DayTrack",
      description: "Desarrollo de aplicación móvil para seguimiento",
      background: (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 opacity-60"></div>
          <div className="absolute right-0 bottom-0 w-36 h-36 transform translate-x-1/3 translate-y-1/4 opacity-10 group-hover:opacity-15 transition-all duration-300">
            <svg className="w-full h-full text-[#01426A]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/>
            </svg>
          </div>
        </div>
      ),
      className: "lg:col-span-1",
      value: "3 Jun"
    },
    {
      Icon: Folders,
      name: "Dashboard Analytics",
      description: "Implementación de panel de analíticas avanzadas",
      background: (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 opacity-60"></div>
          <div className="absolute right-0 bottom-0 w-36 h-36 transform translate-x-1/3 translate-y-1/4 opacity-10 group-hover:opacity-15 transition-all duration-300">
            <svg className="w-full h-full text-[#01426A]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14H7v-7h3v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
            </svg>
          </div>
        </div>
      ),
      className: "lg:col-span-1",
      value: "5 Jun"
    }
  ];

  return (
    <Motion.div 
      className="h-full flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6 p-4">
        <CustomHeading 
          text="Bienvenido(a) Christian Sandoval Angel Campos"    
          color="#01426A" 
        />
      </div>

      {/* BentoGrid principal con animaciones */}
      <div className="px-4 mb-2">
        <BentoDemo />
      </div>
      
      {/* BentoGrid de Supervisores */}
      <div className="px-4 mb-2 mt-8">
        <Motion.div 
          className="w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold mb-2" style={{ color: '#01243A' }}>
            Supervisores con más proyectos
          </h2>
          
          {loading ? (
            <LoadingState message="Cargando supervisores..." />
          ) : error ? (
            <ErrorState 
              message={`Error al cargar supervisores: ${error}`}
              onRetry={refreshData}
            />
          ) : supervisoresData.length === 0 ? (
            <EmptyState 
              message="No hay supervisores disponibles"
              description="No se encontraron supervisores en el sistema"
              icon={User}
              iconColor="text-blue-400"
            />
          ) : (
            <BentoGrid className="lg:grid-cols-3 gap-3 auto-rows-[8rem]">
              {supervisoresData.map((supervisor) => (
                <SupervisorCard key={supervisor.name} {...supervisor} />
              ))}
            </BentoGrid>
          )}
        </Motion.div>
      </div>

      {/* BentoGrid de Próximos Proyectos */}
      <div className="px-4 mt-0">
        <Motion.div 
          className="w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-xl font-semibold mb-1" style={{ color: '#01243A' }}>
            Próximos proyectos
          </h2>
          
          {loading ? (
            <LoadingState message="Cargando próximos proyectos..." />
          ) : error ? (
            <ErrorState 
              message={`Error al cargar proyectos: ${error}`}
              onRetry={refreshData}
            />
          ) : proximosProyectosData.length === 0 ? (
            <EmptyState 
              message="No hay proyectos próximos"
              description="No se encontraron proyectos programados para las próximas fechas"
              icon={Folders}
              iconColor="text-green-400"
            />
          ) : (
            <BentoGrid className="lg:grid-cols-3 gap-3 auto-rows-[8rem]">
              {proximosProyectosData.map((proyecto) => (
                <ProyectoCard key={proyecto.name} {...proyecto} />
              ))}
            </BentoGrid>
          )}
        </Motion.div>
      </div>
    </Motion.div>
  );
}