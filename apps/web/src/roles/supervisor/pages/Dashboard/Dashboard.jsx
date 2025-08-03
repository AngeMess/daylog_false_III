import React from 'react';
import { Users, FolderOpen, Clock, CheckCircle } from 'lucide-react';
import CustomHeading from '../../../../components/Titles/TitleH1';
import { EmployeePerformanceChart } from '../../../../components/Charts/SupervisorDashboardCharts';
import { StatCard, EmployeeList, RecentProjects } from '../../components/DashboardSupervisor';

export default function Dashboard() {
  // Estadísticas
  const stats = [
    { title: "Empleados activos", value: "12", icon: Users, change: 8.2 },
    { title: "Proyectos en curso", value: "8", icon: FolderOpen, change: -2.1 },
    { title: "Horas trabajadas", value: "1,247h", icon: Clock, change: 12.5 },
    { title: "Actividades completadas", value: "156", icon: CheckCircle, change: 15.3 }
  ];

  // Datos para la gráfica de rendimiento de empleados
  const employeePerformanceData = [
    { empleado: "Ana Martínez", horasTrabajadas: 42, actividades: 15 },
    { empleado: "Carlos López", horasTrabajadas: 38, actividades: 12 },
    { empleado: "María García", horasTrabajadas: 45, actividades: 18 },
    { empleado: "Juan Pérez", horasTrabajadas: 35, actividades: 10 },
    { empleado: "Sofía Vega", horasTrabajadas: 40, actividades: 14 },
    { empleado: "Luis Torres", horasTrabajadas: 37, actividades: 11 }
  ];

  // Empleados
  const employees = [
    { name: "Ana Martínez López", position: "Desarrollador Frontend", status: "Activo" },
    { name: "Carlos Rodríguez", position: "Desarrollador Backend", status: "Inactivo" },
    { name: "María Fernández", position: "Diseñador UX/UI", status: "Activo" },
    { name: "Juan Pérez García", position: "Tester QA", status: "Vacaciones" },
    { name: "Sofía Vega Mendoza", position: "DevOps Engineer", status: "Deshabilitado" },
    { name: "Luis Torres Ramírez", position: "Project Manager", status: "Activo" }
  ];

  // Proyectos
  const projects = [
    { name: "Sistema CRM", status: "En proceso", dueDate: "15/06/2025", saturation: "Normal" },
    { name: "App Móvil DayTrack", status: "Pendiente", dueDate: "30/06/2025", saturation: "Baja" },
    { name: "Dashboard Analytics", status: "Finalizado", dueDate: "10/05/2025", saturation: "Normal" },
    { name: "API REST", status: "Atrasado", dueDate: "05/06/2025", saturation: "Alta" }
  ];

  return (
    <div className="p-4 -mt-4 -mb-8 pb-12">
      <CustomHeading 
        text="Bienvenido(a) Christian Sandoval Ángel Campos"    
        color="#01426A" 
      />
      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-8">
        {stats.map((stat, index) => (
          <StatCard 
            key={index}
            {...stat}
            className="lg:col-span-1"
          />
        ))}
      </div>
      {/* Gráfica de rendimiento */}
      <div className="mb-8">
        <EmployeePerformanceChart data={employeePerformanceData} />
      </div>
      {/* Secciones de información */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EmployeeList employees={employees} />
        <RecentProjects projects={projects} />
      </div>
    </div>
  );
} 