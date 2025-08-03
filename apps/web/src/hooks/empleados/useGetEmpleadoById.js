import { useState } from 'react';
import { toast } from 'react-toastify';

// URL base de la API
const API_URL = 'http://localhost:3000/api/employee';

/**
 * Hook para obtener un empleado por su ID
 */
export const useGetEmpleadoById = () => {
  const [empleado, setEmpleado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Obtiene un empleado por su ID
   * @param {string} id - ID del empleado
   */
  const getEmpleadoById = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/${id}`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setEmpleado(data);
      return data;
    } catch (error) {
      console.error('Error al obtener empleado:', error);
      setError('Error al obtener el empleado');
      toast.error('Error al obtener el empleado');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    empleado,
    loading,
    error,
    getEmpleadoById
  };
};
