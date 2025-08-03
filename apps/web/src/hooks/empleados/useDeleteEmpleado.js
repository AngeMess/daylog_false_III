import { useState } from 'react';
import { toast } from 'react-toastify';

// URL base de la API
const API_URL = 'http://localhost:3000/api/employee';

/**
 * Hook para eliminar un empleado
 */
export const useDeleteEmpleado = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  /**
   * Elimina un empleado
   * @param {string} id - ID del empleado
   */
  const deleteEmpleado = async (id) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.message || `Error ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }
      
      setSuccess(true);
      toast.success('Empleado eliminado con éxito');
      return await response.json();
    } catch (error) {
      console.error('Error al eliminar empleado:', error);
      setError(error.message || 'Error al eliminar el empleado');
      toast.error(error.message || 'Error al eliminar el empleado');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    success,
    deleteEmpleado
  };
};
