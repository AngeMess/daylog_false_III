import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

// Hook personalizado para interactuar con la API de empleados
const useEmployeeApi = () => {
    const [employees, setEmployees] = useState([]);
    const [areas, setAreas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState(null);

    // URL base de las API's
    const API_URL = 'http://localhost:3000/api/employee';
    const REGISTER_API_URL = 'http://localhost:3000/api/registerEmployee';
    const COUNTRY_API_URL = 'http://localhost:3000/api/country';
    const AREA_URL = 'http://localhost:3000/api/mainAreaArea';

    // Obtener el token de autenticación
    const authToken = Cookies.get('authToken');

    // Configurar axios para incluir el token en todas las peticiones
    axios.defaults.headers.common['Authorization'] = authToken ? `Bearer ${authToken}` : '';

    // Función para obtener la lista de países
    const getCountries = useCallback(async () => {
        try {
            const response = await axios.get(COUNTRY_API_URL, { withCredentials: true });
            return response.data;
        } catch (error) {
            console.error('Error al obtener países:', error);
            throw error;
        }
    }, []);

    // Función para cargar todos los empleados con filtro opcional por rol
    const getEmployees = useCallback(async (rolFilter = null) => {
        setLoading(true);
        setError(null);

        try {
            const params = rolFilter ? { rol: rolFilter } : {};
            const response = await axios.get(`${API_URL}?populate=country,mainAreaArea.area,mainAreaArea.mainArea,inmediateBoss,subManager`, { params });

            // Transformar datos para mostrar nombres completos
            const transformedEmployees = response.data.map(employee => {
                // Obtener nombre del área completa
                const areaCompleta = employee.mainAreaArea 
                ? `${employee.mainAreaArea.mainArea?.name || ''} - ${employee.mainAreaArea.area?.name || ''}`
                : 'Sin área asignada';

                // Obtener nombre del jefe inmediato
                const nombreJefe = employee.inmediateBoss?.fullName || 'Sin jefe asignado';
                // Obtener nombre del subgerente
                const nombreSubgerente = employee.subManager?.fullName || 'Sin subgerente asignado';

                return {
                    ...employee,
                    // Sobreescribimos las referencias con los nombres
                    country: employee.country?.name || 'Sin país',
                    mainAreaArea: areaCompleta,
                    inmediateBoss: nombreJefe,
                    subManager: nombreSubgerente
                };
            });

            setEmployees(transformedEmployees);
            return transformedEmployees;
        } catch (err) {
            setError(err.message || 'Error al cargar los empleados');
            console.error('Error al cargar los empleados:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Función para obtener un empleado específico por ID
    const getEmployeeById = useCallback(async (id) => {
        setLoading(true);
        setError(null);

        try {
            // Attempt to fetch by cuscaId as a query parameter
            const response = await axios.get(`${API_URL}?cuscaId=${id}&populate=country,mainAreaArea.mainArea,mainAreaArea.area`);
            if (response.data.length > 0) {
                // Transform data to ensure all fields are displayable
                const employee = response.data[0];

                // Transform mainAreaArea to a string
                let areaDisplay = 'Sin área asignada';
                if (employee.mainAreaArea) {
                    if (typeof employee.mainAreaArea === 'object') {
                        const mainAreaName = employee.mainAreaArea.mainArea?.name || '';
                        const areaName = employee.mainAreaArea.area?.name || '';
                        if (mainAreaName && areaName) {
                            areaDisplay = `${mainAreaName} - ${areaName}`;
                        } else if (mainAreaName) {
                            areaDisplay = mainAreaName;
                        } else if (areaName) {
                            areaDisplay = areaName;
                        }
                    } else if (typeof employee.mainAreaArea === 'string') {
                        areaDisplay = employee.mainAreaArea;
                    }
                }

                // Transform country to a string
                const countryDisplay = typeof employee.country === 'object' ? employee.country.name || 'Sin país' : employee.country || 'Sin país';

                // Return transformed data
                return {
                    ...employee,
                    mainAreaArea: areaDisplay,
                    country: countryDisplay
                };
            } else {
                setError('Empleado no encontrado');
                return null;
            }
        } catch (err) {
            setError(err.message || 'Error al cargar el empleado');
            console.error('Error al cargar el empleado:', err);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // Función para registrar un nuevo empleado
    const registerEmployee = useCallback(async (employeeData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(REGISTER_API_URL, employeeData);
            await getEmployees(); // Refrescar la lista después de registrar
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Error al registrar el empleado');
            console.error('Error al registrar el empleado:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [getEmployees]);

    // Función para actualizar un empleado existente
    const updateEmployee = useCallback(async (id, employeeData) => {
        setLoading(true);
        setError(null);

        try {
            // Preparar los datos para enviar
            const dataToSend = {
                cuscaId: employeeData.cuscaId,
                fullName: employeeData.fullName,
                email: employeeData.email,
                inmediateBoss: employeeData.inmediateBoss,
                subManager: employeeData.subManager,
                country: employeeData.country,
                daylogRol: employeeData.daylogRol,
                position: employeeData.position,
                mainAreaArea: employeeData.mainAreaArea,
                compensatoryHours: employeeData.compensatoryHours,
                extraWeeklyHours: employeeData.extraWeeklyHours,
                weeklyHours: employeeData.weeklyHours
            };

            // Solo incluir password si se está actualizando
            if (employeeData.password) {
                dataToSend.password = employeeData.password;
            }

            const response = await axios.put(`${API_URL}/${id}`, dataToSend);
            await getEmployees(); // Refrescar la lista después de actualizar
            return response.data;
        } catch (err) {
            setError(err.message || 'Error al actualizar el empleado');
            console.error('Error al actualizar el empleado:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [getEmployees]);

    // Función para eliminar un empleado
    const deleteEmployee = useCallback(async (id) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.delete(`${API_URL}/${id}`);
            await getEmployees(); // Refrescar la lista después de eliminar
            return response.data;
        } catch (err) {
            setError(err.message || 'Error al eliminar el empleado');
            console.error('Error al eliminar el empleado:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [getEmployees]);

    // Función para buscar empleados con búsqueda inteligente (local)
    const searchEmployees = useCallback((query) => {
        setSearchLoading(true);
        setSearchError(null);

        try {
            const filtered = employees.filter(employee => {
                const fullName = employee.fullName?.toLowerCase() || '';
                const cuscaId = employee.cuscaId?.toLowerCase() || '';
                const queryLower = query.toLowerCase();
                
                // Buscar en nombre completo y Cusca ID
                return fullName.includes(queryLower) || cuscaId.includes(queryLower);
            });

            // Ordenar por relevancia
            return filtered.sort((a, b) => {
                const scoreA = calculateRelevance.employee(a, query.toLowerCase());
                const scoreB = calculateRelevance.employee(b, query.toLowerCase());
                return scoreB - scoreA; // Orden descendente
            });
        } catch (err) {
            setSearchError(err.message || 'Error al buscar empleados');
            console.error('Error al buscar empleados:', err);
            return [];
        } finally {
            setSearchLoading(false);
        }
    }, [employees]);

    // Función para buscar áreas con búsqueda inteligente (local)
    const searchAreas = useCallback((query) => {
        setSearchLoading(true);
        setSearchError(null);

        try {
            const filtered = areas.filter(area => {
                const mainAreaName = area.mainArea?.name?.toLowerCase() || '';
                const areaName = area.area?.name?.toLowerCase() || '';
                const queryLower = query.toLowerCase();
                
                // Buscar en nombre del área principal y subárea
                return mainAreaName.includes(queryLower) || areaName.includes(queryLower);
            });

            // Ordenar por relevancia
            return filtered.sort((a, b) => {
                const scoreA = calculateRelevance.area(a, query.toLowerCase());
                const scoreB = calculateRelevance.area(b, query.toLowerCase());
                return scoreB - scoreA; // Orden descendente
            });
        } catch (err) {
            setSearchError(err.message || 'Error al buscar áreas');
            console.error('Error al buscar áreas:', err);
            return [];
        } finally {
            setSearchLoading(false);
        }
    }, [areas]);

    // Función para obtener todas las áreas
    const fetchAreas = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(AREA_URL);
            setAreas(response.data);
            return response.data;
        } catch (err) {
            setError(err.message || 'Error al cargar las áreas');
            console.error('Error al cargar las áreas:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Cargar empleados y áreas al montar el componente
    useEffect(() => {
        getEmployees();
        fetchAreas();
    }, [getEmployees, fetchAreas]);

    // Funciones de cálculo de relevancia
    const calculateRelevance = {
        employee: (employee, query) => {
            const fullName = employee.fullName.toLowerCase();
            const cuscaId = employee.cuscaId?.toLowerCase() || '';
            const terms = query.split(' ');
            let score = 0;

            // Puntuación por coincidencia exacta
            if (fullName === query) score += 5;
            if (cuscaId === query) score += 5;

            // Puntuación por coincidencia parcial
            terms.forEach(term => {
                if (fullName.includes(term)) score += 2;
                if (cuscaId.includes(term)) score += 2;
            });

            // Puntuación por coincidencia al inicio
            if (fullName.startsWith(query)) score += 3;
            if (cuscaId.startsWith(query)) score += 3;

            return score;
        },
        area: (area, query) => {
            const mainAreaName = (area.mainArea?.name || '').toLowerCase();
            const areaName = (area.area?.name || '').toLowerCase();
            let score = 0;

            // Puntuación por coincidencia exacta
            if (mainAreaName === query) score += 5;
            if (areaName === query) score += 5;

            // Puntuación por coincidencia parcial
            if (mainAreaName.includes(query)) score += 2;
            if (areaName.includes(query)) score += 2;

            // Puntuación por coincidencia al inicio
            if (mainAreaName.startsWith(query)) score += 3;
            if (areaName.startsWith(query)) score += 3;

            return score;
        }
    };

    return {
        employees,
        areas,
        loading,
        searchLoading,
        error,
        searchError,
        getEmployees,
        getEmployeeById,
        getCountries,
        registerEmployee,
        updateEmployee,
        deleteEmployee,
        searchEmployees,
        searchAreas,
        fetchAreas
    };
};

export default useEmployeeApi;