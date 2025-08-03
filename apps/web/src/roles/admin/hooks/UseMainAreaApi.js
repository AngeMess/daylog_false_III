import { useState, useEffect } from 'react';

const useMainAreas = () => {
  const [mainAreas, setMainAreas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE_URL = 'http://localhost:3000/api/mainArea';

  // Función para manejar errores
  const handleError = (error, operation) => {
    console.error(`Error en ${operation}:`, error);
    const errorMessage = error.response?.data?.message || error.message || `Error en ${operation}`;
    setError(errorMessage);
    throw new Error(errorMessage);
  };

  // GET - Obtener todas las áreas madre
  const getMainAreas = async () => {
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
      setMainAreas(data);
      return data;
    } catch (error) {
      handleError(error, 'obtener áreas madre');
    } finally {
      setLoading(false);
    }
  };

  // GET - Obtener un área madre por ID
  const getMainAreaById = async (id) => {
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
      handleError(error, 'obtener área madre');
    } finally {
      setLoading(false);
    }
  };

  // POST - Crear una nueva área madre
  const createMainArea = async (mainAreaData) => {
    setLoading(true);
    setError(null);
    try {
      // Validación básica
      if (!mainAreaData.name) {
        throw new Error('El nombre es requerido');
      }

      if (mainAreaData.name.length > 300) {
        throw new Error('El nombre no puede tener más de 300 caracteres');
      }

      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mainAreaData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const newMainArea = await response.json();
      
      // Actualizar el estado local
      setMainAreas(prevMainAreas => [...prevMainAreas, newMainArea]);
      
      return newMainArea;
    } catch (error) {
      handleError(error, 'crear área madre');
    } finally {
      setLoading(false);
    }
  };

  // PUT - Actualizar un área madre existente
  const updateMainArea = async (id, mainAreaData) => {
    setLoading(true);
    setError(null);
    try {
      // Validación básica
      if (mainAreaData.name && mainAreaData.name.length > 300) {
        throw new Error('El nombre no puede tener más de 300 caracteres');
      }

      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mainAreaData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const updatedMainArea = await response.json();
      
      // Actualizar el estado local
      setMainAreas(prevMainAreas => 
        prevMainAreas.map(mainArea => 
          mainArea._id === id ? updatedMainArea : mainArea
        )
      );
      
      return updatedMainArea;
    } catch (error) {
      handleError(error, 'actualizar área madre');
    } finally {
      setLoading(false);
    }
  };

  // DELETE - Eliminar un área madre
  const deleteMainArea = async (id) => {
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
      setMainAreas(prevMainAreas => prevMainAreas.filter(mainArea => mainArea._id !== id));
      
      return { success: true, message: 'Área madre eliminada correctamente' };
    } catch (error) {
      handleError(error, 'eliminar área madre');
    } finally {
      setLoading(false);
    }
  };

  // Función para limpiar errores
  const clearError = () => {
    setError(null);
  };

  // Cargar áreas madre al montar el componente
  useEffect(() => {
    getMainAreas();
  }, []);

  return {
    // Estado
    mainAreas,
    loading,
    error,
    
    // Funciones CRUD
    getMainAreas,
    getMainAreaById,
    createMainArea,
    updateMainArea,
    deleteMainArea,
    
    // Utilidades
    clearError,
  };
};

export default useMainAreas; 