// =========================================================
// GlobalPage - Componente principal para el dashboard global
// =========================================================
// Este componente organiza y estructura la página de visualización global
// que muestra datos de múltiples países y estadísticas generales.
// Incluye un globo interactivo, tarjetas de estadísticas y gráficos avanzados.
// Los gráficos utilizan componentes modernos basados en Nivo.
// =========================================================

import React, { useState, useEffect } from 'react';
import { motion as Motion } from 'framer-motion';
import { User, Award, Layers } from 'lucide-react';
import RexAIAnimation from '@/components/RexAIAnimation';
import StatCard from './StatCard';
import HighlightAreaCard from './HighlightAreaCard';
import CustomHeading from '../../../../components/Titles/TitleH1';
import axios from 'axios';
import { 
  RadarChart,
  GlobeChart, 
  EmployeeActivityChart 
} from '../../components/GlobalGraphics';

const GlobalPage = () => {
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [isMediumScreen, setIsMediumScreen] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    projectStates: {},
    areaMostFinished: '',
    topCountry: '',
    efficiency: [],
    topEmployee: '',
    bottomEmployee: '',
    topSupervisor: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkNavWidth = () => {
      const navbar = document.querySelector('#admin-navbar');
      if (navbar) setIsNavExpanded(navbar.offsetWidth > 200);
    };
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsLargeScreen(width >= 1536);
      setIsMediumScreen(width < 1200);
    };
    checkNavWidth();
    checkScreenSize();
    const observer = new MutationObserver(checkNavWidth);
    observer.observe(document.body, { attributes: true, childList: true, subtree: true });
    window.addEventListener('resize', checkScreenSize);
    window.addEventListener('resize', checkNavWidth);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', checkScreenSize);
      window.removeEventListener('resize', checkNavWidth);
    };
  }, []);

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:3000/api/global/stats')
      .then(res => {
        setStats(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const singleColumnLayout = (isNavExpanded && isMediumScreen);

  return (
    <>
      <Motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full p-4 md:p-6 bg-white min-h-screen"
      >
      <div className={singleColumnLayout ? "flex flex-col space-y-6" : ""}>
      <div className={`flex flex-col md:flex-row md:justify-between md:items-center ${singleColumnLayout ? '' : 'mb-6'}`}>
        <h1 className="text-2xl md:text-3xl font-bold text-[#01426A] flex items-center gap-2">
  <span className="text-[#01426A]">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M12 2a14.5 14.5 0 0 0 0 20a14.5 14.5 0 0 0 0-20"></path>
      <path d="M2 12h20"></path>
    </svg>
  </span>
  <CustomHeading 
    text="Gráficas globales"    
    color="#01426A"
    className="!text-inherit !font-inherit !m-0 !p-0"
    asSpan={true}
  />
</h1>
        <div className="flex justify-center md:justify-end w-full">
          <RexAIAnimation className="mt-4 md:mt-0" />
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <span className="text-lg text-gray-500">Cargando datos globales...</span>
        </div>
      ) : (
      <>
      {isLargeScreen ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="flex flex-col gap-4">
            <StatCard 
              title="Usuarios Totales" 
              value={stats.totalUsers} 
              icon={<User size={24} />}
              className="w-full"
            />
            <StatCard 
              title="Usuarios Activos" 
              value={stats.activeUsers} 
              icon={<User size={24} />}
              className="w-full"
            />
          </div>
          <div className="flex justify-center items-center h-[500px]">
            <GlobeChart 
              employeesByCountry={stats.employeesByCountry}
              projectsByCountry={stats.projectsByCountry}
            />
          </div>
          <div className="flex flex-col gap-4">
            <StatCard 
              title="Mayor Rendimiento | País" 
              value={stats.topCountry || ''} 
              icon={<Award size={24} />}
              className="w-full"
            />
            <StatCard 
              title="Supervisor Sobresaliente" 
              value={stats.topSupervisor ? stats.topSupervisor.name : 'Sin datos'} 
              icon={<Award size={24} />}
              className="w-full"
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <StatCard 
            title="Usuarios Totales" 
            value={stats.totalUsers} 
            icon={<User size={24} />}
            className="w-full"
          />
          <StatCard 
            title="Usuarios Activos" 
            value={stats.activeUsers} 
            icon={<User size={24} />}
            className="w-full"
          />
          <StatCard 
            title="Mayor Rendimiento | País" 
            value={stats.topCountry || ''} 
            icon={<Award size={24} />}
            className="w-full"
          />
          <StatCard 
            title="Supervisor Sobresaliente" 
            value={stats.topSupervisor ? stats.topSupervisor.name : 'Sin datos'} 
            icon={<Award size={24} />}
            className="w-full"
          />
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="Proyectos Pendientes" 
          value={stats.projectStates?.pendiente || 0} 
          icon={<Layers size={24} className="text-yellow-500" />}
        />
        <StatCard 
          title="Proyectos en Desarrollo" 
          value={stats.projectStates?.enProceso || 0} 
          icon={<Layers size={24} className="text-blue-500" />}
        />
        <StatCard 
          title="Proyectos Finalizados" 
          value={stats.projectStates?.finalizado || 0} 
          icon={<Layers size={24} className="text-green-500" />}
        />
        <StatCard 
          title="Proyectos Cancelados" 
          value={stats.projectStates?.cancelado || 0} 
          icon={<Layers size={24} className="text-red-500" />}
        />
      </div>
      <div className={singleColumnLayout ? '' : 'mb-6'}>
        <HighlightAreaCard area={stats.areaMostFinished || 'Sin datos'} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 h-full">
          <EmployeeActivityChart
            title="Empleado con más actividades realizadas"
            name={stats.topEmployee || 'Sin datos'}
            isPositive={true}
            value={stats.topEmployee ? 1 : 0}
            className="w-full"
          />
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 h-full">
          <EmployeeActivityChart
            title="Empleado con menos actividades realizadas"
            name={stats.bottomEmployee || 'Sin datos'}
            isPositive={false}
            value={stats.bottomEmployee ? 1 : 0}
            className="w-full"
          />
        </div>
      </div>
      {isLargeScreen && (
        <div className="mb-6">
          <RadarChart efficiencyData={stats.efficiency} />
        </div>
      )}
      </>
      )}
      </div>
    </Motion.div>
    </>
  );
};

export default GlobalPage;
