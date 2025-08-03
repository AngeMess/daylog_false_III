import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// Hook personalizado para obtener la lista de supervisores
const useSupervisorsApi = () => {
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // URL base de la API
  const API_URL = 'http://localhost:3000/api/employee';

  // Función para cargar todos los supervisores
  const getSupervisors = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(API_URL);
      
      // Filtrar solo los empleados que tienen rol de Supervisor
      const supervisorsList = response.data.filter(
        employee => employee.daylogRol === 'Supervisor'
      );
      
      setSupervisors(supervisorsList);
      return supervisorsList;
    } catch (err) {
      setError(err.message || 'Error al cargar los supervisores');
      console.error('Error al cargar los supervisores:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar supervisores al montar el componente
  useEffect(() => {
    getSupervisors();
  }, [getSupervisors]);

  return {
    supervisors,
    loading,
    error,
    getSupervisors
  };
};

export default useSupervisorsApi;
