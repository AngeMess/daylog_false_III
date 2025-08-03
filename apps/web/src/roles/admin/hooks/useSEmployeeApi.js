import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

// Hook personalizado para interactuar con la API de empleados
export const useEmployeeApi = () => {
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
    const EMPLOYEE_BY_ID_URL = `${API_URL}/:id`;
    const EMPLOYEE_BY_CUSCA_URL = `${API_URL}/cusca/:cuscaId`;

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
        if (!id) {
            throw new Error('No se proporcionó un ID de empleado');
        }

        setLoading(true);
        setError(null);

        try {
            console.log(`Buscando empleado con ID: ${id}`);
            
            // Primero intentamos encontrar el empleado en la lista ya cargada
            const existingEmployee = employees.find(emp => emp._id === id || emp.cuscaId === id);
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
                    validateStatus: (status) => status < 500 // No lanzar error para códigos 4xx
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
                        validateStatus: (status) => status < 500 // No lanzar error para códigos 4xx
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
            setError(err.message || 'Error al cargar el empleado');
            console.error('Error al cargar el empleado:', err);
            throw err;
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
            // Preparar solo los datos necesarios para la actualización
            const dataToSend = {
                fullName: employeeData.fullName,
                inmediateBoss: employeeData.inmediateBoss || null,
                subManager: employeeData.subManager || null,
                country: employeeData.country,
                daylogRol: employeeData.daylogRol,
                position: employeeData.position,
                mainAreaArea: employeeData.mainAreaArea || null,
                isActive: employeeData.isActive
            };
            
            console.log('Enviando datos al servidor:', { id, dataToSend });

            console.log('URL de la petición:', `${API_URL}/${id}`);
            
            // Asegurarse de que los campos opcionales sean null si están vacíos
            // y que los ObjectIds sean válidos
            const payload = {
                ...dataToSend,
                inmediateBoss: dataToSend.inmediateBoss || null,
                subManager: dataToSend.subManager || null,
                mainAreaArea: dataToSend.mainAreaArea || null,
                position: dataToSend.position || '',
                // Si country no es un ObjectId, buscarlo en la base de datos
                country: dataToSend.country
            };
            
            // Si country es un string (nombre del país), necesitamos obtener su ID
            if (typeof payload.country === 'string' && payload.country.trim() !== '') {
                try {
                    // Aquí asumimos que hay un endpoint para buscar países por nombre
                    const countryResponse = await axios.get(`http://localhost:3000/api/countries?name=${encodeURIComponent(payload.country)}`);
                    if (countryResponse.data && countryResponse.data.length > 0) {
                        payload.country = countryResponse.data[0]._id;
                    } else {
                        console.warn(`País no encontrado: ${payload.country}`);
                        delete payload.country; // O mantenerlo como está para ver qué pasa
                    }
                } catch (error) {
                    console.error('Error al buscar el país:', error);
                    // Si hay un error, mejor no enviar el campo country
                    delete payload.country;
                }
            }
            
            console.log('Datos a enviar (formateados):', JSON.stringify(payload, null, 2));
            
            const response = await axios({
                method: 'put',
                url: `${API_URL}/${id}`,
                data: payload,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                validateStatus: function (status) {
                    return status < 500;
                }
            });
            
            console.log('Respuesta del servidor:', response);
            
            if (response.status >= 400) {
                // Si hay errores de validación, lanzar el objeto completo de respuesta
                if (response.status === 400 && response.data?.errors) {
                    const error = new Error('Error de validación');
                    error.response = response;
                    error.isValidationError = true;
                    throw error;
                } else {
                    const error = new Error(response.data?.message || `Error ${response.status}: ${response.statusText}`);
                    error.response = response;
                    throw error;
                }
            }
            
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
    const searchEmployees = useCallback((query, options = {}) => {
        const { isBoss = false, isManager = false } = options;
        setSearchLoading(true);
        setSearchError(null);

        try {
            let filtered = [...employees];
            
            // Filtrar por isBoss si es necesario
            if (isBoss) {
                filtered = filtered.filter(employee => employee.isBoss === true);
            }
            
            // Filtrar por isManager si es necesario
            if (isManager) {
                filtered = filtered.filter(employee => employee.isManager === true);
            }

            // Aplicar filtro de búsqueda si hay query
            if (query) {
                const queryLower = query.toLowerCase();
                filtered = filtered.filter(employee => {
                    const fullName = employee.fullName?.toLowerCase() || '';
                    const cuscaId = employee.cuscaId?.toLowerCase() || '';
                    
                    // Buscar en nombre completo y Cusca ID
                    return fullName.includes(queryLower) || cuscaId.includes(queryLower);
                });
            }

            // Ordenar por relevancia si hay query, de lo contrario por nombre
            return filtered.sort((a, b) => {
                if (query) {
                    const scoreA = calculateRelevance.employee(a, query.toLowerCase());
                    const scoreB = calculateRelevance.employee(b, query.toLowerCase());
                    return scoreB - scoreA; // Orden descendente por relevancia
                } else {
                    // Ordenar alfabéticamente por nombre si no hay query
                    return (a.fullName || '').localeCompare(b.fullName || '');
                }
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

    // Función para buscar puestos de trabajo (versión simplificada)
    const searchPositions = useCallback(async (query) => {
        // Lista estática de puestos comunes como respaldo
        const commonPositions = [
            'Ejecutivo de ventas',
            'Analista de riesgos',
            'Asesor de atención al cliente',
            'Gerente de sucursal',
            'Analista de créditos',
            'Desarrollador de software',
            'Coordinador de marketing',
            'Técnico de soporte IT',
            'Asistente administrativo',
            'Ejecutivo de cuentas Corporativas'
        ];

        // Filtrar los puestos que coincidan con la búsqueda
        const filtered = commonPositions.filter(position => 
            position.toLowerCase().includes(query.toLowerCase())
        );

        return filtered;
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
        getEmployeeById,
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