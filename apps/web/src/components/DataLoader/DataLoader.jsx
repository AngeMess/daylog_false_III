/**
 * Componente DataLoader - Sistema de carga y gestión de datos
 * 
 * Este componente proporciona un sistema completo para cargar, gestionar y manipular
 * datos en la aplicación. Incluye funcionalidades de paginación, filtrado, búsqueda
 * y manejo de estados de carga y error.
 * 
 * Funcionalidades principales:
 * - Carga de datos desde APIs con diferentes métodos HTTP
 * - Paginación automática con límites configurables
 * - Filtrado y búsqueda de datos
 * - Manejo de estados de carga, error y éxito
 * - Operaciones CRUD (Crear, Leer, Actualizar, Eliminar)
 * - Callbacks personalizables para éxito y error
 * 
 * Estados gestionados:
 * - data: Array de datos cargados
 * - loading: Estado de carga
 * - error: Mensajes de error
 * - totalItems: Número total de elementos
 * - filters: Filtros aplicados
 * - searchTerm: Término de búsqueda
 * - pagination: Información de paginación
 * 
 * Características:
 * - Manejo robusto de errores
 * - Soporte para diferentes formatos de respuesta
 * - Funciones de utilidad para manipulación de datos
 * - Context API para compartir estado globalmente
 * - Hooks personalizados para fácil integración
 */

// hooks/dataLoader/index.js
import { createContext, useState, useContext, useCallback } from 'react';

// Crear el contexto
export const DataLoaderContext = createContext();

// Hook personalizado para usar el contexto
export const useDataLoader = () => {
  const context = useContext(DataLoaderContext);
  if (!context) {
    throw new Error('useDataLoader debe ser usado dentro de un DataLoaderProvider');
  }
  return context;
};

// Hook personalizado para la lógica del DataLoader
export const useDataLoaderState = () => {
  // Estados para manejar datos, carga y errores
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalItems, setTotalItems] = useState(0);
  const [filters, setFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1
  });

  // Función para cargar datos
  const fetchData = useCallback(async (endpoint, options = {}) => {
    const { 
      params = {}, 
      method = 'GET',
      body = null,
      headers = {},
      onSuccess = null,
      onError = null
    } = options;

    // Construir URL con parámetros
    let url = endpoint;
    if (Object.keys(params).length > 0) {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });
      url = `${endpoint}?${queryParams.toString()}`;
    }

    try {
      setLoading(true);
      setError(null);

      const requestOptions = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        }
      };

      if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        requestOptions.body = JSON.stringify(body);
      }

      const response = await fetch(url, requestOptions);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const responseData = await response.json();
      
      // Manejar diferentes formatos de respuesta
      if (responseData.data && responseData.total !== undefined) {
        // Formato con paginación
        setData(responseData.data);
        setTotalItems(responseData.total);
        setPagination(prev => ({
          ...prev,
          totalPages: Math.ceil(responseData.total / prev.limit)
        }));
      } else if (Array.isArray(responseData)) {
        // Formato de array simple
        setData(responseData);
        setTotalItems(responseData.length);
      } else {
        // Objeto individual o formato personalizado
        setData(Array.isArray(responseData) ? responseData : [responseData]);
        setTotalItems(1);
      }

      // Callback de éxito si existe
      if (onSuccess) onSuccess(responseData);
      
      return responseData;
    } catch (err) {
      setError(err.message || 'Error al cargar los datos');
      // Callback de error si existe
      if (onError) onError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para actualizar un elemento
  const updateItem = useCallback((id, updatedData) => {
    setData(prevData => 
      prevData.map(item => 
        item.id === id || item._id === id ? { ...item, ...updatedData } : item
      )
    );
  }, []);

  // Función para eliminar un elemento
  const deleteItem = useCallback((id) => {
    setData(prevData => prevData.filter(item => item.id !== id && item._id !== id));
    setTotalItems(prev => prev - 1);
  }, []);

  // Función para añadir un elemento
  const addItem = useCallback((newItem) => {
    setData(prevData => [newItem, ...prevData]);
    setTotalItems(prev => prev + 1);
  }, []);

  // Función para cambiar página
  const changePage = useCallback((newPage) => {
    setPagination(prev => ({
      ...prev,
      page: newPage
    }));
  }, []);

  // Función para cambiar límite por página
  const changeLimit = useCallback((newLimit) => {
    setPagination(prev => ({
      ...prev,
      limit: newLimit,
      totalPages: Math.ceil(totalItems / newLimit)
    }));
  }, [totalItems]);

  // Función para actualizar filtros
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  }, []);

  // Función para actualizar término de búsqueda
  const updateSearchTerm = useCallback((term) => {
    setSearchTerm(term);
  }, []);

  // Función para resetear todo
  const resetState = useCallback(() => {
    setData([]);
    setLoading(false);
    setError(null);
    setTotalItems(0);
    setFilters({});
    setSearchTerm('');
    setPagination({
      page: 1,
      limit: 10,
      totalPages: 1
    });
  }, []);

  // Valor del contexto
  return {
    data,
    loading,
    error,
    totalItems,
    filters,
    searchTerm,
    pagination,
    fetchData,
    updateItem,
    deleteItem,
    addItem,
    changePage,
    changeLimit,
    updateFilters,
    updateSearchTerm,
    resetState
  };
};

// Proveedor del contexto
export const DataLoaderProvider = ({ children }) => {
  // Obtener el estado y las funciones del DataLoader
  const dataLoaderState = useDataLoaderState();
  
  return (
    <DataLoaderContext.Provider value={dataLoaderState}>
      {children}
    </DataLoaderContext.Provider>
  );
};

// Export por defecto del provider
export default DataLoaderProvider;