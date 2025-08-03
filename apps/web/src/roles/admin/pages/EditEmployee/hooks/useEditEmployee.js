import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import useEmployeeApi from '../../../hooks/useSEmployeeApi';
import useEmployeeSearch from '../../../hooks/useEmployeeSearch';

const useEditEmployee = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    employees,
    searchEmployees,
    searchAreas,
    areas,
    getEmployeeById,
    updateEmployee,
    loading,
    error,
    searchPositions
  } = useEmployeeApi();
  const { searchEmployees: searchEmployeesHook } = useEmployeeSearch();

  // Estados para el formulario
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    jefeInmediato: '',
    subGerente: '',
    area: '',
    pais: '',
    rol: '',
    puesto: '',
    estado: 'Habilitado'
  });

  // Estados para el loading y errores
  const [isLoading, setIsLoading] = useState(true);
  const [localError, setLocalError] = useState(null);

  // Referencias para los contenedores de búsqueda
  const bossSearchRef = useRef(null);
  const subManagerSearchRef = useRef(null);
  const positionSearchRef = useRef(null);
  const areaSearchRef = useRef(null);

  // Estados para los buscadores y dropdowns
  const [searchBoss, setSearchBoss] = useState('');
  const [searchSubManager, setSearchSubManager] = useState('');
  const [searchPosition, setSearchPosition] = useState('');
  const [searchArea, setSearchArea] = useState('');
  const [showBossDropdown, setShowBossDropdown] = useState(false);
  const [showSubManagerDropdown, setShowSubManagerDropdown] = useState(false);
  const [showPositionDropdown, setShowPositionDropdown] = useState(false);
  const [showAreaDropdown, setShowAreaDropdown] = useState(false);
  const [filteredBosses, setFilteredBosses] = useState([]);
  const [filteredSubManagers, setFilteredSubManagers] = useState([]);
  const [filteredPositions, setFilteredPositions] = useState([]);
  const [filteredAreas, setFilteredAreas] = useState([]);
  const [selectedBoss, setSelectedBoss] = useState(null);
  const [selectedSubManager, setSelectedSubManager] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);
  const [searchError, setSearchError] = useState(null);
  const [employee, setEmployee] = useState(null);

  // Estados para los toasts
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);

  // Opciones para los selects
  const paisesOptions = [
    { value: 'El Salvador', label: 'El Salvador' },
    { value: 'Guatemala', label: 'Guatemala' },
    { value: 'Honduras', label: 'Honduras' }
  ];

  const rolesOptions = [
    { value: 'Portafolio', label: 'Portafolio' },
    { value: 'Empleado', label: 'Empleado' },
    { value: 'Supervisor', label: 'Supervisor' },
    { value: 'Admin', label: 'Admin' }
  ];

  const estadosOptions = [
    { value: 'Habilitado', label: 'Habilitado' },
    { value: 'Deshabilitado', label: 'Deshabilitado' }
  ];

  // Cargar datos iniciales
  useEffect(() => {
    let isMounted = true;
    const loadEmployeeData = async () => {
      try {
        if (employees.length === 0) {
          await searchEmployees('');
        }
        if (areas.length === 0) {
          await searchAreas('');
        }
        const employeeData = await getEmployeeById(id);
        if (isMounted && employeeData) {
          setEmployee(employeeData);
          setLocalError(null);
          setFormData({
            nombreCompleto: employeeData.fullName || '',
            jefeInmediato: employeeData.inmediateBoss?.fullName || '',
            subGerente: employeeData.subManager?.fullName || '',
            area: employeeData.mainAreaArea?.name || '',
            pais: employeeData.country || '',
            rol: employeeData.daylogRol || '',
            puesto: employeeData.position || '',
            estado: employeeData.isActive ? 'Habilitado' : 'Inhabilitado'
          });
          if (employeeData.inmediateBoss) {
            setSelectedBoss(employeeData.inmediateBoss);
            setSearchBoss(employeeData.inmediateBoss.fullName || '');
          }
          if (employeeData.subManager) {
            setSelectedSubManager(employeeData.subManager);
            setSearchSubManager(employeeData.subManager.fullName || '');
          }
          if (employeeData.position) {
            setSelectedPosition(employeeData.position);
            setSearchPosition(employeeData.position);
          }
          if (employeeData.mainAreaArea) {
            setSelectedArea(employeeData.mainAreaArea);
            setSearchArea(employeeData.mainAreaArea.name || '');
          }
        }
      } catch (err) {
        if (isMounted) {
          setLocalError('Error al cargar los datos del empleado');
          toast.error('No se pudieron cargar los datos del empleado', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    loadEmployeeData();
    return () => { isMounted = false; };
  }, [id, getEmployeeById, searchEmployees, searchAreas, employees.length, areas.length]);

  // Event listener para ocultar dropdowns al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (bossSearchRef.current && !bossSearchRef.current.contains(event.target)) {
        setShowBossDropdown(false);
      }
      if (subManagerSearchRef.current && !subManagerSearchRef.current.contains(event.target)) {
        setShowSubManagerDropdown(false);
      }
      if (positionSearchRef.current && !positionSearchRef.current.contains(event.target)) {
        setShowPositionDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => { document.removeEventListener('mousedown', handleClickOutside); };
  }, []);

  // Buscar jefes cuando se cambia la búsqueda
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchBoss) {
        try {
          const filtered = await searchEmployees(searchBoss);
          setFilteredBosses(filtered);
          setSearchError(null);
        } catch (error) {
          setSearchError('Error al buscar jefes');
        }
      } else {
        setFilteredBosses(employees);
        setSearchError(null);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchBoss, searchEmployees]);

  // Buscar subgerentes cuando se cambia la búsqueda
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchSubManager) {
        try {
          const filtered = await searchEmployees(searchSubManager);
          setFilteredSubManagers(filtered);
          setSearchError(null);
        } catch (error) {
          setSearchError('Error al buscar subgerentes');
        }
      } else {
        setFilteredSubManagers(employees);
        setSearchError(null);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchSubManager, searchEmployees]);

  // Buscar puestos cuando se cambia la búsqueda
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchPosition) {
        const positions = [
          'Analista de riesgos',
          'Asesor de atención al cliente',
          'Desarrollador de software',
          'Portafolio',
          'Operaciones',
          'Admin',
          'Analista',
          'Desarrollador'
        ];
        const filtered = positions.filter(position =>
          position.toLowerCase().includes(searchPosition.toLowerCase())
        );
        setFilteredPositions(filtered);
      } else {
        setFilteredPositions([]);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchPosition]);

  // Buscar áreas cuando se cambia la búsqueda
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchArea) {
        try {
          const filtered = await searchAreas(searchArea);
          setFilteredAreas(filtered);
          setSearchError(null);
        } catch (error) {
          setSearchError('Error al buscar áreas');
        }
      } else {
        setFilteredAreas([]);
        setSearchError(null);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchArea, searchAreas]);

  // Manejador de cambios en los inputs
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  // Manejadores para los buscadores
  const handleSearch = {
    boss: (e) => {
      setSearchBoss(e.target.value);
      if (e.target.value) {
        setShowBossDropdown(true);
      }
    },
    subManager: (e) => {
      setSearchSubManager(e.target.value);
      if (e.target.value) {
        setShowSubManagerDropdown(true);
      }
    },
    position: (e) => {
      setSearchPosition(e.target.value);
      if (e.target.value) {
        setShowPositionDropdown(true);
      }
    },
    area: (e) => {
      setSearchArea(e.target.value);
      if (e.target.value) {
        setShowAreaDropdown(true);
      }
    }
  };

  const handleSelect = {
    boss: (employee) => {
      setSelectedBoss(employee);
      setFormData(prev => ({ ...prev, jefeInmediato: employee.fullName }));
      setSearchBoss('');
      setShowBossDropdown(false);
    },
    subManager: (employee) => {
      setSelectedSubManager(employee);
      setFormData(prev => ({ ...prev, subGerente: employee.fullName }));
      setSearchSubManager('');
      setShowSubManagerDropdown(false);
    },
    position: (position) => {
      setSelectedPosition(position);
      setFormData(prev => ({ ...prev, puesto: position }));
      setSearchPosition('');
      setShowPositionDropdown(false);
    },
    area: (area) => {
      setSelectedArea(area);
      setFormData(prev => ({ ...prev, area: area.mainArea?.name || area.area?.name }));
      setSearchArea('');
      setShowAreaDropdown(false);
    }
  };

  // Manejador para el botón de cancelar
  const handleCancel = () => {
    navigate('/admin/gestionEmpleados');
  };

  // Validar campos obligatorios
  const validateRequiredFields = () => {
    const requiredFields = [
      { key: 'nombreCompleto', label: 'Nombre Completo' },
      { key: 'rol', label: 'Rol' },
      { key: 'puesto', label: 'Puesto' },
      { key: 'area', label: 'Área' }
    ];
    const missingFields = [];
    requiredFields.forEach(field => {
      if (!formData[field.key] || formData[field.key].trim() === '') {
        missingFields.push(field.label);
      }
    });
    return missingFields;
  };

  // Manejador para el botón de actualizar
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    const missingFields = validateRequiredFields();
    if (missingFields.length > 0) {
      toast.error(`Por favor complete los siguientes campos obligatorios: ${missingFields.join(', ')}`);
      return;
    }
    setIsLoading(true);
    try {
      const dataToSend = {
        fullName: formData.nombreCompleto,
        inmediateBoss: selectedBoss?._id,
        subManager: selectedSubManager?._id,
        country: formData.pais,
        daylogRol: formData.rol,
        position: selectedPosition,
        mainAreaArea: selectedArea?._id,
        isActive: formData.estado === 'Habilitado'
      };
      Object.keys(dataToSend).forEach(key => {
        if (dataToSend[key] === undefined || dataToSend[key] === '') {
          dataToSend[key] = null;
        }
      });
      const toastId = toast.loading('Actualizando empleado...');
      try {
        const result = await updateEmployee(id, dataToSend);
        toast.update(toastId, {
          render: 'Empleado actualizado correctamente',
          type: 'success',
          isLoading: false,
          autoClose: 3000,
          closeButton: true,
        });
        setTimeout(() => {
          navigate('/admin/gestionEmpleados');
        }, 1500);
      } catch (error) {
        toast.dismiss(toastId);
        setLocalError(error.message);
        toast.error(error.message || 'Error al actualizar el empleado. Por favor, inténtalo de nuevo.');
      } finally {
        setIsLoading(false);
      }
    } catch (error) {
      toast.error('Ocurrió un error inesperado. Por favor, inténtalo de nuevo.');
      setLocalError('Error inesperado al procesar la solicitud');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    navigate,
    id,
    employees,
    searchEmployees,
    searchAreas,
    areas,
    getEmployeeById,
    updateEmployee,
    loading,
    error,
    searchPositions,
    searchEmployeesHook,
    formData,
    setFormData,
    isLoading,
    setIsLoading,
    localError,
    setLocalError,
    bossSearchRef,
    subManagerSearchRef,
    positionSearchRef,
    areaSearchRef,
    searchBoss,
    setSearchBoss,
    searchSubManager,
    setSearchSubManager,
    searchPosition,
    setSearchPosition,
    searchArea,
    setSearchArea,
    showBossDropdown,
    setShowBossDropdown,
    showSubManagerDropdown,
    setShowSubManagerDropdown,
    showPositionDropdown,
    setShowPositionDropdown,
    showAreaDropdown,
    setShowAreaDropdown,
    filteredBosses,
    setFilteredBosses,
    filteredSubManagers,
    setFilteredSubManagers,
    filteredPositions,
    setFilteredPositions,
    filteredAreas,
    setFilteredAreas,
    selectedBoss,
    setSelectedBoss,
    selectedSubManager,
    setSelectedSubManager,
    selectedPosition,
    setSelectedPosition,
    selectedArea,
    setSelectedArea,
    searchError,
    setSearchError,
    employee,
    setEmployee,
    showSuccessToast,
    setShowSuccessToast,
    showErrorToast,
    setShowErrorToast,
    paisesOptions,
    rolesOptions,
    estadosOptions,
    handleChange,
    handleSearch,
    handleSelect,
    handleCancel,
    validateRequiredFields,
    handleSubmit
  };
};

export default useEditEmployee;
