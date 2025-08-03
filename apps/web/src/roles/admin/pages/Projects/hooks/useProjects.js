import { useState, useEffect, useMemo } from 'react';
import useProyectsApi from '../../../../../hooks/useProjectsApi';

/**
 * Constantes para los estados de proyectos
 * Mapea los estados internos a sus nombres en español para la UI
 */
const projectStatuses = {
  PENDING: 'Pendiente',
  IN_PROGRESS: 'En proceso',
  COMPLETED: 'Finalizado',
  CANCELED: 'Cancelado',
  DELAYED: 'Atrasado',
  AT_RISK: 'En riesgo',
  REPRIORITIZED: 'Repriorizado'
};

/**
 * Agrupación de estados para organizar proyectos en columnas
 * Cada grupo representa una columna en la vista de kanban
 */
const columnGroups = {
  pending: ['Pendiente', 'Repriorizado'],      // Columna de proyectos pendientes
  inProgress: ['En proceso', 'En riesgo', 'Atrasado'], // Columna de proyectos en desarrollo
  completed: ['Finalizado'],                   // Columna de proyectos finalizados
  canceled: ['Cancelado']                      // Columna de proyectos cancelados
};

/**
 * Hook personalizado para manejar la lógica de la página de listado de proyectos
 * 
 * Este hook se encarga de:
 * - Gestionar filtros de búsqueda, estado y visibilidad
 * - Manejar el responsive design (columnas adaptativas)
 * - Optimizar el filtrado de proyectos con useMemo
 * - Controlar estados de carga inicial y errores
 * - Proporcionar funciones para manejar la UI
 * 
 * @returns {Object} Objeto con todos los estados, datos y funciones necesarias
 */
export const useProjects = () => {
  // Obtener datos y funciones del hook principal de proyectos
  const { proyects, loading, error, refetch } = useProyectsApi();
  
  // Estados para filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('');           // Término de búsqueda
  const [selectedStatus, setSelectedStatus] = useState('all'); // Estado seleccionado
  const [selectedVisibility, setSelectedVisibility] = useState('all'); // Visibilidad seleccionada
  
  // Estados para responsive design
  const [windowWidth, setWindowWidth] = useState(window.innerWidth); // Ancho de ventana actual
  const [isInitialLoad, setIsInitialLoad] = useState(true);          // Estado de carga inicial

  /**
   * Efecto para manejar el responsive design con throttling
   * Actualiza el ancho de ventana cada 100ms máximo para optimizar rendimiento
   */
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    let timeoutId = null;
    const handleResizeWithThrottle = () => {
      if (timeoutId === null) {
        timeoutId = setTimeout(() => {
          handleResize();
          timeoutId = null;
        }, 100); // 100ms throttle para evitar demasiadas actualizaciones
      }
    };

    window.addEventListener('resize', handleResizeWithThrottle);

    return () => {
      window.removeEventListener('resize', handleResizeWithThrottle);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  /**
   * Efecto para manejar el estado de carga inicial
   * Se ejecuta cuando los proyectos terminan de cargar
   */
  useEffect(() => {
    if (!loading && proyects.length >= 0) {
      setIsInitialLoad(false);
    }
  }, [loading, proyects]);

  /**
   * Filtrado optimizado de proyectos usando useMemo
   * Solo se recalcula cuando cambian los filtros o la lista de proyectos
   */
  const filteredProjects = useMemo(() => {
    // Si no hay filtros activos, retornar todos los proyectos
    if (!searchTerm && selectedStatus === 'all' && selectedVisibility === 'all') {
      return proyects;
    }

    // Aplicar filtros combinados
    return proyects.filter(project => {
      // Filtro por término de búsqueda (nombre, código o supervisor)
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm ||
        project.proyectName?.toLowerCase().includes(searchLower) ||
        project.code?.toLowerCase().includes(searchLower) ||
        project.supervisor?.toLowerCase().includes(searchLower);

      // Filtro por estado del proyecto
      const matchesStatus = selectedStatus === 'all' || project.state === selectedStatus;

      // Filtro por visibilidad del proyecto
      const matchesVisibility = selectedVisibility === 'all' ||
        (selectedVisibility === 'visible' ? project.visible : !project.visible);

      // Proyecto debe cumplir todos los filtros
      return matchesSearch && matchesStatus && matchesVisibility;
    });
  }, [searchTerm, selectedStatus, selectedVisibility, proyects]);

  /**
   * Función para obtener proyectos de una columna específica
   * @param {string} columnId - ID de la columna (pending, inProgress, completed, canceled)
   * @returns {Array} Lista de proyectos que pertenecen a esa columna
   */
  const getColumnProjects = (columnId) => {
    const statuses = columnGroups[columnId];
    return filteredProjects.filter(p => statuses.includes(p.status || p.state));
  };

  /**
   * Manejador para cambio de filtro de estado
   * @param {string} status - Nuevo estado seleccionado
   */
  const handleStatusSelect = (status) => {
    setSelectedStatus(status);
  };

  /**
   * Manejador para cambio de filtro de visibilidad
   * @param {string} visibility - Nueva visibilidad seleccionada
   */
  const handleVisibilitySelect = (visibility) => {
    setSelectedVisibility(visibility);
  };

  /**
   * Manejador para reintentar carga de datos
   * Se ejecuta cuando hay un error y el usuario quiere reintentar
   */
  const handleRetry = () => {
    if (refetch) {
      refetch();
    }
  };

  /**
   * Determina si se deben mostrar 2 columnas en lugar de 4
   * Basado en el ancho de la ventana para responsive design
   */
  const shouldShowTwoColumns = windowWidth < 1200;

  // Retornar todos los datos y funciones necesarias para el componente
  return {
    // Estados de filtros y UI
    searchTerm,           // Término de búsqueda actual
    selectedStatus,       // Estado seleccionado en el filtro
    selectedVisibility,   // Visibilidad seleccionada en el filtro
    isInitialLoad,        // Indica si es la carga inicial
    
    // Datos
    proyects,             // Lista completa de proyectos
    filteredProjects,     // Lista de proyectos filtrados
    
    // Estados de UI
    loading,              // Estado de carga del hook principal
    error,                // Estado de error del hook principal
    shouldShowTwoColumns, // Indica si mostrar 2 columnas (responsive)
    
    // Funciones para manejar la UI
    setSearchTerm,        // Función para actualizar término de búsqueda
    handleStatusSelect,   // Función para cambiar filtro de estado
    handleVisibilitySelect, // Función para cambiar filtro de visibilidad
    handleRetry,          // Función para reintentar carga
    getColumnProjects,    // Función para obtener proyectos por columna
    refetch,              // Función para recargar datos
    
    // Constantes
    projectStatuses       // Mapeo de estados para la UI
  };
}; 