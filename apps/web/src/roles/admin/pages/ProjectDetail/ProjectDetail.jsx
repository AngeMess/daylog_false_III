import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  User, 
  Globe, 
  Users, 
  Edit, 
  Plus, 
  Layers, 
  Info,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';
import BackArrow from '../../../../components/ui/BackArrow';
import ProjectEmployeesTable from '../../../../components/Projects/ProjectEmployeesTable';
import CustomHeading from '../../../../components/Titles/TitleH1';
import CustomSubtitle from '../../../../components/Titles/Subtitle';
import { motion as Motion } from 'framer-motion';
import { useProjectDetail } from './hooks';
import './ProjectDetail.css';

/**
 * Componente de página para mostrar los detalles completos de un proyecto
 * 
 * Este componente se encarga de:
 * - Mostrar información detallada del proyecto (datos, fechas, responsables)
 * - Mostrar el equipo de trabajo con conteo de actividades
 * - Mostrar estadísticas y badges de estado
 * - Manejar estados de carga y errores
 * - Proporcionar navegación de regreso
 * 
 * Utiliza el hook useProjectDetail para obtener y manejar todos los datos
 */
export default function ProjectDetail() {
  // Obtener el ID del proyecto desde los parámetros de la URL
  const { id } = useParams();
  
  // Hook para navegación programática
  const navigate = useNavigate();
  
  // Obtener todos los datos del proyecto usando el hook personalizado
  const { project, employees, loading, error } = useProjectDetail(id);
  
  /**
   * Función para generar badges de estado del proyecto
   * Retorna un componente JSX con el estilo correspondiente al estado
   * 
   * @param {string} status - Estado del proyecto
   * @returns {JSX.Element|null} Badge con icono y texto del estado
   */
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pendiente':
        return (
          <div className="flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-md">
            <Clock size={16} className="mr-1" />
            <span>Pendiente</span>
          </div>
        );
      case 'En proceso':
        return (
          <div className="flex items-center px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-md">
            <Layers size={16} className="mr-1" />
            <span>En proceso</span>
          </div>
        );
      case 'Finalizado':
        return (
          <div className="flex items-center px-3 py-1 text-sm bg-green-100 text-green-800 rounded-md">
            <CheckCircle2 size={16} className="mr-1" />
            <span>Finalizado</span>
          </div>
        );
      case 'Cancelado':
        return (
          <div className="flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-md">
            <XCircle size={16} className="mr-1" />
            <span>Cancelado</span>
          </div>
        );
      case 'Atrasado':
        return (
          <div className="flex items-center px-3 py-1 text-sm bg-red-100 text-red-800 rounded-md">
            <AlertTriangle size={16} className="mr-1" />
            <span>Atrasado</span>
          </div>
        );
      case 'En riesgo':
        return (
          <div className="flex items-center px-3 py-1 text-sm bg-purple-100 text-purple-800 rounded-md">
            <AlertTriangle size={16} className="mr-1" />
            <span>En riesgo</span>
          </div>
        );
      case 'Repriorizado':
        return (
          <div className="flex items-center px-3 py-1 text-sm bg-pink-100 text-pink-800 rounded-md">
            <Info size={16} className="mr-1" />
            <span>Repriorizado</span>
          </div>
        );
      default:
        return null;
    }
  };
  
  /**
   * Función para generar badges de saturación del proyecto
   * Retorna un componente JSX con el estilo correspondiente al nivel de saturación
   * 
   * @param {string} saturation - Nivel de saturación del proyecto
   * @returns {JSX.Element|null} Badge con texto del nivel de saturación
   */
  const getSaturationBadge = (saturation) => {
    switch (saturation) {
      case 'Baja':
        return (
          <div className="flex items-center px-3 py-1 text-sm bg-green-100 text-green-800 rounded-md">
            <span>Saturación Baja</span>
          </div>
        );
      case 'Normal':
        return (
          <div className="flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-md">
            <span>Saturación Normal</span>
          </div>
        );
      case 'Alta':
        return (
          <div className="flex items-center px-3 py-1 text-sm bg-red-100 text-red-800 rounded-md">
            <span>Saturación Alta</span>
          </div>
        );
      default:
        return null;
    }
  };
  
  /**
   * Función para generar badges de tamaño del proyecto
   * Retorna un componente JSX con el estilo correspondiente al tamaño
   * 
   * @param {string} size - Tamaño del proyecto
   * @returns {JSX.Element|null} Badge con texto del tamaño
   */
  const getSizeBadge = (size) => {
    switch (size) {
      case 'Pequeño':
        return (
          <div className="flex items-center px-3 py-1 text-sm bg-green-100 text-green-800 rounded-md">
            <span>Tamaño Pequeño</span>
          </div>
        );
      case 'Mediano':
        return (
          <div className="flex items-center px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-md">
            <span>Tamaño Mediano</span>
          </div>
        );
      case 'Grande':
        return (
          <div className="flex items-center px-3 py-1 text-sm bg-orange-100 text-orange-800 rounded-md">
            <span>Tamaño Grande</span>
          </div>
        );
      default:
        return null;
    }
  };
  
  /**
   * Función para formatear fechas en formato legible en español
   * Convierte fechas ISO a formato "día de mes de año"
   * 
   * @param {string} dateString - Fecha en formato ISO string
   * @returns {string} Fecha formateada en español o "No definida" si no hay fecha
   */
  const formatDate = (dateString) => {
    if (!dateString) return 'No definida';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  
  // Renderizado condicional para estado de carga
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#01426A]"></div>
      </div>
    );
  }
  
  // Renderizado condicional para estado de error
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-medium">Error al cargar el proyecto</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }
  
  // Renderizado condicional para proyecto no encontrado
  if (!project) {
    return (
      <div className="p-6">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg">
          <p className="font-medium">Proyecto no encontrado</p>
          <p className="text-sm">No se pudo encontrar el proyecto con ID: {id}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6 w-full min-h-screen flex flex-col">
      {/* Encabezado con botón de regreso */}
      <div className="flex items-center mb-6">
        <BackArrow onClick={() => navigate('/admin/proyectos')} />
        <div>
          <CustomHeading 
            text={`Proyecto: ${project.code || project.proyectName}`}
            color="#01426A"
          />
        </div>
      </div>
      
      {/* Contenido principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna izquierda - Información del proyecto */}
        <div className="lg:col-span-2">
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl p-6 shadow-sm mb-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800">{project.proyectName}</h2>
                <p className="text-gray-500">Código: {project.code}</p>
              </div>
            </div>
            
            {/* Estado y badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              {getStatusBadge(project.state)}
              {getSaturationBadge(project.saturation)}
              {getSizeBadge(project.size)}
            </div>
            
            {/* Información detallada */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Fechas</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Calendar size={18} className="text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Fecha de inicio</p>
                      <p className="font-medium">{formatDate(project.startDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar size={18} className="text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Fecha de finalización</p>
                      <p className="font-medium">{formatDate(project.finishDate)}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Responsables</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <User size={18} className="text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Supervisor</p>
                      <p className="font-medium">{project.supervisor?.fullName || 'No asignado'}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Users size={18} className="text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Equipo de trabajo</p>
                      <p className="font-medium">{project.workTeam?.name || 'No asignado'}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Ubicación</h3>
                <div className="flex items-center">
                  <Globe size={18} className="text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">País</p>
                    <p className="font-medium">{project.country?.name || 'No especificado'}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Área</h3>
                <div className="flex items-center">
                  <Layers size={18} className="text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Área principal</p>
                    <p className="font-medium">
                      {project.mainAreaArea ? 
                        `${project.mainAreaArea.mainArea?.name || ''} - ${project.mainAreaArea.area?.name || ''}` : 
                        'No especificada'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Motion.div>
          
          {/* Tabla de empleados */}
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <CustomSubtitle text="Empleados asignados" />
            <ProjectEmployeesTable
              employeeActivities={Array.isArray(employees) ? employees.map(e => ({
                fullName: (e.nombre && e.apellido) ? `${e.nombre} ${e.apellido}` : e.nombre || '',
                cuscaId: e.cuscaID || e.cuscaId || '',
                actividades: e.actividades ?? 0,
                employeeId: e.id || e.employeeId
              })) : []}
            />
          </Motion.div>
        </div>
        
        {/* Columna derecha - Estadísticas y actividad */}
        <div>
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm mb-6"
          >
            <CustomSubtitle text="Estadísticas" />
            <div className="space-y-4 mt-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Total actividades</p>
                <p className="text-2xl font-bold text-gray-800">
                  {employees.reduce((sum, emp) => sum + emp.actividades, 0)}
                </p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Empleados asignados</p>
                <p className="text-2xl font-bold text-gray-800">
                  {employees.length}
                </p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Visibilidad</p>
                <p className="text-xl font-bold text-gray-800">
                  {project.visible ? 'Visible' : 'No visible'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {project.visible 
                    ? 'El proyecto es visible para todos los empleados' 
                    : 'El proyecto está oculto para los empleados'}
                </p>
              </div>
            </div>
          </Motion.div>
          
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <CustomSubtitle text="Actividad reciente" />
            <div className="mt-4">
              {/* Aquí podríamos mostrar un historial de actividad del proyecto */}
              <p className="text-gray-500 text-sm">No hay actividad reciente para mostrar.</p>
            </div>
          </Motion.div>
        </div>
      </div>
    </div>
  );
} 