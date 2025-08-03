import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useWorkTeam from '../../../hooks/useWorkTeam';

/**
 * Hook personalizado para la lógica de la página de agregar equipo de trabajo
 * Maneja estados, búsquedas, selects, dropdowns, selección de supervisor/empleados/área, toasts y handlers del formulario.
 */
export default function useAddWorkTeamPage(onCancel) {
  const navigate = useNavigate();
  const {
    loading,
    error,
    areas,
    createWorkTeam,
    searchSupervisors,
    searchMultipleRoleEmployees,
    fetchAreas,
    getEmployeesByRole,
    getEmployeesByMultipleRoles,
    generateTeamCode,
    clearError
  } = useWorkTeam();

  const [formData, setFormData] = useState({
    name: '',
    teamType: '',
    mainAreaArea: '',
    supervisor: '',
    employees: []
  });
  const [supervisorSearch, setSupervisorSearch] = useState('');
  const [employeeSearch, setEmployeeSearch] = useState('');
  const [areaSearch, setAreaSearch] = useState('');
  const [showSupervisorDropdown, setShowSupervisorDropdown] = useState(false);
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
  const [showAreaDropdown, setShowAreaDropdown] = useState(false);
  const [filteredSupervisors, setFilteredSupervisors] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [filteredAreas, setFilteredAreas] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectedSupervisor, setSelectedSupervisor] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [showWarningToast, setShowWarningToast] = useState(false);
  const [customWarningMessage, setCustomWarningMessage] = useState('');
  const [showWorkTeam, setShowWorkTeam] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      const allAreas = await fetchAreas();
      setFilteredAreas(allAreas.slice(0, 10));
      const initialSupervisors = await getEmployeesByRole('Supervisor');
      setFilteredSupervisors(initialSupervisors.slice(0, 10));
      const initialEmployees = await getEmployeesByMultipleRoles(['Empleado', 'Supervisor', 'Portafolio']);
      setFilteredEmployees(initialEmployees.slice(0, 10));
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    const handleSupervisorSearch = async () => {
      const results = await searchSupervisors(supervisorSearch);
      setFilteredSupervisors(results.slice(0, 10));
    };
    const debounceTimer = setTimeout(handleSupervisorSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [supervisorSearch]);

  useEffect(() => {
    const handleEmployeeSearch = async () => {
      const results = await searchMultipleRoleEmployees(employeeSearch);
      setFilteredEmployees(results.slice(0, 10));
    };
    const debounceTimer = setTimeout(handleEmployeeSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [employeeSearch]);

  useEffect(() => {
    const handleAreaSearch = () => {
      if (!areaSearch.trim()) {
        setFilteredAreas(areas.slice(0, 10));
        return;
      }
      const lowercasedSearch = areaSearch.toLowerCase();
      const results = areas.filter(areaRel => {
        const mainAreaName = areaRel.mainArea?.name?.toLowerCase() || '';
        const areaName = areaRel.area?.name?.toLowerCase() || '';
        return mainAreaName.includes(lowercasedSearch) || areaName.includes(lowercasedSearch);
      }).slice(0, 10);
      setFilteredAreas(results);
    };
    const debounceTimer = setTimeout(handleAreaSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [areaSearch, areas]);

  // Handlers
  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSelectEmployee = (employee) => {
    if (selectedSupervisor && selectedSupervisor._id === employee._id) {
      setCustomWarningMessage('El supervisor a cargo no puede ser parte del equipo.');
      setShowWarningToast(true);
      setTimeout(() => setShowWarningToast(false), 3000);
      return;
    }
    if (!selectedEmployees.find(emp => emp._id === employee._id)) {
      setSelectedEmployees(prev => [...prev, employee]);
      setFormData(prev => ({
        ...prev,
        employees: [...prev.employees, { id: employee._id }]
      }));
    }
    setEmployeeSearch('');
    setShowEmployeeDropdown(false);
  };

  const handleRemoveEmployee = (employeeId) => {
    setSelectedEmployees(prev => prev.filter(emp => emp._id !== employeeId));
    setFormData(prev => ({
      ...prev,
      employees: prev.employees.filter(emp => emp.id !== employeeId)
    }));
  };

  const handleSelectSupervisor = (employee) => {
    setSelectedSupervisor(employee);
    setFormData(prev => ({ ...prev, supervisor: employee._id }));
    setSupervisorSearch(employee.fullName);
    setShowSupervisorDropdown(false);
  };

  const handleSelectArea = (area) => {
    setSelectedArea(area);
    setFormData(prev => ({ ...prev, mainAreaArea: area._id }));
    setAreaSearch(`${area.mainArea?.name || 'Área Principal'} - ${area.area?.name || 'Subárea'}`);
    setShowAreaDropdown(false);
  };

  const navigateToWorkTeam = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate('/admin/grupos');
    }
  };

  const handleCancel = () => {
    navigateToWorkTeam();
  };

  const tipoEquipoOptions = [
    { value: 'Kanban Team', label: 'Kanban Team' },
    { value: 'Extreme Programming', label: 'Extreme Programming' },
    { value: 'Feature Team', label: 'Feature Team' },
    { value: 'Agile Product Team', label: 'Agile Product Team' },
    { value: 'Tribe y Squad', label: 'Tribe y Squad' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setShowSuccessToast(false);
    setShowErrorToast(false);
    setShowWarningToast(false);
    setCustomWarningMessage('');
    if (!formData.name || !formData.teamType || !formData.mainAreaArea || !formData.supervisor) {
      setCustomWarningMessage('Por favor, completa todos los campos requeridos.');
      setShowWarningToast(true);
      setTimeout(() => setShowWarningToast(false), 3000);
      return;
    }
    const code = generateTeamCode(formData.name, formData.teamType);
    const workTeamData = {
      ...formData,
      code,
      isActive: true
    };
    try {
      const result = await createWorkTeam(workTeamData);
      if (result.success) {
        setShowSuccessToast(true);
        setTimeout(() => {
          setShowSuccessToast(false);
          navigateToWorkTeam();
        }, 2000);
      } else {
        if (result.error && result.error.includes('Ya existe un equipo con este nombre')) {
          setCustomWarningMessage('El nombre del equipo ya existe');
          setShowWarningToast(true);
          setTimeout(() => setShowWarningToast(false), 3000);
        } else {
          setShowErrorToast(true);
          setTimeout(() => setShowErrorToast(false), 3000);
        }
      }
    } catch (err) {
      if (err.message.includes('Ya existe un equipo con este nombre')) {
        setCustomWarningMessage('El nombre del equipo ya existe');
        setShowWarningToast(true);
        setTimeout(() => setShowWarningToast(false), 3000);
      } else {
        setShowErrorToast(true);
        setTimeout(() => setShowErrorToast(false), 3000);
      }
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'Supervisor':
        return 'text-blue-600';
      case 'Empleado':
        return 'text-green-600';
      case 'Portafolio':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  return {
    loading,
    error,
    areas,
    formData,
    setFormData,
    supervisorSearch,
    setSupervisorSearch,
    employeeSearch,
    setEmployeeSearch,
    areaSearch,
    setAreaSearch,
    showSupervisorDropdown,
    setShowSupervisorDropdown,
    showEmployeeDropdown,
    setShowEmployeeDropdown,
    showAreaDropdown,
    setShowAreaDropdown,
    filteredSupervisors,
    setFilteredSupervisors,
    filteredEmployees,
    setFilteredEmployees,
    filteredAreas,
    setFilteredAreas,
    selectedEmployees,
    setSelectedEmployees,
    selectedSupervisor,
    setSelectedSupervisor,
    selectedArea,
    setSelectedArea,
    showSuccessToast,
    setShowSuccessToast,
    showErrorToast,
    setShowErrorToast,
    showWarningToast,
    setShowWarningToast,
    customWarningMessage,
    setCustomWarningMessage,
    showWorkTeam,
    setShowWorkTeam,
    handleChange,
    handleSelectEmployee,
    handleRemoveEmployee,
    handleSelectSupervisor,
    handleSelectArea,
    handleCancel,
    tipoEquipoOptions,
    handleSubmit,
    getRoleColor
  };
} 