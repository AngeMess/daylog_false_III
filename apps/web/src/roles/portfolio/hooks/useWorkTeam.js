import { useState, useEffect } from 'react';

const useWorkTeam = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [workTeams, setWorkTeams] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [areas, setAreas] = useState([]);

  // Obtener todos los equipos de trabajo con datos poblados
  const fetchWorkTeams = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/workteams');
      if (!response.ok) throw new Error('Error al obtener equipos de trabajo');
      const data = await response.json();
      
      console.log('Equipos obtenidos con populate:', data);
      
      setWorkTeams(data);
      return data;
    } catch (err) {
      console.error('Error en fetchWorkTeams:', err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Obtener equipo por ID con datos poblados
  const fetchWorkTeamById = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`http://localhost:3000/api/workteams/${id}`);
      if (!response.ok) {
        throw new Error('Error al obtener el equipo de trabajo');
      }
      
      const data = await response.json();
      console.log('Equipo obtenido por ID con populate:', data);
      return data;
    } catch (err) {
      console.error('Error en fetchWorkTeamById:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchAreas = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/mainAreaArea');
      if (!response.ok) throw new Error('Error al obtener áreas');
      const data = await response.json();
      
      console.log('Datos de áreas obtenidos:', data);
      
      setAreas(data);
      return data;
    } catch (err) {
      console.error('Error en fetchAreas:', err);
      setError(err.message);
      return [];
    }
  };

  // Función para obtener el nombre del área (ahora simplificada)
  const getAreaName = (mainAreaAreaData) => {
    // Si los datos ya vienen poblados del backend
    if (mainAreaAreaData && typeof mainAreaAreaData === 'object') {
      const mainAreaName = mainAreaAreaData.mainArea?.name || 'Área Principal';
      const areaName = mainAreaAreaData.area?.name || 'Subárea';
      return `${mainAreaName} - ${areaName}`;
    }
    
    // Fallback: si solo viene el ID, buscar en areas
    if (typeof mainAreaAreaData === 'string') {
      const area = areas.find(area => area._id === mainAreaAreaData);
      if (!area) {
        return 'Sin área';
      }
      const mainAreaName = area.mainArea?.name || 'Área Principal';
      const areaName = area.area?.name || 'Subárea';
      return `${mainAreaName} - ${areaName}`;
    }
    
    return 'Sin área';
  };

  // Buscar empleados por nombre o CuscaID con filtro por rol
  const searchEmployees = async (searchTerm = '', roleFilter = null) => {
    try {
      const response = await fetch(`http://localhost:3000/api/employee`);
      if (!response.ok) throw new Error('Error al buscar empleados');
      const allEmployees = await response.json();
      
      let filteredByRole = allEmployees;
      if (roleFilter) {
        filteredByRole = allEmployees.filter(employee => 
          employee.daylogRol === roleFilter
        );
      }
      
      if (!searchTerm.trim()) {
        return filteredByRole.slice(0, 10);
      }
      
      const filteredEmployees = filteredByRole.filter(employee => 
        employee.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.cuscaId.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      const sortedEmployees = filteredEmployees.sort((a, b) => {
        const aNameMatch = a.fullName.toLowerCase().startsWith(searchTerm.toLowerCase());
        const bNameMatch = b.fullName.toLowerCase().startsWith(searchTerm.toLowerCase());
        const aIdMatch = a.cuscaId.toLowerCase().startsWith(searchTerm.toLowerCase());
        const bIdMatch = b.cuscaId.toLowerCase().startsWith(searchTerm.toLowerCase());
        
        if ((aNameMatch || aIdMatch) && !(bNameMatch || bIdMatch)) return -1;
        if (!(aNameMatch || aIdMatch) && (bNameMatch || bIdMatch)) return 1;
        return a.fullName.localeCompare(b.fullName);
      });
      
      return sortedEmployees.slice(0, 10); 
    } catch (err) {
      setError(err.message);
      return [];
    }
  };

  // Función para buscar empleados con múltiples roles
  const searchMultipleRoleEmployees = async (searchTerm = '') => {
    try {
      const response = await fetch(`http://localhost:3000/api/employee`);
      if (!response.ok) throw new Error('Error al buscar empleados');
      const allEmployees = await response.json();
      
      const allowedRoles = ['Empleado', 'Supervisor', 'Portafolio'];
      let filteredByRole = allEmployees.filter(employee => 
        allowedRoles.includes(employee.daylogRol)
      );
      
      if (!searchTerm.trim()) {
        return filteredByRole.slice(0, 10);
      }
      
      const filteredEmployees = filteredByRole.filter(employee => 
        employee.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.cuscaId.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      const sortedEmployees = filteredEmployees.sort((a, b) => {
        const aNameMatch = a.fullName.toLowerCase().startsWith(searchTerm.toLowerCase());
        const bNameMatch = b.fullName.toLowerCase().startsWith(searchTerm.toLowerCase());
        const aIdMatch = a.cuscaId.toLowerCase().startsWith(searchTerm.toLowerCase());
        const bIdMatch = b.cuscaId.toLowerCase().startsWith(searchTerm.toLowerCase());
        
        if ((aNameMatch || aIdMatch) && !(bNameMatch || bIdMatch)) return -1;
        if (!(aNameMatch || aIdMatch) && (bNameMatch || bIdMatch)) return 1;
        return a.fullName.localeCompare(b.fullName);
      });
      
      return sortedEmployees.slice(0, 10); 
    } catch (err) {
      setError(err.message);
      return [];
    }
  };

  // Obtener supervisores 
  const searchSupervisors = async (searchTerm = '') => {
    return await searchEmployees(searchTerm, 'Supervisor');
  };

  // Obtener empleados regulares 
  const searchRegularEmployees = async (searchTerm = '') => {
    return await searchEmployees(searchTerm, 'Empleado');
  };

  // Obtener todos los empleados
  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/employee');
      if (!response.ok) throw new Error('Error al obtener empleados');
      const data = await response.json();
      setEmployees(data);
      return data;
    } catch (err) {
      setError(err.message);
      return [];
    }
  };

  // Obtener empleados por rol específico
  const getEmployeesByRole = async (role) => {
    try {
      const response = await fetch('http://localhost:3000/api/employee');
      if (!response.ok) throw new Error('Error al obtener empleados');
      const allEmployees = await response.json();
      return allEmployees.filter(employee => employee.daylogRol === role);
    } catch (err) {
      setError(err.message);
      return [];
    }
  };

  // Obtener empleados por múltiples roles
  const getEmployeesByMultipleRoles = async (roles) => {
    try {
      const response = await fetch('http://localhost:3000/api/employee');
      if (!response.ok) throw new Error('Error al obtener empleados');
      const allEmployees = await response.json();
      return allEmployees.filter(employee => roles.includes(employee.daylogRol));
    } catch (err) {
      setError(err.message);
      return [];
    }
  };

// Crear nuevo equipo de trabajo
const createWorkTeam = async (workTeamData) => {
  try {
    setLoading(true);
    setError(null);

    const formattedData = {
      name: workTeamData.name,
      supervisor: workTeamData.supervisor,
      code: workTeamData.code,
      teamType: workTeamData.teamType,
      mainAreaArea: workTeamData.mainAreaArea,
      isActive: Boolean(workTeamData.isActive),
      employees: workTeamData.employees.map(emp => ({
        id: emp.id || emp._id 
      }))
    };

    console.log('Datos enviados:', formattedData); 

    const response = await fetch('http://localhost:3000/api/workteams', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formattedData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al crear el equipo de trabajo');
    }

    const result = await response.json();
    await fetchWorkTeams();
    
    return { success: true, data: result };
  } catch (err) {
    console.error('Error en createWorkTeam:', err);
    setError(err.message);
    return { success: false, error: err.message };
  } finally {
    setLoading(false);
  }
};

// Actualizar equipo de trabajo
const updateWorkTeam = async (id, workTeamData) => {
  try {
    setLoading(true);
    setError(null);

    const formattedData = {
      name: workTeamData.name,
      supervisor: workTeamData.supervisor,
      code: workTeamData.code,
      teamType: workTeamData.teamType,
      mainAreaArea: workTeamData.mainAreaArea,
      employees: workTeamData.employees,
      isActive: workTeamData.isActive !== undefined ? workTeamData.isActive : true
    };

    const response = await fetch(`http://localhost:3000/api/workteams/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formattedData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al actualizar el equipo de trabajo');
    }

    const result = await response.json();
    await fetchWorkTeams();
    
    return { success: true, data: result };
  } catch (err) {
    setError(err.message);
    return { success: false, error: err.message };
  } finally {
    setLoading(false);
  }
};


  // Eliminar equipo de trabajo
  const deleteWorkTeam = async (id) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`http://localhost:3000/api/workteams/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar el equipo de trabajo');
      }

      const result = await response.json();
      
      await fetchWorkTeams();
      
      return { success: true, data: result };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Generar código automático para el equipo
  const generateTeamCode = (teamName, teamType) => {
    const namePrefix = teamName.substring(0, 3).toUpperCase();
    const typePrefix = teamType.substring(0, 2).toUpperCase();
    const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${namePrefix}${typePrefix}${randomSuffix}`;
  };

  // Obtener equipos de trabajo por empleado
  const getWorkTeamsByEmployee = async (employeeId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`http://localhost:3000/api/workteams/employee/${employeeId}`);
      
      if (!response.ok) {
        throw new Error('Error al obtener los equipos de trabajo del empleado');
      }
      
      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Error en getWorkTeamsByEmployee:', err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    // Estados
    loading,
    error,
    workTeams,
    employees,
    areas,
    
    // Funciones
    createWorkTeam,
    fetchWorkTeams,
    fetchWorkTeamById,
    updateWorkTeam,
    deleteWorkTeam,
    searchEmployees,
    searchSupervisors,
    searchRegularEmployees,
    searchMultipleRoleEmployees,
    fetchEmployees,
    fetchAreas,
    getEmployeesByRole,
    getEmployeesByMultipleRoles,
    generateTeamCode,
    getAreaName, 
    getWorkTeamsByEmployee, 
    
    // Utilidades
    setError: (error) => setError(error),
    clearError: () => setError(null),
  };
};

export default useWorkTeam; 