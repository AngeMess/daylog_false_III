// Hook para manejar operaciones con proyectos
import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function useProjectApi() {
  // Estado inicial como array vacío
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener todos los proyectos
  const getProjects = async () => {
    try {
      console.log('Iniciando carga de proyectos...');
      
      // Configurar axios para usar cookies (token httpOnly)
      axios.defaults.withCredentials = true;

      const response = await axios.get('/api/project');

      console.log('Respuesta de la API:', {
        status: response.status,
        data: response.data,
        isArray: Array.isArray(response.data)
      });

      // Asegurarnos de que siempre tenemos un array
      const data = Array.isArray(response.data) ? response.data : [];
      console.log('Datos procesados:', data);
      
      setProjects(data);
    } catch (err) {
      console.error('Error al obtener proyectos:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      
      // Manejar errores específicos
      if (err.response?.status === 401) {
        setError('No autorizado. Por favor, inicia sesión nuevamente.');
      } else if (err.response?.status === 404) {
        setError('No se encontraron proyectos.');
      } else {
        setError(err.message || 'Error al cargar proyectos');
      }
    } finally {
      setLoading(false);
    }
  };

  // Obtener proyectos por estado
  const getProjectsByStatus = async (status) => {
    try {
      const token = localStorage.getItem('authToken') || Cookies.get('authToken');
      const response = await axios.get(`/api/project/status/${status}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (err) {
      console.error(`Error al obtener proyectos con estado ${status}:`, err);
      throw err;
    }
  };

  // Inicializar datos al montar el componente
  useEffect(() => {
    getProjects();
  }, []);

  return {
    projects,
    loading,
    error,
    getProjects,
    getProjectsByStatus
  };
}
