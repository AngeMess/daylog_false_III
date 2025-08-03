import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../../../../context/NotificationContext';
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
 * Estados disponibles para seleccionar en cada columna
 * Define qué estados se pueden asignar al mover un proyecto a cada columna
 */
const columnStatusOptions = {
  pending: ['Pendiente', 'Repriorizado'],
  inProgress: ['En proceso', 'En riesgo', 'Atrasado'],
  completed: ['Finalizado'],
  canceled: ['Cancelado']
};

/**
 * Hook personalizado para manejar la lógica de la página de listado de proyectos en portfolio
 * 
 * Este hook se encarga de:
 * - Gestionar filtros de búsqueda, estado y visibilidad
 * - Manejar el responsive design (columnas adaptativas)
 * - Optimizar el filtrado de proyectos con useMemo
 * - Controlar estados de carga inicial y errores
 * - Manejar funcionalidad de drag and drop
 * - Gestionar modales de confirmación de cambios de estado
 * - Proporcionar funciones para manejar la UI
 * 
 * @returns {Object} Objeto con todos los estados, datos y funciones necesarias
 */
export const useProjects = () => {
  // Hooks de navegación y notificaciones
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  
  // Obtener datos y funciones del hook principal de proyectos
  const { proyects, loading, error, changeProyectStatus, changeProyectStatusAndVisibility } = useProyectsApi();
  
  // Estados para filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('');           // Término de búsqueda
  const [selectedStatus, setSelectedStatus] = useState('all'); // Estado seleccionado
  const [selectedVisibility, setSelectedVisibility] = useState('all'); // Visibilidad seleccionada
  
  // Estados para modales y drag and drop
  const [modalIsOpen, setModalIsOpen] = useState(false);      // Estado del modal de confirmación
  const [currentDrag, setCurrentDrag] = useState({ item: null, destination: null }); // Información del drag actual
  const [availableStatusOptions, setAvailableStatusOptions] = useState([]); // Opciones de estado disponibles
  const [selectedNewStatus, setSelectedNewStatus] = useState(''); // Nuevo estado seleccionado
  
  // Estados para filtros desplegables
  const [showStatusFilter, setShowStatusFilter] = useState(false);     // Mostrar filtro de estado
  const [showVisibilityFilter, setShowVisibilityFilter] = useState(false); // Mostrar filtro de visibilidad
  
  // Estados para responsive design
  const [windowWidth, setWindowWidth] = useState(window.innerWidth); // Ancho de ventana actual

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
      // Filtro por término de búsqueda (nombre, código, tipo o supervisor)
      const matchesSearch = !searchTerm ||
        project.proyectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.supervisor?.toLowerCase().includes(searchTerm.toLowerCase());

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
   * Determina el estado basado en el ID de columna
   * Para simplificar, usa el primer estado de cada grupo como el estado principal
   * @param {string} columnId - ID de la columna
   * @returns {string} Estado principal de la columna
   */
  const getStatusFromColumnId = (columnId) => {
    return columnGroups[columnId][0];
  };

  /**
   * Manejador para el final del drag and drop
   * @param {Object} result - Resultado del drag and drop
   */
  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    // Si no hay destino válido, no hacer nada
    if (!destination) return;

    // Si el destino es el mismo que el origen, no hacer nada
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    if (destination.droppableId !== source.droppableId) {
      // Cambio de estado, mostrar confirmación
      const projectToUpdate = proyects.find(p => p._id === draggableId);
      if (!projectToUpdate) {
        console.error('No se encontró el proyecto con ID:', draggableId);
        return;
      }

      // Guardar la información necesaria para realizar el cambio después
      setCurrentDrag({
        item: projectToUpdate,
        destination: {
          droppableId: destination.droppableId,
          index: destination.index
        },
        source: {
          droppableId: source.droppableId,
          index: source.index
        }
      });

      // Establecer las opciones de estado disponibles según la columna destino
      const statusOptions = columnStatusOptions[destination.droppableId] || [];
      setAvailableStatusOptions(statusOptions);

      // Establecer el estado predeterminado seleccionado (el primero de la lista)
      if (statusOptions.length > 0) {
        setSelectedNewStatus(statusOptions[0]);
      }

      setModalIsOpen(true);
    } else {
      // Solo reordenamiento dentro de la misma columna
      reorderProjects(source.droppableId, source.index, destination.index);
    }
  };

  /**
   * Función para reordenar proyectos dentro de la misma columna
   * @param {string} columnId - ID de la columna
   * @param {number} startIndex - Índice inicial
   * @param {number} endIndex - Índice final
   */
  const reorderProjects = (columnId, startIndex, endIndex) => {
    const status = getStatusFromColumnId(columnId);
    const projectsInColumn = filteredProjects.filter(p => (p.status || p.state) === status);

    // Reordenar los proyectos en la columna
    const [movedProject] = projectsInColumn.splice(startIndex, 1);
    projectsInColumn.splice(endIndex, 0, movedProject);

    // Nota: Actualmente no hay una API para guardar el orden de los proyectos
    // Por ahora solo registramos la acción en la consola
    console.log('Reordenando proyectos en columna:', columnId, 'Proyecto:', movedProject._id);

    // En una implementación futura, aquí se podría llamar a una API para actualizar el orden
  };

  /**
   * Función para confirmar el cambio de estado del proyecto
   */
  const confirmStatusChange = async () => {
    if (!currentDrag.item || !selectedNewStatus) {
      console.error('Faltan datos para confirmar el cambio de estado');
      return;
    }

    try {
      // Cambiar el estado del proyecto
      const result = await changeProyectStatusAndVisibility(currentDrag.item._id, selectedNewStatus);
      
      if (result) {
        addNotification({
          type: 'success',
          title: 'Proyecto actualizado',
          message: 'Estado del proyecto actualizado correctamente',
          targetRoles: ['portfolio', 'admin', 'supervisor'] // Visible para gestores de proyectos
        });
        setModalIsOpen(false);
        setCurrentDrag({ item: null, destination: null });
        setSelectedNewStatus('');
      } else {
        addNotification({
          type: 'error',
          title: 'Error en actualización',
          message: 'Error al actualizar el estado del proyecto',
          targetRoles: ['portfolio', 'admin', 'supervisor']
        });
      }
    } catch (error) {
      console.error('Error al cambiar el estado del proyecto:', error);
      addNotification({
        type: 'error',
        title: 'Error en actualización',
        message: 'Error al actualizar el estado del proyecto',
        targetRoles: ['portfolio', 'admin', 'supervisor']
      });
    }
  };
  const cancelStatusChange = () => {
    setModalIsOpen(false);
    setCurrentDrag({ item: null, destination: null });
    setSelectedNewStatus('');
  };

  /**
   * Función para cerrar el modal
   */
  const closeModal = () => {
    setModalIsOpen(false);
  };

  /**
   * Manejadores para filtros desplegables
   */
  const handleStatusFilterClick = () => {
    setShowStatusFilter(!showStatusFilter);
    if (showVisibilityFilter) setShowVisibilityFilter(false);
  };

  const handleVisibilityFilterClick = () => {
    setShowVisibilityFilter(!showVisibilityFilter);
    if (showStatusFilter) setShowStatusFilter(false);
  };

  /**
   * Manejadores para selección de filtros
   */
  const handleStatusSelect = (status) => {
    setSelectedStatus(status);
    setShowStatusFilter(false);
  };

  const handleVisibilitySelect = (visibility) => {
    setSelectedVisibility(visibility);
    setShowVisibilityFilter(false);
  };

  const handleStatusOptionSelect = (status) => {
    setSelectedNewStatus(status);
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
    showStatusFilter,     // Mostrar filtro de estado
    showVisibilityFilter, // Mostrar filtro de visibilidad
    
    // Estados de modales y drag and drop
    modalIsOpen,          // Estado del modal de confirmación
    currentDrag,          // Información del drag actual
    availableStatusOptions, // Opciones de estado disponibles
    selectedNewStatus,    // Nuevo estado seleccionado
    
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
    handleStatusFilterClick, // Función para mostrar/ocultar filtro de estado
    handleVisibilityFilterClick, // Función para mostrar/ocultar filtro de visibilidad
    handleStatusOptionSelect, // Función para seleccionar opción de estado en modal
    
    // Funciones de drag and drop
    handleDragEnd,        // Función para manejar el final del drag
    confirmStatusChange,  // Función para confirmar cambio de estado
    cancelStatusChange,   // Función para cancelar cambio de estado
    closeModal,           // Función para cerrar el modal
    
    // Funciones auxiliares
    getColumnProjects,    // Función para obtener proyectos por columna
    getStatusFromColumnId, // Función para obtener estado de columna
    
    // Funciones de navegación
    navigate,             // Función de navegación
    
    // Constantes
    projectStatuses       // Mapeo de estados para la UI
  };
}; 