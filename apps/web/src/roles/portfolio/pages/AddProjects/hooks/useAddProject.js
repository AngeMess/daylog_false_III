import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import useProyectsApi from '../../../../../hooks/useProjectsApi';
import axios from 'axios';
import { toast } from 'react-hot-toast';

/**
 * Hook personalizado para manejar la lógica de creación de proyectos
 * Encapsula todo el estado, efectos y funciones relacionadas con el formulario de creación
 */
const useAddProject = () => {
  const navigate = useNavigate();
  const { createProyect } = useProyectsApi();

  // Estados para toasts y loading
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [showWarningToast, setShowWarningToast] = useState(false);
  const [loading, setLoading] = useState(false);

  // Estados para datos de formulario
  const [supervisors, setSupervisors] = useState([]);
  const [countries, setCountries] = useState([]);
  const [workTeams, setWorkTeams] = useState([]);
  const [mainAreaAreas, setMainAreaAreas] = useState([]);

  // Configuración del formulario con react-hook-form
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    reset
  } = useForm({
    defaultValues: {
      code: '',
      proyectName: '',
      supervisor: '',
      mainAreaArea: '',
      country: '',
      state: 'Pendiente',
      visibility: 'Privado',
      size: 'Mediano',
      workTeam: '',
      startDate: '',
      endDate: '',
      saturation: 'Normal'
    }
  });

  // Reglas de validación para el formulario
  const validationRules = {
    code: {
      required: "El código es obligatorio",
      maxLength: { value: 6, message: "Máximo 6 caracteres" }
    },
    proyectName: {
      required: "El nombre del proyecto es obligatorio",
      maxLength: { value: 100, message: "Máximo 100 caracteres" }
    },
    workTeam: { required: "El equipo de trabajo es obligatorio" },
    country: { required: "El país es obligatorio" },
    state: { required: "El estado es obligatorio" },
    size: { required: "El tamaño es obligatorio" },
    startDate: { required: "La fecha de inicio es obligatoria" },
    endDate: { required: "La fecha de finalización es obligatoria" },
    saturation: { required: "La saturación es obligatoria" }
  };

  // Opciones para los selectores del formulario
  const sizeOptions = [
    { value: 'Grande', label: 'Grande' },
    { value: 'Mediano', label: 'Mediano' },
    { value: 'Pequeño', label: 'Pequeño' }
  ];

  const saturationOptions = [
    { value: 'Baja', label: 'Baja' },
    { value: 'Normal', label: 'Normal' },
    { value: 'Alta', label: 'Alta' }
  ];

  // Cargar datos iniciales para los selectores
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [supervisorsRes, countriesRes, workTeamsRes, mainAreaAreasRes] = await Promise.all([
          axios.get('http://localhost:3000/api/employee?rol=Supervisor'),
          axios.get('http://localhost:3000/api/country'),
          axios.get('http://localhost:3000/api/workteams'),
          axios.get('http://localhost:3000/api/mainAreaArea')
        ]);

        setSupervisors(supervisorsRes.data.map(s => ({
          value: s._id,
          label: s.fullName
        })));

        setCountries(countriesRes.data.map(c => ({
          value: c._id,
          label: c.name
        })));

        setWorkTeams(workTeamsRes.data.map(w => ({
          value: w._id,
          label: w.name
        })));

        setMainAreaAreas(mainAreaAreasRes.data.map(a => ({
          value: a._id,
          label: `${a.mainArea?.name || 'Sin nombre'} - ${a.area?.name || 'Sin nombre'}`
        })));
      } catch (error) {
        console.error('Error cargando datos relacionados:', error);
        setShowErrorToast(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /**
   * Función para manejar el envío del formulario
   * @param {Object} data - Datos del formulario
   */
  const onSubmit = async (data) => {
    // Limpia los campos vacíos
    const cleanData = { ...data };
    if (!cleanData.supervisor) cleanData.supervisor = null;
    if (!cleanData.mainAreaArea) cleanData.mainAreaArea = null;

    try {
      setLoading(true);
      const proyectData = {
        code: data.code,
        proyectName: data.proyectName,
        startDate: data.startDate,
        finishDate: data.endDate,
        size: data.size,
        state: data.state,
        workTeam: data.workTeam,
        country: data.country,
        visible: false, // Los proyectos nuevos siempre inician como no visibles
        eliminated: false,
        saturation: data.saturation,
        mainAreaArea: data.mainAreaArea || null,
        supervisor: data.supervisor || null,
        visibility: 'Privado' // Usar Privado para que coincida con visible:false
      };

      console.log('Enviando datos al servidor:', proyectData);
      const response = await createProyect(proyectData);
      console.log('Respuesta del servidor:', response);

      // Si la respuesta tiene un proyecto con ID, el proyecto se creó correctamente
      if (response && response.proyect && response.proyect._id) {
        console.log('Proyecto creado con éxito, ID:', response.proyect._id);
        setShowSuccessToast(true);
        setShowErrorToast(false);

        // Redirigir después de un breve retraso
        setTimeout(() => {
          console.log('Redirigiendo a la lista de proyectos...');
          navigate('/portafolio/proyectos', { replace: true });
        }, 2000);
      } else {
        console.error('La respuesta del servidor no contiene un ID válido');
        setShowErrorToast(true);
        setShowSuccessToast(false);
      }
    } catch (error) {
      console.error('Error al crear proyecto:', error);
      
      // Mostrar toast específico según el tipo de error
      let errorMessage = 'Error al crear el proyecto';
      let toastStyle = {
        background: '#fee2e2',
        color: '#991b1b',
        border: '1px solid #fecaca'
      };
      
      if (error.response?.status === 409) {
        errorMessage = 'Ya existe un proyecto con ese código';
        toastStyle = {
          background: '#fef3c7',
          color: '#92400e',
          border: '1px solid #fde68a'
        };
      } else if (error.response?.status === 400) {
        errorMessage = 'Datos inválidos. Verifica la información ingresada';
      } else if (error.response?.status === 500) {
        // Verificar si es error de código duplicado en el mensaje del servidor
        const serverMessage = error.response?.data?.message || '';
        if (serverMessage.toLowerCase().includes('código') || serverMessage.toLowerCase().includes('code')) {
          errorMessage = 'El código del proyecto ya está ocupado';
          toastStyle = {
            background: '#fef3c7',
            color: '#92400e',
            border: '1px solid #fde68a'
          };
        } else {
          errorMessage = 'Error del servidor. Intenta nuevamente';
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast(errorMessage, {
        icon: '❌',
        style: toastStyle,
        duration: 5000
      });
      
      setShowErrorToast(true);
      setShowSuccessToast(false);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Función para manejar errores de validación del formulario
   * @param {Object} errors - Errores de validación
   */
  const onError = (errors) => {
    // Mostrar todos los errores de validación
    Object.entries(errors).forEach(([, error]) => {
      if (error?.message) {
        toast(error.message, {
          icon: '⚠️',
          style: {
            background: '#fee2e2',
            color: '#991b1b',
            border: '1px solid #fecaca'
          },
          duration: 4000
        });
      }
    });
  };

  /**
   * Función para cancelar y navegar de vuelta
   */
  const handleCancel = () => {
    navigate('/portafolio/proyectos');
  };

  return {
    // Estados
    showSuccessToast,
    setShowSuccessToast,
    showErrorToast,
    setShowErrorToast,
    showWarningToast,
    setShowWarningToast,
    loading,
    supervisors,
    countries,
    workTeams,
    mainAreaAreas,
    
    // Formulario
    control,
    handleSubmit,
    errors,
    getValues,
    reset,
    
    // Validaciones y opciones
    validationRules,
    sizeOptions,
    saturationOptions,
    
    // Funciones
    onSubmit,
    onError,
    handleCancel
  };
};

export default useAddProject; 