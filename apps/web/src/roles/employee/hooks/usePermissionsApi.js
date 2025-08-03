import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// Hook personalizado para interactuar con la API de permisos
// ACTUALIZADO: 2024-01-15 - Corregido sistema de autenticación
const usePermissionsApi = () => {
    const [permits, setPermits] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState(null);
    const [stats, setStats] = useState(null);

    // URL base de la API
    const API_URL = 'http://localhost:3000/api/permit';

    // Configurar axios para usar cookies (como en authContext.jsx)
    axios.defaults.withCredentials = true;

    // Función para verificar si el usuario está autenticado
    const isAuthenticated = useCallback(() => {
        // Verificar si hay datos de usuario en localStorage (como hace el authContext)
        const userData = localStorage.getItem('userData');
        return !!userData;
    }, []);

    // NUEVO: Función simplificada para headers (sin token manual)
    const getRequestHeaders = useCallback(() => {
        console.log('✅ NUEVO: Headers sin token manual - usando cookies automáticas');
        return {
            'Content-Type': 'application/json'
        };
    }, []);

    // Constantes para tipos de permisos válidos
    const PERMIT_TYPES = [
        "Permiso por licencia sin sueldo",
        "Permiso por mudanza", 
        "Permiso por emergencia personal",
        "Permiso por capacitación",
        "Permiso por vacaciones",
        "Permiso por duelo",
        "Permiso por Maternidad/Paternidad",
        "Permiso por motivos familiares",
        "Permiso por cita médica",
        "Permiso por enfermedad"
    ];

    // Constantes para estados válidos
    const PERMIT_STATES = ["Aprobada", "Pendiente", "Denegada"];

    // Función para obtener todos los permisos
    const getPermits = useCallback(async (stateFilter = null) => {
        setLoading(true);
        setError(null);

        try {
            // Verificar autenticación antes de hacer la petición
            if (!isAuthenticated()) {
                throw new Error('No hay sesión activa. Por favor inicia sesión nuevamente.');
            }

            let url = API_URL;
            if (stateFilter && PERMIT_STATES.includes(stateFilter)) {
                const params = new URLSearchParams({ state: stateFilter });
                url = `${API_URL}?${params}`;
            }

            console.log('📡 Obteniendo permisos desde:', url);
            const response = await axios.get(url, { 
                headers: getRequestHeaders(),
                withCredentials: true 
            });
            
            // Transformar datos para mejor visualización
            const transformedPermits = response.data.map(permit => ({
                ...permit,
                // Formatear fecha para visualización
                formattedDate: new Date(permit.date).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }),
                // Formatear fecha de creación
                formattedCreatedAt: new Date(permit.createdAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                // Truncar motivo para preview
                motivePreview: permit.motive?.length > 50 
                    ? `${permit.motive.substring(0, 50)}...` 
                    : permit.motive,
                // Estado con color
                stateInfo: {
                    value: permit.state,
                    color: getStateColor(permit.state),
                    icon: getStateIcon(permit.state)
                }
            }));

            setPermits(transformedPermits);
            return transformedPermits;
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Error al cargar los permisos');
            console.error('Error al cargar los permisos:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [getRequestHeaders, isAuthenticated]);

    // Función para obtener un permiso específico por ID
    const getPermitById = useCallback(async (id) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(`${API_URL}/${id}`, { 
                headers: getRequestHeaders(),
                withCredentials: true 
            });
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Error al cargar el permiso');
            console.error('Error al cargar el permiso:', err);
            return null;
        } finally {
            setLoading(false);
        }
    }, [getRequestHeaders]);

    // Función para crear un nuevo permiso
    const createPermit = useCallback(async (permitData) => {
        setLoading(true);
        setError(null);

        try {
            // Validar datos antes de enviar
            const validationError = validatePermitData(permitData);
            if (validationError) {
                throw new Error(validationError);
            }

            // Log de debugging
            console.log('📤 Enviando datos del permiso:', {
                date: permitData.date,
                motive: permitData.motive,
                state: permitData.state,
                permitType: permitData.permitType
            });

            const response = await axios.post(API_URL, permitData, { 
                headers: getRequestHeaders(),
                withCredentials: true
            });
            
            console.log('✅ Permiso creado exitosamente:', response.data);
            await getPermits(); // Refrescar la lista después de crear
            return response.data;
        } catch (err) {
            console.error('❌ Error completo al crear permiso:', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status,
                config: err.config
            });
            
            const errorMessage = err.response?.data?.message || err.message || 'Error al crear el permiso';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [getPermits, getRequestHeaders]);

    // Función para actualizar un permiso existente
    const updatePermit = useCallback(async (id, permitData) => {
        setLoading(true);
        setError(null);

        try {
            // Validar ID
            if (!id) {
                throw new Error('ID del permiso es requerido');
            }

            // Preparar los datos para actualización (solo enviar campos que cambiaron)
            const dataToSend = {};
            if (permitData.date) dataToSend.date = permitData.date;
            if (permitData.motive !== undefined) dataToSend.motive = permitData.motive;
            if (permitData.state) dataToSend.state = permitData.state;
            if (permitData.permitType) dataToSend.permitType = permitData.permitType;

            const response = await axios.put(`${API_URL}/${id}`, dataToSend, { 
                headers: getRequestHeaders(),
                withCredentials: true 
            });
            await getPermits(); // Refrescar la lista después de actualizar
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Error al actualizar el permiso';
            setError(errorMessage);
            console.error('Error al actualizar el permiso:', err);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [getPermits, getRequestHeaders]);

    // Función para eliminar un permiso
    const deletePermit = useCallback(async (id) => {
        setLoading(true);
        setError(null);

        try {
            if (!id) {
                throw new Error('ID del permiso es requerido');
            }

            const response = await axios.delete(`${API_URL}/${id}`, { 
                headers: getRequestHeaders(),
                withCredentials: true 
            });
            await getPermits(); // Refrescar la lista después de eliminar
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Error al eliminar el permiso';
            setError(errorMessage);
            console.error('Error al eliminar el permiso:', err);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [getPermits, getRequestHeaders]);

    // Función para buscar permisos con búsqueda inteligente (local)
    const searchPermits = useCallback((query) => {
        setSearchLoading(true);
        setSearchError(null);

        try {
            if (!query || query.trim() === '') {
                return permits;
            }

            const queryLower = query.toLowerCase().trim();
            
            const filtered = permits.filter(permit => {
                const motive = permit.motive?.toLowerCase() || '';
                const permitType = permit.permitType?.toLowerCase() || '';
                const state = permit.state?.toLowerCase() || '';
                const date = permit.formattedDate?.toLowerCase() || '';
                
                // Buscar en múltiples campos
                return motive.includes(queryLower) ||
                       permitType.includes(queryLower) ||
                       state.includes(queryLower) ||
                       date.includes(queryLower);
            });

            // Ordenar por relevancia
            return filtered.sort((a, b) => {
                const scoreA = calculateRelevance(a, queryLower);
                const scoreB = calculateRelevance(b, queryLower);
                return scoreB - scoreA; // Orden descendente
            });
        } catch (err) {
            setSearchError(err.message || 'Error al buscar permisos');
            console.error('Error al buscar permisos:', err);
            return [];
        } finally {
            setSearchLoading(false);
        }
    }, [permits]);

    // Función para filtrar permisos por múltiples criterios
    const filterPermits = useCallback((filters) => {
        setSearchLoading(true);
        setSearchError(null);

        try {
            let filtered = [...permits];

            // Filtrar por estado
            if (filters.state && filters.state !== 'all') {
                filtered = filtered.filter(permit => permit.state === filters.state);
            }

            // Filtrar por tipo de permiso
            if (filters.permitType && filters.permitType !== 'all') {
                filtered = filtered.filter(permit => permit.permitType === filters.permitType);
            }

            // Filtrar por rango de fechas
            if (filters.startDate) {
                const startDate = new Date(filters.startDate);
                filtered = filtered.filter(permit => new Date(permit.date) >= startDate);
            }

            if (filters.endDate) {
                const endDate = new Date(filters.endDate);
                filtered = filtered.filter(permit => new Date(permit.date) <= endDate);
            }

            // Ordenar por fecha
            const sortOrder = filters.sortOrder || 'desc';
            filtered.sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
            });

            return filtered;
        } catch (err) {
            setSearchError(err.message || 'Error al filtrar permisos');
            console.error('Error al filtrar permisos:', err);
            return permits;
        } finally {
            setSearchLoading(false);
        }
    }, [permits]);

    // Función para obtener estadísticas de permisos
    const getPermitStats = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            // Calcular estadísticas locales basadas en los permisos cargados
            const stateStats = PERMIT_STATES.map(state => ({
                state,
                count: permits.filter(permit => permit.state === state).length
            }));

            const permitTypeStats = PERMIT_TYPES.map(type => ({
                permitType: type,
                count: permits.filter(permit => permit.permitType === type).length
            })).filter(stat => stat.count > 0)
              .sort((a, b) => b.count - a.count);

            const monthlyStats = getMonthlyStats(permits);
            
            const calculatedStats = {
                total: permits.length,
                stateStats,
                permitTypeStats,
                monthlyStats,
                recentPermits: permits.slice(0, 5) // Últimos 5 permisos
            };

            setStats(calculatedStats);
            return calculatedStats;
        } catch (err) {
            setError(err.message || 'Error al calcular estadísticas');
            console.error('Error al calcular estadísticas:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [permits]);

    // Cargar permisos al montar el componente
    useEffect(() => {
        // Solo cargar permisos si hay sesión activa
        if (isAuthenticated()) {
            getPermits().catch(err => {
                console.error('Error al cargar permisos iniciales:', err);
                // No re-lanzar el error para evitar errores no capturados
            });
        } else {
            console.warn('⚠️ No hay sesión activa, no se cargarán los permisos');
            setError('No hay sesión activa. Por favor inicia sesión para ver tus permisos.');
        }
    }, [getPermits, isAuthenticated]);

    // Recalcular estadísticas cuando cambien los permisos
    useEffect(() => {
        if (permits.length > 0) {
            getPermitStats();
        }
    }, [permits, getPermitStats]);

    // Función para validar datos del permiso
    const validatePermitData = (data) => {
        console.log('🔍 Validando datos del permiso:', data);
        
        if (!data.date) return 'La fecha es requerida';
        if (!data.motive || data.motive.trim() === '') return 'El motivo es requerido';
        if (data.motive.length > 350) return 'El motivo no puede exceder 350 caracteres';
        if (!data.state || !PERMIT_STATES.includes(data.state)) return 'Estado inválido';
        if (!data.permitType || !PERMIT_TYPES.includes(data.permitType)) return 'Tipo de permiso inválido';
        
        // Validar que la fecha sea válida
        const permitDate = new Date(data.date);
        if (isNaN(permitDate.getTime())) {
            return 'La fecha proporcionada no es válida';
        }
        
        // Validar que la fecha no sea en el pasado para nuevos permisos
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        permitDate.setHours(0, 0, 0, 0);
        
        if (permitDate < today) return 'La fecha del permiso no puede ser en el pasado';

        console.log('✅ Validación de datos exitosa');
        return null;
    };

    // Función para calcular relevancia en búsquedas
    const calculateRelevance = (permit, query) => {
        const motive = permit.motive?.toLowerCase() || '';
        const permitType = permit.permitType?.toLowerCase() || '';
        const state = permit.state?.toLowerCase() || '';
        let score = 0;

        // Puntuación por coincidencia exacta
        if (motive === query) score += 5;
        if (permitType === query) score += 5;
        if (state === query) score += 5;

        // Puntuación por coincidencia parcial
        if (motive.includes(query)) score += 2;
        if (permitType.includes(query)) score += 2;
        if (state.includes(query)) score += 2;

        // Puntuación por coincidencia al inicio
        if (motive.startsWith(query)) score += 3;
        if (permitType.startsWith(query)) score += 3;

        return score;
    };

    // Función para obtener color del estado
    const getStateColor = (state) => {
        switch (state) {
            case 'Aprobada': return 'green';
            case 'Pendiente': return 'yellow';
            case 'Denegada': return 'red';
            default: return 'gray';
        }
    };

    // Función para obtener icono del estado
    const getStateIcon = (state) => {
        switch (state) {
            case 'Aprobada': return '✓';
            case 'Pendiente': return '⏳';
            case 'Denegada': return '✗';
            default: return '?';
        }
    };

    // Función para obtener estadísticas mensuales
    const getMonthlyStats = (permits) => {
        const monthlyData = {};
        
        permits.forEach(permit => {
            const date = new Date(permit.date);
            const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
            
            if (!monthlyData[monthKey]) {
                monthlyData[monthKey] = {
                    month: date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }),
                    total: 0,
                    aprobadas: 0,
                    pendientes: 0,
                    denegadas: 0
                };
            }
            
            monthlyData[monthKey].total++;
            monthlyData[monthKey][permit.state.toLowerCase().replace('é', 'e') + 's']++;
        });

        return Object.values(monthlyData).sort((a, b) => 
            new Date(b.month) - new Date(a.month)
        );
    };

    return {
        // Estados
        permits,
        loading,
        searchLoading,
        error,
        searchError,
        stats,
        
        // Constantes
        PERMIT_TYPES,
        PERMIT_STATES,
        
        // Funciones CRUD
        getPermits,
        getPermitById,
        createPermit,
        updatePermit,
        deletePermit,
        
        // Funciones de búsqueda y filtrado
        searchPermits,
        filterPermits,
        
        // Funciones de estadísticas
        getPermitStats,
        
        // Funciones de utilidad
        validatePermitData,
        getStateColor,
        getStateIcon,
        isAuthenticated
    };
};

export default usePermissionsApi;