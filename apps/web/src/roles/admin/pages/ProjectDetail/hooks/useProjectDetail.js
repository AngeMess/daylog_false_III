import { useState, useEffect } from 'react';
import useProyectsApi from '../../../../../hooks/useProjectsApi';

/**
 * Hook personalizado para manejar la lógica de la página de detalles de proyecto
 * 
 * Este hook se encarga de:
 * - Obtener los datos completos de un proyecto específico
 * - Obtener el conteo de actividades por empleado del equipo de trabajo
 * - Mapear y transformar los datos de empleados para la UI
 * - Manejar estados de carga y errores
 * 
 * @param {string} projectId - ID del proyecto a cargar
 * @returns {Object} Objeto con project, employees, loading y error
 */
export const useProjectDetail = (projectId) => {
  // Obtener funciones y estados del hook principal de proyectos
  const { getProyectById, getEmployeeActivityCounts, loading, error } = useProyectsApi();
  
  // Estado local para almacenar los datos del proyecto
  const [project, setProject] = useState(null);
  
  // Estado local para almacenar la lista de empleados con sus actividades
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    /**
     * Función asíncrona para cargar todos los datos del proyecto
     * Se ejecuta cuando cambia el projectId o las funciones del hook principal
     */
    const fetchProjectData = async () => {
      try {
        // Paso 1: Obtener datos completos del proyecto con populate
        const projectData = await getProyectById(projectId);
        if (projectData) {
          setProject(projectData);
          
          // Paso 2: Obtener conteo de actividades por empleado
          const activities = await getEmployeeActivityCounts(projectId);

          // Paso 3: Mapear empleados del equipo con sus conteos de actividad
          let employeeList = [];
          if (projectData.workTeam && Array.isArray(projectData.workTeam.employees)) {
            // Crear un mapa para acceder rápidamente a los conteos por employeeId
            const countMap = {};
            activities.forEach((c) => {
              countMap[c.employeeId] = c.actividades;
            });

            // Transformar la lista de empleados agregando el conteo de actividades
            employeeList = projectData.workTeam.employees
              .map((e) => (typeof e.id === 'object' ? e.id : e.id)) // Manejar casos donde id es un objeto (populate)
              .filter(Boolean) // Filtrar empleados nulos o undefined
              .map((emp) => {
                // Separar nombre completo en nombre y apellido para la UI
                const [nombre, ...rest] = (emp.fullName || '').split(' ');
                return {
                  id: emp._id,
                  nombre,
                  apellido: rest.join(' '),
                  cuscaID: emp.cuscaId,
                  actividades: countMap[emp._id] || 0, // Usar conteo del mapa o 0 por defecto
                };
              });
          }

          setEmployees(employeeList);
        }
      } catch (err) {
        console.error('Error al cargar datos del proyecto:', err);
      }
    };
    
    // Solo ejecutar si tenemos un projectId válido
    if (projectId) {
      fetchProjectData();
    }
  }, [projectId, getProyectById, getEmployeeActivityCounts]);

  // Retornar todos los datos y estados necesarios para el componente
  return {
    project,      // Datos completos del proyecto
    employees,    // Lista de empleados con conteo de actividades
    loading,      // Estado de carga del hook principal
    error         // Estado de error del hook principal
  };
}; 