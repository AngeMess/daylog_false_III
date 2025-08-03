import React from 'react';
import { Search, Filter, Eye, FolderOpen, Plus } from 'lucide-react';
import FilterButton from '../../../../components/ui/FilterButton';
import ProjectCard from '../../../../components/Projects/ProjectCard'; 
import ProjectColumn from '../../../../components/Projects/ProjectColumn'; 
import CustomHeading from '../../../../components/Titles/TitleH1';
import CustomSubtitle from '../../../../components/Titles/Subtitle';
import { SearchComponent } from "../../../../components/Search"; 
import { LoadingState, ErrorState, EmptyState } from '../../../../components/ui/stateHandler.jsx';
import { useProjects } from './hooks';

import './Projects.css';

/**
 * Componente de página para mostrar el listado de proyectos en vista kanban
 * 
 * Este componente se encarga de:
 * - Mostrar proyectos organizados en columnas por estado
 * - Proporcionar filtros de búsqueda, estado y visibilidad
 * - Manejar responsive design (2 o 4 columnas según el ancho de pantalla)
 * - Mostrar estados de carga, error y vacío
 * - Proporcionar navegación a detalles de proyectos
 * 
 * Utiliza el hook useProjects para obtener y manejar todos los datos y lógica
 */
export default function Projects() {
  const {
    // Estados
    searchTerm,
    selectedStatus,
    selectedVisibility,
    isInitialLoad,
    
    // Datos
    proyects,
    filteredProjects,
    
    // Estados de UI
    loading,
    error,
    shouldShowTwoColumns,
    
    // Funciones
    setSearchTerm,
    handleStatusSelect,
    handleVisibilitySelect,
    handleRetry,
    getColumnProjects,
    refetch,
    
    // Constantes
    projectStatuses
  } = useProjects();

  // Renderizado condicional para estado de carga (incluyendo carga inicial)
  if (loading || isInitialLoad) {
    return (
      <div className="p-6 w-full min-h-screen bg-white" style={{ isolation: 'isolate' }}>
        <div className="projects-header">
          <CustomHeading
            text="Proyectos"
            color="#01426A"
          />
        </div>
        <LoadingState message="Cargando proyectos..." />
      </div>
    );
  }

  // Renderizado condicional para estado de error
  if (error) {
    return (
      <div className="p-6 w-full min-h-screen bg-white" style={{ isolation: 'isolate' }}>
        <div className="projects-header">
          <CustomHeading
            text="Proyectos"
            color="#01426A"
          />
        </div>
        <ErrorState
          message="Error al cargar los proyectos"
          onRetry={handleRetry}
          showRetryButton={!!refetch}
        />
      </div>
    );
  }

  // Renderizado condicional para estado vacío cuando no hay proyectos (solo después de cargar)
  if (!loading && !error && proyects.length === 0) {
    return (
      <div className="p-6 w-full min-h-screen bg-white" style={{ isolation: 'isolate' }}>
        <div className="projects-header">
          <CustomHeading
            text="Proyectos"
            color="#01426A"
          />
        </div>
        <EmptyState
          message="No hay proyectos disponibles"
          description="Aún no se han creado proyectos en el sistema."
          icon={FolderOpen}
          iconColor="text-blue-400"
        />
      </div>
    );
  }

  /**
   * Función para renderizar el estado vacío de cada columna
   * Muestra un mensaje específico según el tipo de columna
   * 
   * @param {string} columnTitle - Título de la columna (Pendiente, Desarrollo, etc.)
   * @returns {JSX.Element} Componente EmptyState personalizado para la columna
   */
  const renderColumnEmptyState = (columnTitle) => {
    /**
     * Función auxiliar para obtener el mensaje específico según el tipo de columna
     * @param {string} title - Título de la columna
     * @returns {string} Mensaje personalizado para el estado vacío
     */
    const getEmptyMessage = (title) => {
      switch (title) {
        case 'Pendiente':
          return 'No hay proyectos pendientes';
        case 'Desarrollo':
          return 'No hay proyectos en desarrollo';
        case 'Finalizado':
          return 'No hay proyectos finalizados';
        case 'Cancelado':
          return 'No hay proyectos cancelados';
        default:
          return 'No hay proyectos';
      }
    };

    return (
      <div className="flex items-center justify-center py-8">
        <EmptyState
          message={getEmptyMessage(columnTitle)}
          description={`Los proyectos aparecerán aquí cuando cambien al estado ${columnTitle.toLowerCase()}.`}
          icon={FolderOpen}
          iconColor="text-gray-300"
        />
      </div>
    );
  };

  return (
    <div className="p-6 w-full min-h-screen bg-white" style={{ isolation: 'isolate' }}>
      <div className="projects-header">
        <CustomHeading
          text="Proyectos"
          color="#01426A"
        />

        <div className="projects-controls">
          {/* Filtro de Estado */}
          <div className="relative mr-2">
            <FilterButton
              label={selectedStatus === 'all' ? 'Estado' : selectedStatus}
              icon={Filter}
              options={[
                { value: 'all', label: 'Todos' },
                ...Object.values(projectStatuses).map(status => ({ value: status, label: status }))
              ]}
              onSelect={handleStatusSelect}
              selectedValue={selectedStatus}
              title="Estado"
            />
          </div>
          {/* Filtro de Visibilidad */}
          <div className="relative mr-2">
            <FilterButton
              label={selectedVisibility === 'all' ? 'Visibilidad' :
                selectedVisibility === 'visible' ? 'Visible' : 'No visible'}
              icon={Eye}
              options={[
                { value: 'all', label: 'Todos' },
                { value: 'visible', label: 'Visible' },
                { value: 'notVisible', label: 'No visible' }
              ]}
              onSelect={handleVisibilitySelect}
              selectedValue={selectedVisibility}
              title="Visibilidad"
            />
          </div>

                    <div className="relative">
            <SearchComponent
              type="text"
              placeholder="Buscar por código o nombre"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>
      </div>

      {/* Renderizado condicional para estado vacío cuando no hay proyectos filtrados */}
      {filteredProjects.length === 0 && !loading && !error && (
        <EmptyState
          message="No se encontraron proyectos"
          description="Prueba ajustando los filtros o términos de búsqueda para encontrar los proyectos que buscas."
          icon={Search}
          iconColor="text-gray-400"
        />
      )}

      {/* Renderizado condicional para mostrar las columnas kanban solo si hay proyectos filtrados */}
      {filteredProjects.length > 0 && (
        <div
          className={`grid grid-cols-1 ${shouldShowTwoColumns ? 'sm:grid-cols-2' : 'sm:grid-cols-2 xl:grid-cols-4'} gap-4`}
        >
          {/* Columnas de proyectos organizadas por estado */}
          <ProjectColumn
            title="Pendiente"
            projects={getColumnProjects('pending')}
            renderEmptyState={renderColumnEmptyState}
          />
          <ProjectColumn
            title="Desarrollo"
            projects={getColumnProjects('inProgress')}
            renderEmptyState={renderColumnEmptyState}
          />
          <ProjectColumn
            title="Finalizado"
            projects={getColumnProjects('completed')}
            renderEmptyState={renderColumnEmptyState}
          />
          <ProjectColumn
            title="Cancelado"
            projects={getColumnProjects('canceled')}
            renderEmptyState={renderColumnEmptyState}
          />
        </div>
      )}
    </div>
  );
}