import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import useSEmployeeApi from '../../../hooks/useSEmployeeApi';
import useEmployeeSearch from '../../../hooks/useEmployeeSearch';

const useAddEmployee = () => {
  // Navegación
  const navigate = useNavigate();

  // API y búsqueda
  const {
    employees,
    areas,
    loading,
    error,
    getCountries,
    registerEmployee,
    searchEmployees,
    searchAreas,
    fetchAreas,
    searchPositions
  } = useSEmployeeApi();

  // Formulario
  const formMethods = useForm({
    defaultValues: {
      cuscaId: '',
      fullName: '',
      inmediateBoss: '',
      subManager: '',
      password: '',
      email: '',
      mainAreaArea: '',
      position: '',
      daylogRol: '',
      country: '',
      isBoss: false,
      isManager: false
    },
    mode: 'onChange',
    criteriaMode: 'all'
  });
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    setValue,
    watch,
    trigger,
    reset: resetForm
  } = formMethods;

  // Refs para dropdowns
  const bossSearchRef = useRef(null);
  const subManagerSearchRef = useRef(null);
  const areaSearchRef = useRef(null);
  const positionSearchRef = useRef(null);

  // Estados de búsqueda y selección
  const [searchBoss, setSearchBoss] = useState('');
  const [searchSubManager, setSearchSubManager] = useState('');
  const [searchArea, setSearchArea] = useState('');
  const [searchPosition, setSearchPosition] = useState('');
  const [showBossDropdown, setShowBossDropdown] = useState(false);
  const [showSubManagerDropdown, setShowSubManagerDropdown] = useState(false);
  const [showAreaDropdown, setShowAreaDropdown] = useState(false);
  const [showPositionDropdown, setShowPositionDropdown] = useState(false);
  const [filteredBosses, setFilteredBosses] = useState([]);
  const [filteredSubManagers, setFilteredSubManagers] = useState([]);
  const [filteredAreas, setFilteredAreas] = useState([]);
  const [filteredPositions, setFilteredPositions] = useState([]);
  const [selectedBoss, setSelectedBoss] = useState(null);
  const [selectedSubManager, setSelectedSubManager] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [searchError, setSearchError] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  // Estados de notificaciones y carga
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [showWarningToast, setShowWarningToast] = useState(false);

  // Efectos de búsqueda y sincronización
  useEffect(() => {
    const search = async () => {
      if (searchPosition) {
        try {
          setIsSearching(true);
          const results = await searchPositions(searchPosition);
          setFilteredPositions(results);
          setSearchError(null);
        } catch (err) {
          setSearchError('Error al buscar puestos');
          setFilteredPositions([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setFilteredPositions([]);
      }
    };
    const timer = setTimeout(() => { search(); }, 300);
    return () => clearTimeout(timer);
  }, [searchPosition, searchPositions]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (positionSearchRef.current && !positionSearchRef.current.contains(event.target)) setShowPositionDropdown(false);
      if (bossSearchRef.current && !bossSearchRef.current.contains(event.target)) setShowBossDropdown(false);
      if (subManagerSearchRef.current && !subManagerSearchRef.current.contains(event.target)) setShowSubManagerDropdown(false);
      if (areaSearchRef.current && !areaSearchRef.current.contains(event.target)) setShowAreaDropdown(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => { document.removeEventListener('mousedown', handleClickOutside); };
  }, []);

  const daylogRol = watch('daylogRol');
  useEffect(() => {
    if (daylogRol === 'Portafolio') {
      setValue('isManager', true, { shouldValidate: true, shouldDirty: true });
      setValue('isBoss', false, { shouldValidate: true, shouldDirty: true });
    } else if (daylogRol === 'Supervisor') {
      setValue('isBoss', true, { shouldValidate: true, shouldDirty: true });
      setValue('isManager', false, { shouldValidate: true, shouldDirty: true });
    } else {
      setValue('isBoss', false, { shouldValidate: true, shouldDirty: true });
      setValue('isManager', false, { shouldValidate: true, shouldDirty: true });
    }
    trigger();
  }, [daylogRol, setValue, trigger]);

  useEffect(() => {
    const loadInitialData = async () => {
      try { await fetchAreas(); } catch (error) { /* Manejo de error */ }
    };
    loadInitialData();
  }, [fetchAreas]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      try {
        const filtered = await searchEmployees(searchBoss || '', { isBoss: true });
        setFilteredBosses(filtered);
        setSearchError(null);
      } catch (error) {
        setSearchError('Error al buscar jefes');
        setFilteredBosses([]);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchBoss, searchEmployees]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      try {
        const filtered = await searchEmployees(searchSubManager || '', { isManager: true });
        setFilteredSubManagers(filtered);
        setSearchError(null);
      } catch (error) {
        setSearchError('Error al buscar subgerentes');
        setFilteredSubManagers([]);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchSubManager, searchEmployees]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchArea) {
        const filtered = await searchAreas(searchArea);
        setFilteredAreas(filtered);
      } else {
        setFilteredAreas(areas);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchArea, searchAreas, areas]);

  const getCountryId = useCallback(async (countryName) => {
    if (!countryName) return null;
    try {
      const countries = await getCountries();
      const country = countries.find(c => c.name === countryName);
      if (!country) throw new Error(`País con nombre ${countryName} no encontrado`);
      return country._id;
    } catch (error) {
      setShowErrorToast(true);
      throw error;
    }
  }, [getCountries]);

  // Función para generar contraseña segura
  const generateStrongPassword = useMemo(() => () => {
    const length = 12;
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+~`|}{[]\\:;?><,./-=';
    let password = [
      uppercase.charAt(Math.floor(Math.random() * uppercase.length)),
      lowercase.charAt(Math.floor(Math.random() * lowercase.length)),
      numbers.charAt(Math.floor(Math.random() * numbers.length)),
      symbols.charAt(Math.floor(Math.random() * symbols.length))
    ];
    const allChars = uppercase + lowercase + numbers + symbols;
    for (let i = password.length; i < length; i++) {
      password.push(allChars.charAt(Math.floor(Math.random() * allChars.length)));
    }
    return password.sort(() => Math.random() - 0.5).join('');
  }, []);

  // Envío del formulario
  const onSubmit = async (data, e) => {
    e?.preventDefault();
    setRegisterLoading(true);
    setRegisterError(null);
    try {
      const isValid = await trigger();
      if (!isValid) {
        setShowWarningToast(true);
        setTimeout(() => setShowWarningToast(false), 3000);
        return;
      }
      const countryId = await getCountryId(data.country);
      const employeeData = {
        cuscaId: data.cuscaId.trim(),
        fullName: data.fullName.trim(),
        email: data.email.toLowerCase().trim(),
        password: data.password,
        daylogRol: data.daylogRol,
        position: data.position,
        country: countryId,
        inmediateBoss: selectedBoss?._id || '',
        subManager: selectedSubManager?._id || '',
        mainAreaArea: selectedArea?._id || '',
        isBoss: data.daylogRol === 'Portafolio',
        isManager: data.daylogRol === 'Supervisor'
      };
      const response = await registerEmployee(employeeData);
      if (response) {
        setShowSuccessToast(true);
        resetForm();
        setTimeout(() => { navigate('/admin/gestionEmpleados'); }, 1500);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Error al registrar el empleado';
      setRegisterError(errorMessage);
      setShowErrorToast(true);
    } finally {
      setRegisterLoading(false);
    }
  };

  return {
    // Estados y helpers para el formulario y UI
    control,
    handleSubmit,
    errors,
    isSubmitting,
    isValid,
    setValue,
    watch,
    trigger,
    resetForm,
    bossSearchRef,
    subManagerSearchRef,
    areaSearchRef,
    positionSearchRef,
    searchBoss,
    setSearchBoss,
    searchSubManager,
    setSearchSubManager,
    searchArea,
    setSearchArea,
    searchPosition,
    setSearchPosition,
    showBossDropdown,
    setShowBossDropdown,
    showSubManagerDropdown,
    setShowSubManagerDropdown,
    showAreaDropdown,
    setShowAreaDropdown,
    showPositionDropdown,
    setShowPositionDropdown,
    filteredBosses,
    setFilteredBosses,
    filteredSubManagers,
    setFilteredSubManagers,
    filteredAreas,
    setFilteredAreas,
    filteredPositions,
    setFilteredPositions,
    selectedBoss,
    setSelectedBoss,
    selectedSubManager,
    setSelectedSubManager,
    selectedArea,
    setSelectedArea,
    selectedPosition,
    setSelectedPosition,
    searchError,
    setSearchError,
    isSearching,
    setIsSearching,
    registerLoading,
    setRegisterLoading,
    registerError,
    setRegisterError,
    showSuccessToast,
    setShowSuccessToast,
    showErrorToast,
    setShowErrorToast,
    showWarningToast,
    setShowWarningToast,
    generateStrongPassword,
    onSubmit,
    employees,
    areas,
    loading,
    error
  };
};

export default useAddEmployee;
