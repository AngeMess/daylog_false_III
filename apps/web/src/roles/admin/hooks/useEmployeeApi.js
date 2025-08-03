import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

// Hook personalizado para interactuar con la API de empleados
export const useEmployeeApi = () => {
    // CAMBIO PRINCIPAL: Inicializar employees como null y loading como true
    const [employees, setEmployees] = useState(null); // null indica que no se han cargado aún
    const [areas, setAreas] = useState([]);
    const [loading, setLoading] = useState(true); // true para mostrar loading al inicio
    const [error, setError] = useState(null);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState(null);

    // URL base de las API's
    const API_URL = 'http://localhost:3000/api/employee';
    const REGISTER_API_URL = 'http://localhost:3000/api/registerEmployee';
    const COUNTRY_API_URL = 'http://localhost:3000/api/country';
    const AREA_URL = 'http://localhost:3000/api/mainAreaArea';
    const EMPLOYEE_BY_ID_URL = `${API_URL}/:id`;
    const EMPLOYEE_BY_CUSCA_URL = `${API_URL}/cusca/:cuscaId`;

    // Obtener el token de autenticación
    const authToken = Cookies.get('authToken');

    // Configurar axios para incluir el token en todas las peticiones
    axios.defaults.headers.common['Authorization'] = authToken ? `Bearer ${authToken}` : '';

    // Ref para almacenar el AbortController actual
    const abortControllerRef = useRef(null);

    // Función para cancelar peticiones anteriores
    const cancelPreviousRequests = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();
    };

    // Función para obtener la lista de países
    const getCountries = useCallback(async () => {
        try {
            const response = await axios.get(COUNTRY_API_URL, { 
                withCredentials: true,
                signal: abortControllerRef.current?.signal
            });
            return response.data;
        } catch (error) {
            if (error.name !== 'CanceledError' && error.code !== 'ERR_CANCELED') {
                console.error('Error al obtener países:', error);
                throw error;
            }
        }
    }, []);

    // Función para cargar todos los empleados con filtro opcional por rol
    const getEmployees = useCallback(async (rolFilter = null) => {
        // Cancelar peticiones anteriores
        cancelPreviousRequests();
        
        setLoading(true);
        setError(null); 
        try {
            const params = rolFilter ? { rol: rolFilter } : {};
            const response = await axios.get(`${API_URL}?populate=country,mainAreaArea.area,mainAreaArea.mainArea,inmediateBoss,subManager`, { 
                params,
                signal: abortControllerRef.current.signal
            });

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
            if (err.name !== 'CanceledError' && err.code !== 'ERR_CANCELED') {
                setError(err.message || 'Error al cargar los empleados');
                console.error('Error al cargar los empleados:', err);
                // CAMBIO: Establecer employees como array vacío en caso de error
                setEmployees([]);
                throw err;
            }
        } finally {
            setLoading(false);
        }
    }, []);

    // Función para obtener un empleado específico por ID
    const getEmployeeById = useCallback(async (id) => {
        if (!id) {
            throw new Error('No se proporcionó un ID de empleado');
        }

        // Cancelar peticiones anteriores
        cancelPreviousRequests();

        setLoading(true);
        setError(null);

        try {
            console.log(`Buscando empleado con ID: ${id}`);
            
            // Primero intentamos encontrar el empleado en la lista ya cargada
            const existingEmployee = employees?.find(emp => emp._id === id || emp.cuscaId === id);
            if (existingEmployee) {
                console.log('Empleado encontrado en la lista local:', existingEmployee);
                return existingEmployee;
            }
            
            // Si no está en la lista local, intentamos obtenerlo de la API
            console.log('Empleado no encontrado en la lista local, buscando en la API...');
            
            let response;
            let employee;
            
            // Primero intentamos obtener el empleado directamente por ID
            try {
                const idUrl = `${API_URL}/${id}?populate=inmediateBoss,subManager,mainAreaArea.mainArea,mainAreaArea.area,country`;
                console.log(`Intentando obtener empleado por ID directo: ${idUrl}`);
                
                response = await axios.get(idUrl, { 
                    validateStatus: (status) => status < 500, // No lanzar error para códigos 4xx
                    signal: abortControllerRef.current.signal
                });
                
                console.log('Respuesta de la API (ID directo):', response.data);
                
                if (response.status === 404) {
                    throw new Error(`No se encontró un empleado con el ID: ${id}`);
                }
                
                if (!response.data) {
                    throw new Error('La respuesta de la API está vacía');
                }
                
                employee = response.data;
                console.log('Empleado encontrado por ID directo:', employee);
            } catch (directError) {
                console.warn('No se pudo obtener por ID directo, intentando por cuscaId:', directError);
                
                // Si falla, intentamos por cuscaId
                try {
                    const cuscaUrl = `${API_URL}/cusca/${id}?populate=inmediateBoss,subManager,mainAreaArea.mainArea,mainAreaArea.area,country`;
                    console.log(`Intentando obtener empleado por cuscaId: ${cuscaUrl}`);
                    
                    response = await axios.get(cuscaUrl, {
                        validateStatus: (status) => status < 500, // No lanzar error para códigos 4xx
                        signal: abortControllerRef.current.signal
                    });
                    
                    console.log('Respuesta de la API (cuscaId):', response.data);
                    
                    if (response.status === 404 || !response.data || response.data.length === 0) {
                        throw new Error(`No se encontró un empleado con el ID o CuscaID: ${id}`);
                    }
                    
                    employee = response.data[0];
                    console.log('Empleado encontrado por cuscaId:', employee);
                } catch (cuscaError) {
                    console.error('Error al buscar por cuscaId:', cuscaError);
                    throw new Error(`No se pudo encontrar el empleado. ${cuscaError.message || 'Por favor, verifica el ID e inténtalo de nuevo.'}`);
                }
            }
            
            // Asegurarse de que el área esté en el formato correcto
            if (employee.mainAreaArea) {
                employee.areaCompleta = employee.mainAreaArea.mainArea 
                    ? `${employee.mainAreaArea.mainArea.name || ''} - ${employee.mainAreaArea.area?.name || ''}`
                    : 'Sin área asignada';
            } else {
                employee.areaCompleta = 'Sin área asignada';
            }
            
            // Asegurar que los campos opcionales tengan valores por defecto
            employee.inmediateBoss = employee.inmediateBoss || { fullName: 'Sin jefe asignado' };
            employee.subManager = employee.subManager || { fullName: 'Sin subgerente asignado' };
            employee.country = employee.country || { name: 'Sin país asignado' };
            
            // Asegurar que el país sea un string
            if (typeof employee.country === 'object') {
                employee.country = employee.country.name || 'Sin país';
            }
            
            return employee;
        } catch (err) {
            if (err.name !== 'CanceledError' && err.code !== 'ERR_CANCELED') {
                setError(err.message || 'Error al cargar el empleado');
                console.error('Error al cargar el empleado:', err);
                throw err;
            }
        } finally {
            setLoading(false);
        }
    }, [employees]);

    // Función para registrar un nuevo empleado
    const registerEmployee = useCallback(async (employeeData) => {
        // Cancelar peticiones anteriores
        cancelPreviousRequests();
        
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(REGISTER_API_URL, employeeData, {
                signal: abortControllerRef.current.signal
            });
            await getEmployees(); // Refrescar la lista después de registrar
            return response.data;
        } catch (err) {
            if (err.name !== 'CanceledError' && err.code !== 'ERR_CANCELED') {
                setError(err.response?.data?.message || err.message || 'Error al registrar el empleado');
                console.error('Error al registrar el empleado:', err);
                throw err;
            }
        } finally {
            setLoading(false);
        }
    }, [getEmployees]);

    // Función para actualizar un empleado existente
    const updateEmployee = useCallback(async (id, employeeData) => {
        // Cancelar peticiones anteriores
        cancelPreviousRequests();
        
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

            const response = await axios.put(`${API_URL}/${id}`, dataToSend, {
                signal: abortControllerRef.current.signal
            });
            await getEmployees(); // Refrescar la lista después de actualizar
            return response.data;
        } catch (err) {
            if (err.name !== 'CanceledError' && err.code !== 'ERR_CANCELED') {
                setError(err.message || 'Error al actualizar el empleado');
                console.error('Error al actualizar el empleado:', err);
                throw err;
            }
        } finally {
            setLoading(false);
        }
    }, [getEmployees]);

    // Función para eliminar un empleado
    const deleteEmployee = useCallback(async (id) => {
        // Cancelar peticiones anteriores
        cancelPreviousRequests();
        
        setLoading(true);
        setError(null);

        try {
            const response = await axios.delete(`${API_URL}/${id}`, {
                signal: abortControllerRef.current.signal
            });
            await getEmployees(); // Refrescar la lista después de eliminar
            return response.data;
        } catch (err) {
            if (err.name !== 'CanceledError' && err.code !== 'ERR_CANCELED') {
                setError(err.message || 'Error al eliminar el empleado');
                console.error('Error al eliminar el empleado:', err);
                throw err;
            }
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
        // Cancelar peticiones anteriores
        cancelPreviousRequests();
        
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(AREA_URL, {
                signal: abortControllerRef.current.signal
            });
            setAreas(response.data);
            return response.data;
        } catch (err) {
            if (err.name !== 'CanceledError' && err.code !== 'ERR_CANCELED') {
                setError(err.message || 'Error al cargar las áreas');
                console.error('Error al cargar las áreas:', err);
                throw err;
            }
        } finally {
            setLoading(false);
        }
    }, []);

    // Función para buscar posiciones
    const searchPositions = useCallback((query) => {
        setSearchLoading(true);
        setSearchError(null);

        try {
            const positions = [
                'Desarrollador Frontend',
                'Desarrollador Backend',
                'Desarrollador Full Stack',
                'Diseñador UX/UI',
                'Project Manager',
                'Scrum Master',
                'QA Tester',
                'DevOps Engineer',
                'Data Analyst',
                'Business Analyst'
            ];

            const filtered = positions.filter(position => 
                position.toLowerCase().includes(query.toLowerCase())
            );

            return filtered;
        } catch (err) {
            setSearchError(err.message || 'Error al buscar posiciones');
            console.error('Error al buscar posiciones:', err);
            return [];
        } finally {
            setSearchLoading(false);
        }
    }, []);

    // Limpiar al desmontar el componente
    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    // CAMBIO: Remover el useEffect que carga automáticamente
    // Dejar que el componente llame a getEmployees() explícitamente
    // useEffect(() => {
    //     getEmployees();
    //     fetchAreas();
    // }, [getEmployees, fetchAreas]);

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
        fetchAreas,
        searchPositions
    };
};

export default useEmployeeApi;