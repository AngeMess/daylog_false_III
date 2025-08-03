import { useState } from 'react';
import { toast } from 'react-toastify';

// URL base de la API
const API_URL = 'http://localhost:3000/api/employee';

/**
 * Hook para crear un nuevo empleado
 */
export const useCreateEmpleado = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  /**
   * Crea un nuevo empleado
   * @param {Object} empleadoData - Datos del empleado
   */
  const createEmpleado = async (empleadoData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(empleadoData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.message || `Error ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      setSuccess(true);
      toast.success('Empleado creado con éxito');
      return data;
    } catch (error) {
      console.error('Error al crear empleado:', error);
      setError(error.message || 'Error al crear el empleado');
      toast.error(error.message || 'Error al crear el empleado');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    success,
    createEmpleado
  };
};