import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

export const useEmployeeSearch = () => {
  const [employees, setEmployees] = useState([]);
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = 'http://localhost:3000/api/employee';
  const AREA_URL = 'http://localhost:3000/api/mainAreaArea';

  // Obtener el token de autenticación
  const authToken = Cookies.get('authToken');

  // Configurar axios para incluir el token en todas las peticiones
  axios.defaults.headers.common['Authorization'] = authToken ? `Bearer ${authToken}` : '';

  // Búsqueda de empleados
  const searchEmployees = async (query) => {
    setLoading(true);
    setError(null);
    try {
      try {
        const response = await axios.get(`${API_URL}?search=${query}`);
        return response.data;
      } catch (error) {
        console.error('Error en la API:', error.response?.data || error.message);
        throw error;
      }
      setEmployees(response.data);
      return response.data;
    } catch (err) {
      setError(err.message || 'Error al buscar empleados');
      console.error('Error al buscar empleados:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Obtener todas las áreas
  const fetchAreas = async () => {
    setLoading(true);
    setError(null);
    try {
      try {
        const response = await axios.get(AREA_URL);
        return response.data;
      } catch (error) {
        console.error('Error en la API:', error.response?.data || error.message);
        throw error;
      }
      setAreas(response.data);
      return response.data;
    } catch (err) {
      setError(err.message || 'Error al obtener áreas');
      console.error('Error al obtener áreas:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Obtener áreas filtradas por búsqueda
  const searchAreas = async (query) => {
    setLoading(true);
    setError(null);
    try {
      try {
        const response = await axios.get(`${AREA_URL}?search=${query}`);
        return response.data;
      } catch (error) {
        console.error('Error en la API:', error.response?.data || error.message);
        throw error;
      }
      return response.data;
    } catch (err) {
      setError(err.message || 'Error al buscar áreas');
      console.error('Error al buscar áreas:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    employees,
    areas,
    loading,
    error,
    searchEmployees,
    fetchAreas,
    searchAreas
  };
};

export default useEmployeeSearch;
