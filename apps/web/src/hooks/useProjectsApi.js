import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';

// Hook personalizado para interactuar con la API de proyectos
const useProyectsApi = () => {
  const [proyects, setProyects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // URL base de la API
  const API_URL = 'http://localhost:3000/api/proyect';
  const API_ACTIVITY_URL = 'http://localhost:3000/api/activity';

  // Ref para almacenar el AbortController actual
  const abortControllerRef = useRef(null);

  // Función para cancelar peticiones anteriores
  const cancelPreviousRequests = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
  };

  // Función para cargar todos los proyectos con populate completo
  const getProyects = useCallback(async () => {
    // Cancelar peticiones anteriores
    cancelPreviousRequests();
    
    setLoading(true);
    setError(null);
    
    try {
      // Hacer una sola llamada con populate completo para obtener todos los datos necesarios
      const response = await axios.get(`${API_URL}?populate=country,supervisor,workTeam.employees,mainAreaArea.mainArea,mainAreaArea.area`, {
        signal: abortControllerRef.current.signal
      });
      
              // Transformar datos de forma más eficiente
        const transformedProyects = response.data.map(proyect => {
          // Calcular prioridad basada en la fecha de finalización y el estado
          const today = new Date();
          const finishDate = new Date(proyect.finishDate);
          const daysToFinish = Math.ceil((finishDate - today) / (1000 * 60 * 60 * 24));
          
          // Calculamos prioridad basada en días restantes y saturación
          let priority = 50; // Valor por defecto
          
          // Si hay pocos días o está retrasado, aumenta la prioridad
          if (daysToFinish < 7) {
            priority += 30;
          } else if (daysToFinish < 15) {
            priority += 20;
          }
          
          // Si la saturación es alta, aumenta la prioridad
          if (proyect.saturation === "Alta") {
            priority += 20;
          }
          
          // Limitar prioridad a 100
          if (priority > 100) priority = 100;
          
          // Simular tendencia (en un escenario real esto podría basarse en métricas históricas)
          const trends = ['up', 'down', 'steady'];
          const trend = trends[Math.floor(Math.random() * trends.length)];
          
          // Transformar estado a formato compatible con la UI
          let status;
          switch (proyect.state) {
            case "En proceso":
              status = "En proceso";
              break;
            case "Finalizado":
              status = "Finalizado";
              break;
            case "Cancelado":
              status = "Cancelado";
              break;
            case "Atrasado":
              status = "Atrasado";
              break;
            case "En Riesgo":
case "En riesgo":
status = "En riesgo";
              break;
            case "Repriorizado":
              status = "Repriorizado";
              break;
            default:
              status = "Pendiente";
          }
          
          // Unificar sistema de visibilidad
          // visible: true/false (para la API)
          // visibility: 'Visible'/'Privado' (para la UI)
          let visibility;
          const visible = proyect.visible === undefined ? false : proyect.visible;
          
          if (visible === true) {
            visibility = 'Visible';
          } else {
            visibility = 'Privado';
          }
          
          // Extraer solo el texto necesario de los objetos referenciados
          // para evitar renderizar objetos completos en React
          const countryName = proyect.country?.name || 'Sin país';
          const supervisorName = proyect.supervisor?.fullName || 'Sin supervisor';
          const workTeamName = proyect.workTeam?.name || 'Sin equipo';
          const mainAreaAreaName = proyect.mainAreaArea ? 
            `${proyect.mainAreaArea.mainArea?.name || ''} - ${proyect.mainAreaArea.area?.name || ''}` : 
            'Sin área';
          
          return {
            ...proyect,
            status,
            priority,
            trend,
            visible,
            visibility,
            // Sobreescribimos las referencias a objetos con sus valores de texto
            country: countryName,
            supervisor: supervisorName,
            workTeam: workTeamName,
            mainAreaArea: mainAreaAreaName
          };
        });
      
      setProyects(transformedProyects);
    } catch (err) {
      // Solo mostrar error si no fue cancelado
      if (err.name !== 'CanceledError' && err.code !== 'ERR_CANCELED') {
        setError(err.message || 'Error al cargar los proyectos');
        console.error('Error al cargar los proyectos:', err);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para obtener un proyecto específico por ID con populate completo
  const getProyectById = useCallback(async (id) => {
    // Cancelar peticiones anteriores
    cancelPreviousRequests();
    
    setLoading(true);
    setError(null);
    
    try {
      // Hacer una sola llamada con populate completo
      const response = await axios.get(`${API_URL}/${id}?populate=country,supervisor,workTeam.employees,mainAreaArea.mainArea,mainAreaArea.area`, {
        signal: abortControllerRef.current.signal
      });
      return response.data;
    } catch (err) {
      // Solo mostrar error si no fue cancelado
      if (err.name !== 'CanceledError' && err.code !== 'ERR_CANCELED') {
        setError(err.message || 'Error al cargar el proyecto');
        console.error('Error al cargar el proyecto:', err);
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para crear un nuevo proyecto
  const createProyect = useCallback(async (proyectData) => {
    // Cancelar peticiones anteriores
    cancelPreviousRequests();
    
    setLoading(true);
    setError(null);
        try {
      // Verificar los datos del formulario para debugging
      console.log('Datos recibidos del formulario:', proyectData);
      
      // Asegurarnos de que la fecha de fin tiene un formato válido y no es null o undefined
      if (!proyectData.finishDate) {
        throw new Error('La fecha de fin es obligatoria y no puede estar vacía');
      }

      // Usar directamente los datos del formulario sin transformaciones innecesarias
      const transformedData = {
        code: proyectData.code,
        proyectName: proyectData.proyectName, // Corregido: usar proyectName con 'y'
        startDate: proyectData.startDate,
        finishDate: proyectData.finishDate, // Ahora validamos arriba que este campo no sea null
        size: proyectData.size, 
        state: proyectData.state, 
        workTeam: proyectData.workTeam, 
        country: proyectData.country, 
        visible: false, // Los proyectos nuevos siempre inician como no visibles
        eliminated: false, 
        supervisor: proyectData.supervisor || null, // Permitir null si no hay supervisor
        mainAreaArea: proyectData.mainAreaArea || null, // Permitir null si no hay área principal
        saturation: proyectData.saturation,
        visibility: "Privado" // Usar "Privado" en vez de "Publico" para que coincida con visible:false
      };
      
      console.log('Datos transformados que se enviarán al backend:', transformedData);
      
      const response = await axios.post(API_URL, transformedData, {
        signal: abortControllerRef.current.signal
      });
      await getProyects(); // Refrescar la lista después de crear
      return response.data;
    } catch (err) {
      // Solo mostrar error si no fue cancelado
      if (err.name !== 'CanceledError' && err.code !== 'ERR_CANCELED') {
        setError(err.message || 'Error al crear el proyecto');
        console.error('Error al crear el proyecto:', err);
        
        // Log adicional para errores 400
        if (err.response?.status === 400) {
          console.error('Error 400 - Detalles:', err.response.data);
        }
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, [getProyects]);

  // Función para actualizar un proyecto existente
  const updateProyect = useCallback(async (id, proyectData) => {
    // Cancelar peticiones anteriores
    cancelPreviousRequests();
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('Actualizando proyecto con ID:', id);

      // Primero obtenemos el proyecto actual para tener todos los datos
      const currentProject = await getProyectById(id);
      
      if (!currentProject) {
        throw new Error('No se pudo encontrar el proyecto');
      }

      // Si estamos actualizando la visibilidad, mantenemos el resto de campos igual
      if (Object.prototype.hasOwnProperty.call(proyectData, 'visible') && Object.keys(proyectData).length === 1) {
        console.log('Actualizando solo la visibilidad del proyecto');
        
        // Crear objeto de actualización con solo la visibilidad cambiada
        const updateData = {
          ...currentProject,
          visible: proyectData.visible,
          visibility: proyectData.visible ? 'Visible' : 'Privado'
        };
        
        const response = await axios.put(`${API_URL}/${id}`, updateData, {
          signal: abortControllerRef.current.signal
        });
        await getProyects(); // Refrescar la lista después de actualizar
        return response.data;
      } 
      // Caso normal, actualización completa del proyecto
      else {
        // Usar directamente los datos del formulario sin transformaciones innecesarias
        const transformedData = {
          code: proyectData.code || currentProject.code,
          proyectName: proyectData.proyectName || currentProject.proyectName, // Corregido: usar proyectName con 'y'
          startDate: proyectData.startDate || currentProject.startDate,
          finishDate: proyectData.endDate || currentProject.finishDate,
          size: proyectData.size || currentProject.size, // Ya viene con el formato correcto ('Grande', 'Mediano', 'Pequeño')
          state: proyectData.state || currentProject.state, // Ya viene con el formato correcto ('Pendiente', 'En proceso', 'Finalizado')
          workTeam: proyectData.workTeam || currentProject.workTeam, // ID del equipo de trabajo
          country: proyectData.country || currentProject.country, // ID del país
          supervisor: proyectData.supervisor || currentProject.supervisor, // ID del supervisor
          mainAreaArea: proyectData.mainAreaArea || currentProject.mainAreaArea, // ID del área principal
          saturation: proyectData.saturation || currentProject.saturation, // Ya viene con el formato correcto ('Baja', 'Normal', 'Alta')
          area: proyectData.area || currentProject.area // Mantener el campo area si existe
        };
        
        // Si el estado cambió a cualquier estado de desarrollo, forzar visibilidad a true
        if (['En proceso', 'En riesgo', 'Atrasado', 'Repriorizado'].includes(proyectData.state)) {
          transformedData.visible = true;
          transformedData.visibility = 'Visible';
        } else {
          // Si no, usar el valor de visibilidad del formulario
          transformedData.visible = proyectData.visibility === 'Visible' ? true : false;
          transformedData.visibility = proyectData.visibility || currentProject.visibility;
        }
        
        // Mantener el campo eliminated
        transformedData.eliminated = proyectData.eliminated !== undefined ? proyectData.eliminated : currentProject.eliminated;
        
        console.log('Datos transformados para actualización completa');
        
        const response = await axios.put(`${API_URL}/${id}`, transformedData, {
          signal: abortControllerRef.current.signal
        });
        await getProyects(); // Refrescar la lista después de actualizar
        return response.data;
      }
    } catch (err) {
      // Solo mostrar error si no fue cancelado
      if (err.name !== 'CanceledError' && err.code !== 'ERR_CANCELED') {
        setError(err.message || 'Error al actualizar el proyecto');
        console.error('Error al actualizar el proyecto:', err);
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, [getProyects, getProyectById]);

  // Función para eliminar un proyecto (eliminación lógica)
  const deleteProyect = useCallback(async (id) => {
    // Cancelar peticiones anteriores
    cancelPreviousRequests();
    
    setLoading(true);
    setError(null);
    
    try {
      // En lugar de eliminar físicamente, hacemos una actualización para marcar como eliminado
      const response = await axios.put(`${API_URL}/${id}`, { eliminated: true }, {
        signal: abortControllerRef.current.signal
      });
      await getProyects(); // Refrescar la lista después de eliminar
      return response.data;
    } catch (err) {
      // Solo mostrar error si no fue cancelado
      if (err.name !== 'CanceledError' && err.code !== 'ERR_CANCELED') {
        setError(err.message || 'Error al eliminar el proyecto');
        console.error('Error al eliminar el proyecto:', err);
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, [getProyects]);

  // Función para cambiar el estado de un proyecto
  const changeProyectStatus = useCallback(async (id, newStatus) => {
    // Cancelar peticiones anteriores
    cancelPreviousRequests();
    
    setLoading(true);
    setError(null);
    
    try {
      // Primero obtenemos el proyecto actual
      const currentProyect = await getProyectById(id);
      
      if (!currentProyect) {
        throw new Error('No se pudo encontrar el proyecto');
      }
      
      // Transformamos el estado al formato que espera el backend
      let state;
      switch (newStatus) {
        case 'Pendiente':
          state = 'Pendiente';
          break;
        case 'En proceso':
          state = 'En proceso';
          break;
        case 'Finalizado':
          state = 'Finalizado';
          break;
        case 'Cancelado':
          state = 'Cancelado';
          break;
        case 'Atrasado':
          state = 'Atrasado';
          break;
        case 'En riesgo':
state = 'En riesgo';
          break;
        case 'Repriorizado':
          state = 'Repriorizado';
          break;
        default:
          state = currentProyect.state;
      }
      
      // Actualizamos solo el estado
      const response = await axios.put(`${API_URL}/${id}`, { 
        ...currentProyect,
        state 
      }, {
        signal: abortControllerRef.current.signal
      });
      
      await getProyects(); // Refrescar la lista después de cambiar el estado
      return response.data;
    } catch (err) {
      // Solo mostrar error si no fue cancelado
      if (err.name !== 'CanceledError' && err.code !== 'ERR_CANCELED') {
        setError(err.message || 'Error al cambiar el estado del proyecto');
        console.error('Error al cambiar el estado del proyecto:', err);
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, [getProyectById, getProyects]);

  // Función para cambiar el estado de un proyecto y su visibilidad si es necesario
  const changeProyectStatusAndVisibility = useCallback(async (id, newStatus) => {
    // Cancelar peticiones anteriores
    cancelPreviousRequests();
    
    setLoading(true);
    setError(null);
    
    try {
      // Primero obtenemos el proyecto actual
      const currentProyect = await getProyectById(id);
      
      if (!currentProyect) {
        throw new Error('No se pudo encontrar el proyecto');
      }
      
      // Transformamos el estado al formato que espera el backend
      let state;
      switch (newStatus) {
        case 'Pendiente':
          state = 'Pendiente';
          break;
        case 'En proceso':
          state = 'En proceso';
          break;
        case 'Finalizado':
          state = 'Finalizado';
          break;
        case 'Cancelado':
          state = 'Cancelado';
          break;
        case 'Atrasado':
          state = 'Atrasado';
          break;
        case 'En riesgo':
          state = 'En riesgo';
          break;
        case 'Repriorizado':
          state = 'Repriorizado';
          break;
        default:
          state = currentProyect.state;
      }
      
      // Determinar si necesitamos cambiar la visibilidad
      // Si el estado nuevo es de desarrollo, forzar visibilidad a true
      const needsVisibilityChange = 
        ['En proceso', 'En riesgo', 'Atrasado', 'Repriorizado'].includes(state) && 
        currentProyect.visible !== true;
        
      // Construir datos para actualización
      const updateData = {
        ...currentProyect,
        state 
      };
      
      // Si necesitamos cambiar la visibilidad, hacerlo
      if (needsVisibilityChange) {
        console.log(`Cambiando visibilidad a Visible para proyecto ${id} al pasar a estado ${state}`);
        updateData.visible = true;
        updateData.visibility = 'Visible';
      }
      
      // Actualizamos estado y visibilidad si es necesario
      const response = await axios.put(`${API_URL}/${id}`, updateData, {
        signal: abortControllerRef.current.signal
      });
      
      await getProyects(); // Refrescar la lista después de cambiar el estado
      return response.data;
    } catch (err) {
      // Solo mostrar error si no fue cancelado
      if (err.name !== 'CanceledError' && err.code !== 'ERR_CANCELED') {
        setError(err.message || 'Error al cambiar el estado del proyecto');
        console.error('Error al cambiar el estado del proyecto:', err);
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, [getProyectById, getProyects]);

  // Obtener conteo de actividades por empleado para un proyecto (optimizado)
  const getEmployeeActivityCounts = useCallback(async (projectId) => {
    try {
      // Solo hacer esta llamada cuando sea necesario (en ProjectDetail)
      const response = await axios.get(`${API_ACTIVITY_URL}/project/${projectId}/employee-counts`, {
        signal: abortControllerRef.current.signal
      });
      return response.data; // [{ employeeId, fullName, cuscaId, actividades }]
    } catch (err) {
      // Solo mostrar error si no fue cancelado
      if (err.name !== 'CanceledError' && err.code !== 'ERR_CANCELED') {
        console.error('Error al obtener conteo de actividades:', err);
      }
      return [];
    }
  }, []);

  // Limpiar al desmontar el componente
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Cargar proyectos al montar el componente
  useEffect(() => {
    getProyects();
  }, [getProyects]);

  return {
    proyects,
    loading,
    error,
    getProyects,
    getProyectById,
    createProyect,
    updateProyect,
    deleteProyect,
    changeProyectStatus,
    changeProyectStatusAndVisibility,
    getEmployeeActivityCounts
  };
};

export default useProyectsApi; 