import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Calendar, Clock, MapPin, Users, PenLine, X, Hash, FileText, AlertCircle, Loader, FileText as ReportIcon, ArrowDown, FileSpreadsheet } from 'lucide-react';
import '../../../../components/Toast.css';
import { useParams, useNavigate } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import ProjectEmployeesTable from '../../../../components/Projects/ProjectEmployeesTable';
import ResourcesList from '../../../../components/ResourcesList/ResourcesList';
import { ActivityWeeklyChart } from '../../../../components/charts/ActivityWeeklyChart';
import { useProjectDetail } from './hooks';
import './ProjectDetail.css';
import { Button } from "../../../../components/Buttons";
import { generateProjectReport } from '../../../../utils/reportGenerator.js';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../../../roles/portfolio/pages/Reports/tableEmployees/DropdownMenu';

/**
 * Componente de página para mostrar los detalles completos de un proyecto en portfolio
 * 
 * Este componente se encarga de:
 * - Mostrar información detallada del proyecto (datos, fechas, responsables)
 * - Mostrar el equipo de trabajo con conteo de actividades
 * - Mostrar estadísticas y badges de estado
 * - Manejar estados de carga y errores
 * - Proporcionar navegación de regreso
 * - Gestionar modal de recursos
 * - Mostrar gráficos de actividad semanal
 * 
 * Utiliza el hook useProjectDetail para obtener y manejar todos los datos
 */
export default function ProjectDetailPortfolio() {
  // Obtener el ID del proyecto desde los parámetros de la URL
  const { id } = useParams();
  
  // Hook para navegación programática
  const navigate = useNavigate();
  
  // Obtener todos los datos del proyecto usando el hook personalizado
  const { project, employees, loading, error } = useProjectDetail(id);
  
  // Estados locales para la UI
  const [proyecto, setProyecto] = useState(null);
  const [showResourcesModal, setShowResourcesModal] = useState(false);
  const [empleados, setEmpleados] = useState(null);
  const [noWorkTeam, setNoWorkTeam] = useState(false);
  const [reportFormat, setReportFormat] = useState('pdf');

  // Efecto para procesar los datos del proyecto cuando se cargan desde el hook
  useEffect(() => {
    if (project) {
      console.log('Datos del proyecto recibidos:', project);
      console.log('Fecha inicio recibida:', project.startDate);
      console.log('Fecha fin recibida:', project.finishDate);
      
      // Extraer información de los objetos relacionados
      const supervisorName = typeof project.supervisor === 'object' ? 
        project.supervisor?.fullName || 'No asignado' : 
        project.supervisor || 'No asignado';
      
      const countryName = typeof project.country === 'object' ? 
        project.country?.name || 'No asignado' : 
        project.country || 'No asignado';
      
      const workTeamName = typeof project.workTeam === 'object' ? 
        project.workTeam?.name || 'No asignado' : 
        project.workTeam || 'No asignado';
      
      let mainAreaAreaText = 'No asignado';
      if (project.mainAreaArea) {
        if (typeof project.mainAreaArea === 'object') {
          const mainAreaName = project.mainAreaArea.mainArea?.name || '';
          const areaName = project.mainAreaArea.area?.name || '';
          mainAreaAreaText = `${mainAreaName} - ${areaName}`.trim();
          if (mainAreaAreaText === ' - ') mainAreaAreaText = 'No asignado';
        } else {
          mainAreaAreaText = project.mainAreaArea;
        }
      }
      
      // Determinar empleados
      if (!project.workTeam) {
        setNoWorkTeam(true);
        setEmpleados([]);
      } else {
        const workTeam = project.workTeam;
        const employeeDocs = workTeam.employees || [];
        if (employeeDocs.length === 0) {
          setEmpleados([]);
        } else {
          // Usar los empleados ya procesados del hook
          const empList = employees.map(emp => ({
            id: emp.id,
            nombre: emp.nombre,
            apellido: emp.apellido,
            cuscaID: emp.cuscaID,
            actividades: emp.actividades
          }));
          setEmpleados(empList);
        }
      }

      // Transformar datos del backend al formato que usa el componente
      setProyecto({
        id: project._id,
        code: project.code || 'Sin código',
        nombre: project.proyectName,
        estado: project.state === 'En proceso' ? 'En desarrollo' : project.state,
        supervisor: supervisorName,
        tamano: project.size,
        // Ajustar la zona horaria para mostrar la fecha correcta (UTC)
        fechaInicio: formatearFechaUTC(project.startDate),
        fechaFin: formatearFechaUTC(project.finishDate),
        diasRetraso: calcularDiasRetraso(project.finishDate),
        saturacion: project.saturation,
        pais: countryName,
        visibilidad: project.visibility === 'Visible' ? 'Visible' : 'Privado',
        prioridad: project.priority || 50,
        grupoTrabajo: workTeamName,
        mainAreaArea: mainAreaAreaText,
        progreso: project.progress || 0
      });
    }
  }, [project, employees]);

  /**
   * Función para formatear fechas correctamente para Centroamérica (UTC-6)
   * Maneja diferentes formatos de fecha y evita problemas de zona horaria
   * 
   * @param {string} fechaStr - Fecha en formato ISO string o YYYY-MM-DD
   * @returns {string} Fecha formateada en DD/MM/YYYY o mensaje de error
   */
  const formatearFechaUTC = (fechaStr) => {
    if (!fechaStr) return 'No asignada';
    
    try {
      // Para cualquier formato de fecha (con o sin T) usamos este enfoque más seguro
      // que garantiza mostrar la fecha correcta para la zona horaria de Centroamérica
      
      // Forzar la interpretación como mediodía para evitar problemas de cambio de fecha por zona horaria
      // El importante añadir la hora "T12:00:00" para garantizar que esté en el día correcto en cualquier zona horaria
      let fechaConHora;
      
      if (fechaStr.includes('T')) {
        // Si ya tiene hora, tomamos solo la parte de fecha
        const soloFecha = fechaStr.split('T')[0];
        fechaConHora = `${soloFecha}T12:00:00`;
      } else {
        // Si es solo fecha YYYY-MM-DD, añadimos la hora
        fechaConHora = `${fechaStr}T12:00:00`;
      }
      
      const fecha = new Date(fechaConHora);
      
      // Verificar que la fecha sea válida
      if (isNaN(fecha.getTime())) {
        console.error('Fecha inválida:', fechaStr);
        return 'Fecha inválida';
      }
      
      // Tomamos los componentes de la fecha local
      const año = fecha.getFullYear();
      const mes = fecha.getMonth() + 1;
      const dia = fecha.getDate();
      
      // Formateo para mostrar DD/MM/YYYY
      return `${dia.toString().padStart(2, '0')}/${mes.toString().padStart(2, '0')}/${año}`;
    } catch (error) {
      console.error('Error al procesar fecha:', error, fechaStr);
      return 'Error de formato';
    }
  };

  /**
   * Función para calcular días de retraso de un proyecto
   * Compara la fecha actual con la fecha de finalización del proyecto
   * 
   * @param {string} fechaFin - Fecha de finalización del proyecto
   * @returns {number} Número de días de retraso (0 si no hay retraso)
   */
  const calcularDiasRetraso = (fechaFin) => {
    if (!fechaFin) return 0;
    
    const hoy = new Date();
    const fechaFinProyecto = new Date(fechaFin);
    
    if (hoy > fechaFinProyecto) {
      const diferencia = hoy - fechaFinProyecto;
      return Math.floor(diferencia / (1000 * 60 * 60 * 24));
    }
    
    return 0;
  };
  
  // Renderizado condicional para estado de carga
  if (loading) {
    return (
      <div className="p-6 w-full flex flex-col items-center justify-center min-h-[400px]">
        <Loader className="animate-spin text-[#01426A] mb-4" size={40} />
        <p className="text-[#01426A] text-lg font-medium">Cargando detalles del proyecto...</p>
      </div>
    );
  }

  // Renderizado condicional para estado de error
  if (error) {
    return (
      <div className="p-6 w-full">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-medium">Error al cargar los detalles del proyecto</p>
          <p className="text-sm">{error}</p>
          <button 
            onClick={() => navigate('/portafolio/proyectos')}
            className="mt-4 bg-white text-red-600 border border-red-600 px-4 py-2 rounded-md hover:bg-red-600 hover:text-white transition-all"
          >
            Volver a proyectos
          </button>
        </div>
      </div>
    );
  }

  // Si no hay proyecto, mostrar mensaje
  if (!proyecto) {
    return (
      <div className="p-6 w-full flex flex-col items-center justify-center min-h-[400px]">
        <AlertCircle className="text-yellow-500 mb-4" size={40} />
        <p className="text-gray-700 text-lg font-medium mb-4">No se encontró el proyecto solicitado</p>
        <button 
          onClick={() => navigate('/portafolio/proyectos')}
          className="bg-[#01426A] text-white px-4 py-2 rounded-md hover:bg-[#02284a] transition-all"
        >
          Volver a proyectos
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 w-full">
      {/* Encabezado con botón de volver */}
      <Motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 mt-6 mb-8 w-full">
        <Button
              variant="btn_secondary"
              onClick={() => navigate('/portafolio/proyectos')}
            >
              <ArrowLeft size={18} />
              Volver
            </Button>
          

            <Button
              variant="btn_secondary"
              onClick={() => navigate(`/portafolio/proyectos/editar-proyecto/${id}`)}  
            >
              <PenLine size={18} />
              Editar
            </Button>

            <Button
              variant="btn_primary"
              onClick={() => setShowResourcesModal(true)}
            >
              <FileText size={18} />
              Recursos
            </Button>

            <div className="relative">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="btn_primary" 
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <FileText size={16} />
                    Generar Reporte
                    <ArrowDown size={14} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[160px]">
                  <DropdownMenuItem 
                    onClick={() => {
                      setReportFormat('pdf');
                      // Función para generar reporte PDF
                      try {
                        console.log('Generando reporte PDF para el proyecto:', project);
                        console.log('Empleados del proyecto:', employees);
                        const projectData = {
                          ...project,
                          employees: employees || []
                        };
                        const result = generateProjectReport(projectData, 'pdf');
                        if (result.success) {
                          console.log('Reporte PDF generado exitosamente');
                        } else {
                          console.error('Error al generar reporte PDF:', result.message);
                        }
                      } catch (error) {
                        console.error('Error al generar reporte PDF:', error);
                      }
                    }}
                    className="cursor-pointer"
                  >
                    <FileText size={16} className="mr-2 text-red-600" />
                    Descargar PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => {
                      setReportFormat('excel');
                      // Función para generar reporte Excel
                      try {
                        console.log('Generando reporte Excel para el proyecto:', project);
                        console.log('Empleados del proyecto:', employees);
                        const projectData = {
                          ...project,
                          employees: employees || []
                        };
                        const result = generateProjectReport(projectData, 'excel');
                        if (result.success) {
                          console.log('Reporte Excel generado exitosamente');
                        } else {
                          console.error('Error al generar reporte Excel:', result.message);
                        }
                      } catch (error) {
                        console.error('Error al generar reporte Excel:', error);
                      }
                    }}
                    className="cursor-pointer"
                  >
                    <FileSpreadsheet size={16} className="mr-2 text-green-600" />
                    Descargar Excel
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
        </div>
      </Motion.div>
      
      {/* Gráfico de actividades del proyecto */}
      <Motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-8">
        <ActivityWeeklyChart projectId={id} projectName={proyecto?.nombre} />
      </Motion.div>
              
      {/* Información del proyecto */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6 text-[#01426A] border-b pb-2">Información general</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 text-sm">Código:</p>
              <p className="font-medium flex items-center gap-1">
                <Hash size={14} className="text-[#01426A]" />
                {proyecto.code}
              </p>
            </div>
            
            <div>
              <p className="text-gray-500 text-sm">Nombre proyecto:</p>
              <p className="font-medium">{proyecto.nombre}</p>
            </div>
            
            <div>
              <p className="text-gray-500 text-sm">Supervisor:</p>
              <p className="font-medium">{proyecto.supervisor}</p>
            </div>
            
            <div>
              <p className="text-gray-500 text-sm">Tamaño:</p>
              <p className="font-medium">{proyecto.tamano}</p>
            </div>
            
            <div>
              <p className="text-gray-500 text-sm">Estado:</p>
              <p className="font-medium">{proyecto.estado}</p>
            </div>
            
            <div>
              <p className="text-gray-500 text-sm">Fecha de inicio:</p>
              <p className="font-medium flex items-center gap-1">
                <Calendar size={14} className="text-[#01426A]" />
                {proyecto.fechaInicio}
              </p>
            </div>
            
            <div>
              <p className="text-gray-500 text-sm">Fecha fin:</p>
              <p className="font-medium flex items-center gap-1">
                <Calendar size={14} className="text-[#01426A]" />
                {proyecto.fechaFin}
              </p>
            </div>
            
            <div>
              <p className="text-gray-500 text-sm">Días de retraso:</p>
              <p className="font-medium flex items-center gap-1">
                <Clock size={14} className="text-[#01426A]" />
                {proyecto.diasRetraso}
              </p>
            </div>
            
            <div>
              <p className="text-gray-500 text-sm">Saturación:</p>
              <p className="font-medium">{proyecto.saturacion}</p>
            </div>
            
            <div>
              <p className="text-gray-500 text-sm">País:</p>
              <p className="font-medium flex items-center gap-1">
                <MapPin size={14} className="text-[#01426A]" />
                {proyecto.pais}
              </p>
            </div>
            
            <div>
              <p className="text-gray-500 text-sm">Visibilidad:</p>
              <p className="font-medium">
                {proyecto.visibilidad === 'Visible' ? 'Visible' : 'Privado'}
              </p>
            </div>
          </div>
        </Motion.div>
        
        <Motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h2 className="text-xl font-semibold mb-6 text-[#01426A] border-b pb-2">Áreas y equipos</h2>
          <div className="grid grid-cols-1 gap-6">
            <div className="border border-gray-100 rounded-lg p-4">
              <h3 className="text-sm text-center text-gray-500 mb-1">Grupo de trabajo</h3>
              <p className="text-center font-medium">{proyecto.grupoTrabajo}</p>
            </div>
            
            <div className="border border-gray-100 rounded-lg p-4">
              <h3 className="text-sm text-center text-gray-500 mb-1">Área principal - Área</h3>
              <p className="text-center font-medium">{proyecto.mainAreaArea}</p>
            </div>
          </div>
        </Motion.div>
      </div>
      
      {/* Tabla de empleados del proyecto */}
      <Motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white rounded-xl shadow-sm p-6 mt-6"
      >
        <h2 className="text-xl font-semibold mb-6 text-[#01426A] border-b pb-2 flex items-center gap-2">
          <Users size={20} />
          Empleados del proyecto
        </h2>
        
        {/* Una sola tabla con scroll responsivo */}
        <div className="employee-table-container">
          {noWorkTeam ? (
            <div className="text-center py-10 text-gray-600">No existe un equipo para este proyecto.</div>
          ) : (
            <ProjectEmployeesTable
            employeeActivities={Array.isArray(empleados) ? empleados.map(e => ({
              fullName: (e.nombre && e.apellido) ? `${e.nombre} ${e.apellido}` : e.nombre || '',
              cuscaId: e.cuscaID || e.cuscaId || '',
              actividades: e.actividades ?? 0,
              employeeId: e.id || e.employeeId
            })) : []}
            emptyMessage="No hay empleados actualmente en el equipo del proyecto."
          />
          )}
        </div>
      </Motion.div>
      
      {/* Modal de Recursos */}
      {showResourcesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-[9999] flex items-center justify-center p-4">
          <Motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Recursos del proyecto</h3>
              <button onClick={() => setShowResourcesModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            
            <ResourcesList projectId={id} projectName={proyecto?.nombre} />
            
            <div className="mt-6 flex justify-end">
            <Button
              variant="btn_second_secondary"
              onClick={() => setShowResourcesModal(false)}
            >
              
              Cerrar
            </Button>
            </div>
          </Motion.div>
        </div>
      )}
    </div>
  );
}

