import { useState } from 'react';
import { toast } from 'react-toastify';

// URL base de la API
const API_URL = 'http://localhost:3000/api/employee';

/**
 * Hook para actualizar un empleado existente
 */
export const useUpdateEmpleado = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  /**
   * Actualiza un empleado existente
   * @param {string} id - ID del empleado
   * @param {Object} empleadoData - Datos actualizados del empleado
   */
  const updateEmpleado = async (id, empleadoData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
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
      toast.success('Empleado actualizado con éxito');
      return data;
    } catch (error) {
      console.error('Error al actualizar empleado:', error);
      setError(error.message || 'Error al actualizar el empleado');
      toast.error(error.message || 'Error al actualizar el empleado');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    success,
    updateEmpleado
  };
};