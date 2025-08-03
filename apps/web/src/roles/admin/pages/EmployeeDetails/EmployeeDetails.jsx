import React from 'react';
import { motion as MotionComponent } from 'framer-motion';
import './EmployeeDetails.css';
import EmployeeInfoCard from '../../components/CardsEmployee/EmployeeInfoCard';
import WorkTeamsCard from '../../components/CardsEmployee/WorkTeamsCard';
import ProjectStatsCard from '../../components/CardsEmployee/ProjectStatsCard';
import PerformanceCard from '../../components/CardsEmployee/PerformanceCard';
import { useDetailsEmployee } from './hooks';

export default function EmployeeDetails() {
  const {
    id,
    loading,
    error,
    selectedEmployee
  } = useDetailsEmployee();

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p>Cargando datos del empleado...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        <p>Error al cargar los datos del empleado</p>
      </div>
    );
  }

  if (!selectedEmployee) {
    return (
      <div className="p-6 text-center">
        <p>Dato no encontrado</p>
      </div>
    );
  }

  return (
    <div className="p-6 w-full">
      <MotionComponent.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* Columna 1: Información personal */}
        <EmployeeInfoCard selectedEmployee={selectedEmployee} />

        {/* Columna 2: Información de equipo y proyectos */}
        <div className="col-span-1 md:col-span-2 space-y-6">
          {/* Sección de Equipos de trabajo */}
          <WorkTeamsCard employeeId={id} />

          {/* Fila inferior con las tarjetas más pequeñas */}
          <ProjectStatsCard />

          {/* Tarjeta de rendimiento */}
          <PerformanceCard />
        </div>
      </MotionComponent.div>
    </div>
  );
}