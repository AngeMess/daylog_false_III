import { useState, useEffect } from 'react';

const useMainAreaArea = () => {
  const [mainAreaAreas, setMainAreaAreas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Configuración de la URL base del backend
  const API_BASE_URL = 'http://localhost:3000'; // Cambia este puerto por el puerto de tu backend

  // Función para limpiar errores
  const clearError = () => {
    setError(null);
  };

  // Obtener todas las relaciones
  const getMainAreaAreas = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/mainAreaArea`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Para incluir cookies si las usas
      });
      
      if (!response.ok) {
        throw new Error('Error al obtener las relaciones');
      }
      
      const data = await response.json();
      setMainAreaAreas(data);
      setError(null);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos automáticamente al montar el componente
  useEffect(() => {
    getMainAreaAreas();
  }, []);

  // Obtener relaciones por área madre
  const getMainAreaAreasByMainArea = async (mainAreaId) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/mainAreaArea/mainArea/${mainAreaId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Error al obtener las relaciones por área madre');
      }
      
      const data = await response.json();
      setError(null);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Crear múltiples relaciones (para cuando seleccionas varias áreas)
  const createMainAreaAreas = async (mainAreaId, areaIds) => {
    setLoading(true);
    try {
      // Crear array de objetos para insertar
      const relationsToCreate = areaIds.map(areaId => ({
        mainArea: mainAreaId,
        area: areaId
      }));

      console.log('Enviando petición a:', `${API_BASE_URL}/api/mainAreaArea/bulk`);
      console.log('Datos a enviar:', { relations: relationsToCreate });

      const response = await fetch(`${API_BASE_URL}/api/mainAreaArea/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ relations: relationsToCreate }),
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('Error response:', errorData);
        throw new Error(`Error al crear las relaciones: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Actualizar el estado local
      setMainAreaAreas(prev => [...prev, ...data.createdRelations]);
      setError(null);
      
      // Recargar todos los datos para obtener la información completa
      await getMainAreaAreas();
      
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Crear una sola relación - ADAPTADO para recibir un objeto completo
  const createMainAreaArea = async (areaData) => {
    setLoading(true);
    try {
      let requestBody;
      
      // Si areaData es un objeto con mainAreaId y areaId
      if (areaData.mainAreaId && areaData.areaId) {
        requestBody = {
          mainArea: areaData.mainAreaId,
          area: areaData.areaId,
          amountEmployees: areaData.amountEmployees || 0
        };
      } 
      // Si areaData ya tiene la estructura correcta
      else if (areaData.mainArea && areaData.area) {
        requestBody = areaData;
      }
      // Fallback para compatibilidad con llamadas anteriores
      else {
        requestBody = {
          mainArea: areaData,
          area: arguments[1], // segundo parámetro
          amountEmployees: arguments[2] || 0 // tercer parámetro
        };
      }

      const response = await fetch(`${API_BASE_URL}/api/mainAreaArea`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(requestBody),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al crear la relación');
      }
      
      const data = await response.json();
      
      // Recargar todos los datos para obtener la información completa con populate
      await getMainAreaAreas();
      
      setError(null);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar una relación
  const updateMainAreaArea = async (id, updateData) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/mainAreaArea/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updateData),
      });
      
      if (!response.ok) {
        throw new Error('Error al actualizar la relación');
      }
      
      const data = await response.json();
      
      // Recargar todos los datos para obtener la información actualizada
      await getMainAreaAreas();
      
      setError(null);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar una relación
  const deleteMainAreaArea = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/mainAreaArea/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Error al eliminar la relación');
      }
      
      // Actualizar el estado local eliminando el elemento
      setMainAreaAreas(prev => prev.filter(item => item._id !== id));
      setError(null);
      return true;
    } catch (err) {
      setError(err.message);
      console.error('Error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar múltiples relaciones
  const deleteMainAreaAreas = async (ids) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/mainAreaArea/bulk-delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ ids }),
      });
      
      if (!response.ok) {
        throw new Error('Error al eliminar las relaciones');
      }
      
      // Actualizar el estado local
      setMainAreaAreas(prev => prev.filter(item => !ids.includes(item._id)));
      setError(null);
      return true;
    } catch (err) {
      setError(err.message);
      console.error('Error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Verificar si existe una relación
  const checkRelationExists = async (mainAreaId, areaId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/mainAreaArea/check/${mainAreaId}/${areaId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Error al verificar la relación');
      }
      
      const data = await response.json();
      return data.exists;
    } catch (err) {
      console.error('Error:', err);
      return false;
    }
  };

  // Función para refrescar los datos manualmente
  const refreshData = async () => {
    await getMainAreaAreas();
  };

  return {
    mainAreaAreas,
    loading,
    error,
    getMainAreaAreas,
    getMainAreaAreasByMainArea,
    createMainAreaArea,
    createMainAreaAreas, // Para crear múltiples relaciones
    updateMainAreaArea,
    deleteMainAreaArea,
    deleteMainAreaAreas,
    checkRelationExists,
    clearError, // Para limpiar errores manualmente
    refreshData // Para refrescar datos manualmente
  };
};

export default useMainAreaArea; 