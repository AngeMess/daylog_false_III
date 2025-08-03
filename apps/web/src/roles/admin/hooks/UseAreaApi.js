import { useState, useEffect } from 'react';

const useAreas = () => {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE_URL = 'http://localhost:3000/api/areas';

  // Función para manejar errores
  const handleError = (error, operation) => {
    console.error(`Error en ${operation}:`, error);
    const errorMessage = error.response?.data?.message || error.message || `Error en ${operation}`;
    setError(errorMessage);
    throw new Error(errorMessage);
  };

  // GET - Obtener todas las áreas
  const getAreas = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAreas(data);
      return data;
    } catch (error) {
      handleError(error, 'obtener áreas');
    } finally {
      setLoading(false);
    }
  };

  // GET - Obtener un área por ID
  const getAreaById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      handleError(error, 'obtener área');
    } finally {
      setLoading(false);
    }
  };

  // POST - Crear una nueva área
  const createArea = async (areaData) => {
    setLoading(true);
    setError(null);
    try {
      // Validación básica
      if (!areaData.name) {
        throw new Error('El nombre es requerido');
      }

      if (areaData.name.length > 150) {
        throw new Error('El nombre no puede tener más de 150 caracteres');
      }

      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(areaData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const newArea = await response.json();
      
      // Actualizar el estado local
      setAreas(prevAreas => [...prevAreas, newArea]);
      
      return newArea;
    } catch (error) {
      handleError(error, 'crear área');
    } finally {
      setLoading(false);
    }
  };

  // PUT - Actualizar un área existente
  const updateArea = async (id, areaData) => {
    setLoading(true);
    setError(null);
    try {
      // Validación básica
      if (areaData.name && areaData.name.length > 150) {
        throw new Error('El nombre no puede tener más de 150 caracteres');
      }

      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(areaData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const updatedArea = await response.json();
      
      // Actualizar el estado local
      setAreas(prevAreas => 
        prevAreas.map(area => 
          area._id === id ? updatedArea : area
        )
      );
      
      return updatedArea;
    } catch (error) {
      handleError(error, 'actualizar área');
    } finally {
      setLoading(false);
    }
  };

  // DELETE - Eliminar un área
  const deleteArea = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      // Actualizar el estado local
      setAreas(prevAreas => prevAreas.filter(area => area._id !== id));
      
      return { success: true, message: 'Área eliminada correctamente' };
    } catch (error) {
      handleError(error, 'eliminar área');
    } finally {
      setLoading(false);
    }
  };

  // Función para limpiar errores
  const clearError = () => {
    setError(null);
  };

  // Cargar áreas al montar el componente
  useEffect(() => {
    getAreas();
  }, []);

  return {
    // Estado
    areas,
    loading,
    error,
    
    // Funciones CRUD
    getAreas,
    getAreaById,
    createArea,
    updateArea,
    deleteArea,
    
    // Utilidades
    clearError,
  };
};

export default useAreas; 