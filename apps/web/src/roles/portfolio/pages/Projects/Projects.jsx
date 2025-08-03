import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { createPortal } from 'react-dom';
import Modal from 'react-modal';
import { Search, Plus, X, Loader, Filter, Eye } from 'lucide-react';
import ProjectCard from '../../../../components/Projects/ProjectCard';
import CustomHeading from '../../../../components/Titles/TitleH1';
import CustomSubtitle from '../../../../components/Titles/Subtitle';
import FilterButton from '../../../../components/ui/FilterButton';
import { Button } from "../../../../components/Buttons";
import { SearchComponent } from '../../../../components/Search';
import { useProjects } from './hooks';

// Importamos los estilos personalizados
import './Projects.css';

// Asegurar que Modal se configure correctamente para accesibilidad
Modal.setAppElement('#root');

/**
 * Wrapper que renderiza el elemento arrastrado en un portal para evitar problemas de z-index/overflow
 * Se encarga de renderizar el elemento arrastrado en el body cuando está siendo arrastrado
 */
const PortalAwareDraggable = ({ children, ...props }) => (
  <Draggable {...props}>
    {(provided, snapshot) => {
      const childSnapshot = children(provided, snapshot);
      // Si se está arrastrando, renderizar en portal (body)
      return snapshot.isDragging
        ? createPortal(childSnapshot, document.body)
        : childSnapshot;
    }}
  </Draggable>
);

/**
 * Componente de página para mostrar el listado de proyectos en vista kanban con drag and drop
 * 
 * Este componente se encarga de:
 * - Mostrar proyectos organizados en columnas por estado con funcionalidad drag and drop
 * - Proporcionar filtros de búsqueda, estado y visibilidad
 * - Manejar responsive design (2 o 4 columnas según el ancho de pantalla)
 * - Mostrar estados de carga, error y vacío
 * - Proporcionar navegación a detalles de proyectos
 * - Gestionar modales de confirmación para cambios de estado
 * - Manejar reordenamiento de proyectos dentro de columnas
 * 
 * Utiliza el hook useProjects para obtener y manejar todos los datos y lógica
 */
export default function Projects() {
  // Obtener todos los datos y funciones del hook personalizado
  const {
    // Estados de filtros y UI
    searchTerm,
    selectedStatus,
    selectedVisibility,
    showStatusFilter,
    showVisibilityFilter,
    
    // Estados de modales y drag and drop
    modalIsOpen,
    currentDrag,
    availableStatusOptions,
    selectedNewStatus,
    
    // Estados de UI
    loading,
    error,
    shouldShowTwoColumns,
    
    // Funciones para manejar la UI
    setSearchTerm,
    handleStatusSelect,
    handleVisibilitySelect,
    handleStatusOptionSelect,
    
    // Funciones de drag and drop
    handleDragEnd,
    confirmStatusChange,
    closeModal,
    
    // Funciones auxiliares
    getColumnProjects,
    
    // Funciones de navegación
    navigate,
    
    // Constantes
    projectStatuses
  } = useProjects();



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

            {showStatusFilter && (
              <div className="absolute top-full left-0 mt-1 bg-white rounded-md shadow-lg border border-gray-200 p-2 z-10 min-w-[200px]">
                <div className="p-1 hover:bg-gray-50 cursor-pointer rounded" onClick={() => handleStatusSelect('all')}>
                  <span className={selectedStatus === 'all' ? 'font-medium text-blue-600' : ''}>
                    Todos
                  </span>
                </div>
                {Object.values(projectStatuses).map((status) => (
                  <div
                    key={status}
                    className="p-1 hover:bg-gray-50 cursor-pointer rounded"
                    onClick={() => handleStatusSelect(status)}
                  >
                    <span className={selectedStatus === status ? 'font-medium text-blue-600' : ''}>
                      {status}
                    </span>
                  </div>
                ))}
              </div>
            )}
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

            {showVisibilityFilter && (
              <div className="absolute top-full left-0 mt-1 bg-white rounded-md shadow-lg border border-gray-200 p-2 z-10 min-w-[200px]">
                <div className="p-1 hover:bg-gray-50 cursor-pointer rounded" onClick={() => handleVisibilitySelect('all')}>
                  <span className={selectedVisibility === 'all' ? 'font-medium text-blue-600' : ''}>
                    Todos
                  </span>
                </div>
                <div className="p-1 hover:bg-gray-50 cursor-pointer rounded" onClick={() => handleVisibilitySelect('visible')}>
                  <span className={selectedVisibility === 'visible' ? 'font-medium text-blue-600' : ''}>
                    Visible
                  </span>
                </div>
                <div className="p-1 hover:bg-gray-50 cursor-pointer rounded" onClick={() => handleVisibilitySelect('notVisible')}>
                  <span className={selectedVisibility === 'notVisible' ? 'font-medium text-blue-600' : ''}>
                    No visible
                  </span>
                </div>
              </div>
            )}
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
          <Button variant="btn_primary" onClick={() => navigate('/portafolio/proyectos/agregar-proyecto')}>
            <Plus size={18} />
            Agregar
          </Button>
        </div>
      </div>

      {/* Renderizado condicional para estado de carga */}
      {loading && (
        <div className="flex justify-center items-center py-10">
          <Loader className="animate-spin text-[#01426A]" size={40} />
          <span className="ml-2 text-[#01426A] font-medium">Cargando proyectos...</span>
        </div>
      )}

      {/* Renderizado condicional para estado de error */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg my-4">
          <p className="font-medium">Error al cargar los proyectos</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Contenedor principal de columnas kanban con responsive design */}
      <div
        className={`grid grid-cols-1 ${shouldShowTwoColumns ? 'sm:grid-cols-2' : 'sm:grid-cols-2 xl:grid-cols-4'} gap-4`}
      >
        <DragDropContext onDragEnd={handleDragEnd}>
          {/* Columna de proyectos pendientes */}
          <div className="flex flex-col h-auto">
            <CustomSubtitle
              text="Pendiente"
            />
            <Droppable droppableId="pending">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex-1 bg-white rounded-xl p-4 shadow-sm overflow-y-auto min-h-[500px] max-h-[calc(100vh-220px)] project-column ${snapshot.isDraggingOver ? "bg-blue-50" : ""
                    }`}
                >
                  {getColumnProjects('pending').map((project, index) => (
                    <PortalAwareDraggable key={project._id} draggableId={project._id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`mb-4 ${snapshot.isDragging ? "dragging-card" : ""}`}
                        >
                          <ProjectCard
                            project={{
                              id: project._id,
                              name: project.code || project.proyectName,
                              status: project.state || project.status,
                              area: project.workTeam || 'Sin equipo',
                              country: project.country,
                              priority: project.priority,
                              supervisor: project.supervisor,
                              trend: project.trend,
                              visible: project.visible,
                              visibility: project.visibility,
                            }}
                          />
                        </div>
                      )}
                    </PortalAwareDraggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>

          {/* Columna de proyectos en desarrollo */}
          <div className="flex flex-col h-auto">
            <CustomSubtitle
              text="Desarrollo"
            />
            <Droppable droppableId="inProgress">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex-1 bg-white rounded-xl p-4 shadow-sm overflow-y-auto min-h-[500px] max-h-[calc(100vh-220px)] project-column ${snapshot.isDraggingOver ? "bg-blue-50" : ""
                    }`}
                >
                  {getColumnProjects('inProgress').map((project, index) => (
                    <PortalAwareDraggable key={project._id} draggableId={project._id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`mb-4 ${snapshot.isDragging ? "dragging-card" : ""}`}
                        >
                          <ProjectCard
                            project={{
                              id: project._id,
                              name: project.code || project.proyectName,
                              status: project.state || project.status,
                              area: project.workTeam || 'Sin equipo',
                              country: project.country,
                              priority: project.priority,
                              supervisor: project.supervisor,
                              trend: project.trend,
                              visible: project.visible,
                              visibility: project.visibility,
                            }}
                          />
                        </div>
                      )}
                    </PortalAwareDraggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>

          {/* Columna de proyectos finalizados */}
          <div className="flex flex-col h-auto">
            <CustomSubtitle
              text="Finalizado"
            />
            <Droppable droppableId="completed">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex-1 bg-white rounded-xl p-4 shadow-sm overflow-y-auto min-h-[500px] max-h-[calc(100vh-220px)] project-column ${snapshot.isDraggingOver ? "bg-blue-50" : ""
                    }`}
                >
                  {getColumnProjects('completed').map((project, index) => (
                    <PortalAwareDraggable key={project._id} draggableId={project._id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`mb-4 ${snapshot.isDragging ? "dragging-card" : ""}`}
                        >
                          <ProjectCard
                            project={{
                              id: project._id,
                              name: project.code || project.proyectName,
                              status: project.state || project.status,
                              area: project.workTeam || 'Sin equipo',
                              country: project.country,
                              priority: project.priority,
                              supervisor: project.supervisor,
                              trend: project.trend,
                              visible: project.visible,
                              visibility: project.visibility,
                            }}
                          />
                        </div>
                      )}
                    </PortalAwareDraggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>

          {/* Columna de proyectos cancelados */}
          <div className="flex flex-col h-auto">
            <CustomSubtitle
              text="Cancelado"
            />
            <Droppable droppableId="canceled">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex-1 bg-white rounded-xl p-4 shadow-sm overflow-y-auto min-h-[500px] max-h-[calc(100vh-220px)] project-column ${snapshot.isDraggingOver ? "bg-blue-50" : ""
                    }`}
                >
                  {getColumnProjects('canceled').map((project, index) => (
                    <PortalAwareDraggable key={project._id} draggableId={project._id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`mb-4 ${snapshot.isDragging ? "dragging-card" : ""}`}
                        >
                          <ProjectCard
                            project={{
                              id: project._id,
                              name: project.code || project.proyectName,
                              status: project.state || project.status,
                              area: project.workTeam || 'Sin equipo',
                              country: project.country,
                              priority: project.priority,
                              supervisor: project.supervisor,
                              trend: project.trend,
                              visible: project.visible,
                              visibility: project.visibility,
                            }}
                          />
                        </div>
                      )}
                    </PortalAwareDraggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </DragDropContext>
      </div>

      {/* Modal de confirmación para cambio de estado de proyecto */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="modal-content"
        overlayClassName="modal-overlay"
        style={{
          content: {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            borderRadius: '12px',
            border: 'none',
            padding: '20px',
            width: 'auto',
            maxWidth: '90%',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)',
          },
          overlay: {
            position: 'fixed',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }
        }}
        contentLabel="Selección de estado del proyecto"
      >
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Seleccionar estado del proyecto</h2>

          <div className="text-center mb-6">
            <p className="text-lg text-gray-700 mb-4">
              Selecciona el nuevo estado para el proyecto <strong>{currentDrag.item?.proyectName}</strong>
            </p>

            {/* Opciones de estado según la columna destino */}
            <div className="flex flex-col space-y-3 my-6">
              {availableStatusOptions.map(status => (
                <button
                  key={status}
                  onClick={() => handleStatusOptionSelect(status)}
                  className={`p-4 rounded-lg border-2 transition-all ${selectedNewStatus === status
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                    }`}
                >
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${status === 'Pendiente' ? 'bg-blue-500' :
                        status === 'En proceso' ? 'bg-yellow-500' :
                          status === 'En riesgo' ? 'bg-purple-600' :
                            status === 'Atrasado' ? 'bg-red-500' :
                              status === 'Repriorizado' ? 'bg-pink-500' :
                                status === 'Finalizado' ? 'bg-green-500' :
                                  status === 'Cancelado' ? 'bg-gray-800' : 'bg-gray-400'
                      }`}></div>
                    <span className="text-left font-medium">{status}</span>
                  </div>
                </button>
              ))}
            </div>

            <p className="text-gray-600">
              Se les notificará a todos los integrantes de este cambio
            </p>
          </div>

          <div className="flex space-x-4 w-full">
            <button
              onClick={closeModal}
              className="flex-1 py-3 border border-gray-300 text-gray-700 font-semibold rounded-md transition-all duration-300 hover:bg-gray-100"
            >
              Cancelar
            </button>

            <button
              onClick={confirmStatusChange}
              className="flex-1 py-3 bg-[#FFC600] text-[#01426A] font-semibold rounded-md transition-all duration-300 border border-transparent hover:bg-[#FBFBFB] hover:text-[#FFC600] hover:border-[#FFC600] shadow-sm hover:shadow-md"
              disabled={!selectedNewStatus}
            >
              Confirmar
            </button>
          </div>

          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
          >
            <X size={24} />
          </button>
        </div>
      </Modal>
    </div>
  );
} 