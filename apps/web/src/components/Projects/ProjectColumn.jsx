import React from 'react';
import CustomSubtitle from '../Titles/Subtitle';
import ProjectCard from './ProjectCard'; 

/**
 * Componente de columna para mostrar proyectos
 * 
 * Este componente renderiza una columna que contiene proyectos de un estado específico
 * (ej: "En Progreso", "Completado", "Pendiente"). Cada proyecto se muestra como una
 * tarjeta individual con scroll automático para manejar listas largas.
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.title - Título de la columna (estado de los proyectos)
 * @param {Array} props.projects - Array de proyectos a mostrar en la columna
 * @param {string} props.projects[]._id - ID único del proyecto
 * @param {string} props.projects[].code - Código del proyecto
 * @param {string} props.projects[].proyectName - Nombre del proyecto
 * @param {string} props.projects[].state - Estado del proyecto
 * @param {string} props.projects[].status - Estado alternativo del proyecto
 * @param {string} props.projects[].workTeam - Equipo de trabajo asignado
 * @param {string} props.projects[].country - País del proyecto
 * @param {string} props.projects[].priority - Prioridad del proyecto
 * @param {string} props.projects[].supervisor - Supervisor del proyecto
 * @param {string} props.projects[].trend - Tendencia del proyecto
 * @param {boolean} props.projects[].visible - Si el proyecto es visible
 * @param {string} props.projects[].visibility - Nivel de visibilidad
 * @param {Function} props.renderEmptyState - Función para renderizar estado vacío
 * @returns {JSX.Element} El componente ProjectColumn renderizado
 * 
 * @example
 * // Columna básica de proyectos
 * <ProjectColumn 
 *   title="En Progreso"
 *   projects={proyectosEnProgreso}
 *   renderEmptyState={(title) => <p>No hay proyectos {title}</p>}
 * />
 * 
 * // Columna con proyectos específicos
 * <ProjectColumn 
 *   title="Completados"
 *   projects={proyectosCompletados}
 *   renderEmptyState={renderEmptyState}
 * />
 */
export default function ProjectColumn({ title, projects, renderEmptyState }) {
  return (
    <div className="flex flex-col h-auto">
      <CustomSubtitle text={title} />
      <div className="flex-1 bg-white rounded-xl p-4 shadow-sm overflow-y-auto min-h-[500px] max-h-[calc(100vh-220px)] project-column">
        {projects.length > 0 ? (
          projects.map((project) => (
            <div key={project._id} className="mb-4">
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
          ))
        ) : (
          renderEmptyState(title)
        )}
      </div>
    </div>
  );
}