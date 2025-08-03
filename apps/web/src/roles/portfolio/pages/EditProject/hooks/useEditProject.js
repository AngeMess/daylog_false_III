import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import useProyectsApi from '../../../../../hooks/useProjectsApi';
import { useSessionTimeoutContext } from '../../../../../context/SessionTimeoutContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { sizeOptions, saturationOptions, stateOptions } from '../../../../../utils/OptionSelectProject';

/**
 * Hook personalizado para manejar la lógica de edición de proyectos
 * Encapsula todo el estado, efectos y funciones relacionadas con el formulario de edición
 */
const useEditProject = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getProyectById } = useProyectsApi();
  const { disableTimeout, enableTimeout } = useSessionTimeoutContext();

  // Estados para toasts y loading
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Estados para archivos y recursos
  const [files, setFiles] = useState([]);
  const [showUploadSuccess, setShowUploadSuccess] = useState(false);
  const [showUploadError, setShowUploadError] = useState(false);
  const [uploadErrorMessage, setUploadErrorMessage] = useState('');
  const [resourcesToDelete, setResourcesToDelete] = useState([]);
  
  // Estados para datos del proyecto y formulario
  const [projectData, setProjectData] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  
  // Estados para datos de formulario
  const [supervisors, setSupervisors] = useState([]);
  const [countries, setCountries] = useState([]);
  const [workTeams, setWorkTeams] = useState([]);
  const [mainAreaAreas, setMainAreaAreas] = useState([]);

  // Opciones de visibilidad
  const visibilityOptions = [
    { value: 'Visible', label: 'Visible' },
    { value: 'Privado', label: 'Privado' }
  ];

  // Configuración del formulario con react-hook-form
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    watch,
    setValue
  } = useForm({
    defaultValues: {
      code: '',
      proyectName: '',
      supervisor: '',
      mainAreaArea: '',
      country: '',
      state: 'Pendiente',
      visibility: 'Publico',
      size: 'Mediano',
      workTeam: '',
      startDate: '',
      endDate: '',
      saturation: 'Normal'
    }
  });

  // Observar cambios en el estado para actualizar la visibilidad
  const currentState = useWatch({
    control,
    name: "state",
  });

  // Efecto para manejar cambios en el estado y actualizar la visibilidad
  useEffect(() => {
    if (currentState === 'Finalizado' || currentState === 'Cancelado') {
      // No cambiar automáticamente la visibilidad, solo habilitar el select
      console.log('Estado cambiado a Finalizado o Cancelado, habilitando selector de visibilidad');
    } else if (currentState === 'Pendiente') {
      // Para proyectos en estado Pendiente, mantener "Privado" por defecto
      const currentVisibility = getValues("visibility");
      if (currentVisibility !== 'Visible') {
        setValue("visibility", "Privado");
        console.log('Estado cambiado a Pendiente, estableciendo visibilidad a "Privado"');
      }
    } else if (['En proceso', 'En riesgo', 'Atrasado', 'Repriorizado'].includes(currentState)) {
      // Para proyectos en desarrollo, siempre deben ser visibles
      setValue("visibility", "Visible");
      console.log(`Estado cambiado a ${currentState}, estableciendo visibilidad a "Visible"`);
    }
  }, [currentState, setValue, getValues]);

  // Deshabilitar timeouts al montar el componente
  useEffect(() => {
    console.log('⏸ EditProject: Deshabilitando detección de inactividad');
    disableTimeout();
    return () => {
      console.log('▶️EditProject: Re-habilitando detección de inactividad al desmontar');
      enableTimeout();
    };
  }, [disableTimeout, enableTimeout]);

  // Detectar cambios en el formulario
  useEffect(() => {
    const subscription = watch((value, { type }) => {
      if (type === 'change') {
        // Comparar con los datos originales del proyecto
        const hasFormChanges = Object.keys(value).some(key => {
          if (!projectData[key]) return false;
          return value[key] !== projectData[key];
        });
        // Detectar cambios en archivos o recursos a eliminar
        setHasChanges(
          hasFormChanges || files.length > 0 || resourcesToDelete.length > 0
        );
      }
    });
    // También observar cambios en archivos y recursos a eliminar
    setHasChanges(
      files.length > 0 || resourcesToDelete.length > 0
    );
    return () => subscription.unsubscribe();
  }, [watch, projectData, files.length, resourcesToDelete.length]);

  // Cargar datos iniciales
  useEffect(() => {
    console.log('📡 Iniciando carga de datos para EditProject - ID:', id);
    const loadInitialData = async () => {
      try {
        // Asegurarnos de que la detección de timeout esté deshabilitada durante toda la carga
        try {
          console.log('⏸Deshabilitando timeout durante la carga inicial');
          disableTimeout();
        } catch (timeoutError) {
          console.error(' Error al deshabilitar timeout durante carga inicial:', timeoutError);
        }
        
        setLoading(true);
        console.log(' Obteniendo datos del proyecto con ID:', id);
        
        // Cargar datos del proyecto con try-catch específico
        let proyect;
        try {
          proyect = await getProyectById(id);
          console.log('Proyecto obtenido:', proyect ? 'Sí' : 'No');
          console.log('Datos del proyecto:', JSON.stringify(proyect || {}));
          
          if (!proyect) {
            throw new Error('Proyecto no encontrado');
          }
        } catch (projectError) {
          console.error('❌ Error al obtener el proyecto:', projectError);
          console.error('Detalles:', projectError.response?.data || projectError.message);
          throw projectError; // Re-lanzamos para que se maneje en el try/catch principal
        }
        
        // Guardar datos del proyecto en el estado
        console.log('💾 Guardando datos del proyecto en el estado');
        setProjectData(proyect);
        
        // Cargar datos para selects con try-catch específico
     // Reemplaza la sección desde la línea ~175 hasta ~220 aproximadamente

// Cargar datos para selects con try-catch específico
let selectData = [];
try {
  console.log('📡 Cargando datos para los desplegables...');
  selectData = await Promise.all([
    axios.get('http://localhost:3000/api/employee?rol=Supervisor'),
    axios.get('http://localhost:3000/api/country'),
    axios.get('http://localhost:3000/api/workteams'),
    axios.get('http://localhost:3000/api/mainAreaArea?populate=mainArea,area')
  ]);
  console.log('✅ Datos para desplegables obtenidos correctamente');
} catch (selectsError) {
  console.error('❌ Error al cargar datos para selectores:', selectsError);
  console.error('Detalles:', selectsError.response?.data || selectsError.message);
  // No lanzamos error aquí para permitir continuar con los datos que ya tenemos
}

// Procesar datos de selects solo si se cargaron correctamente
// Supervisores
if (selectData[0] && selectData[0].data && Array.isArray(selectData[0].data)) {
  console.log('📝 Procesando datos de supervisores:', selectData[0].data.length);
  setSupervisors(selectData[0].data.map(s => ({
    value: s._id,
    label: s.fullName
  })));
} else {
  console.warn('⚠️ No se encontraron supervisores o la estructura no es la esperada');
  console.log('Estructura recibida para supervisores:', selectData[0]);
  setSupervisors([]);
}

// Países
if (selectData[1] && selectData[1].data && Array.isArray(selectData[1].data)) {
  console.log('📝 Procesando datos de países:', selectData[1].data.length);
  setCountries(selectData[1].data.map(c => ({
    value: c._id,
    label: c.name
  })));
} else {
  console.warn('⚠️ No se encontraron países o la estructura no es la esperada');
  console.log('Estructura recibida para países:', selectData[1]);
  setCountries([]);
}

// Equipos de trabajo
if (selectData[2] && selectData[2].data && Array.isArray(selectData[2].data)) {
  console.log('📝 Procesando datos de equipos:', selectData[2].data.length);
  setWorkTeams(selectData[2].data.map(w => ({
    value: w._id,
    label: w.name
  })));
} else {
  console.warn('⚠️ No se encontraron equipos de trabajo o la estructura no es la esperada');
  console.log('Estructura recibida para equipos:', selectData[2]);
  setWorkTeams([]);
}

// Procesar datos de áreas principales y subáreas con IDs correctos
if (selectData[3] && selectData[3].data && Array.isArray(selectData[3].data)) {
  console.log('📝 Procesando datos de áreas principales y subáreas:', selectData[3].data.length);
  setMainAreaAreas(selectData[3].data.map(item => ({
    // Guardamos el ID real para enviarlo al backend
    value: item._id,
    // Pero mostramos el nombre combinado para mejor UX
    label: `${item.mainArea?.name || ''} - ${item.area?.name || ''}`.trim()
  })));
} else {
  console.warn('⚠️ No se encontraron áreas principales y subáreas o la estructura no es la esperada');
  console.log('Estructura recibida para áreas:', selectData[3]);
  setMainAreaAreas([]); // Aseguramos que no haya datos previos
}
 
        // Configurar valores iniciales del formulario
        console.log('📝 Configurando valores iniciales del formulario con los datos del proyecto');
        try {
          // Usamos el ID para el valor del mainAreaArea, no el texto combinado
          const mainAreaAreaId = proyect.mainAreaArea?._id || '';
          
          console.log('ID del MainAreaArea para el formulario:', mainAreaAreaId);
          
          const formInitialValues = {
            code: proyect.code || '',
            proyectName: proyect.proyectName || '',
            supervisor: proyect.supervisor?._id || '',
            // Usamos el ID de mainAreaArea para que coincida con 'value' en el select
            mainAreaArea: mainAreaAreaId,
            country: proyect.country?._id || '',
            state: proyect.state || 'Pendiente',
            visibility: proyect.visible === true ? 'Visible' : 'Privado',
            size: proyect.size || 'Mediano',
            workTeam: proyect.workTeam?._id || '',
            startDate: proyect.startDate ? proyect.startDate.split('T')[0] : '',
            endDate: proyect.finishDate ? proyect.finishDate.split('T')[0] : '',
            saturation: proyect.saturation || 'Normal'
          };
          
          console.log('Valores iniciales del formulario:', JSON.stringify(formInitialValues));
          
          reset(formInitialValues);
          console.log('✅ Formulario inicializado correctamente');
        } catch (formError) {
          console.error('❌ Error al inicializar formulario:', formError);
          // No lanzamos error para permitir que el usuario edite los datos manualmente si es necesario
        }
        
      } catch (error) {
        console.error('❌❌ ERROR GENERAL en loadInitialData:', error);
        console.error('Tipo de error:', error.name);
        console.error('Mensaje:', error.message);
        console.error('Stack:', error.stack);
      } finally {
        setLoading(false);
        console.log('✅ Carga inicial de datos completada');
      }
    };

    loadInitialData();
  }, [id, getProyectById, reset, disableTimeout]);

  /**
   * Función para manejar cambios en la selección de archivos
   */
  const handleFileChange = (newFiles) => {
    console.log('📂 Archivos seleccionados:', newFiles);
    setFiles(newFiles);
  };

  /**
   * Función para marcar/desmarcar recurso para eliminación
   */
  const handleToggleDeleteResource = (resourceId) => {
    setResourcesToDelete((prev) =>
      prev.includes(resourceId) ? prev.filter((id) => id !== resourceId) : [...prev, resourceId]
    );
  };

  /**
   * Función para manejar errores de validación del formulario
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
   * Función integrada para manejar la actualización del proyecto y subida de archivos
   */
  const onSubmit = async (data) => {
    console.log('🔄 INICIO onSubmit - Datos recibidos del formulario:', data);
    
    // Evitar envío redundante si ya está en proceso
    if (loading) {
      console.log('⚠️ Envío ignorado: ya hay una solicitud en proceso');
      return;
    }
    
    // Validación de cambios - Comparar con datos originales
    const hasChanges = Object.keys(data).some(key => {
      const original = projectData[key] ?? '';
      return data[key] !== original;
    });
  
    if (!hasChanges) {
      toast('No has realizado ningún cambio aún.', { 
        icon: '⚠️', 
        style: { background: '#fffbe6', color: '#b26a00' } 
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Deshabilitar el timeout de sesión durante esta operación
      console.log('⏸️ EditProject: Deshabilitando detección de inactividad para operación crítica');
      try {
        disableTimeout();
        console.log('✅ Timeout deshabilitado correctamente');
      } catch (timeoutDisableError) {
        console.error('❌ Error al deshabilitar timeout:', timeoutDisableError);
      }
      
      // Formatear datos para enviar
      const proyectData = {
        code: data.code,
        proyectName: data.proyectName,
        startDate: data.startDate,
        finishDate: data.endDate,
        size: data.size,
        state: data.state,
        workTeam: data.workTeam,
        country: data.country,
        supervisor: data.supervisor || null, // Permitir que supervisor sea null
        mainAreaArea: data.mainAreaArea || null, // Permitir que mainAreaArea sea null
        saturation: data.saturation,
        visibility: data.visibility,
        // Asegurarnos de que la propiedad visible se establezca correctamente
        // Visible: true, Privado: false, En espera: undefined (para mantener comportamiento anterior)
        visible: data.visibility === 'Visible' ? true : (data.visibility === 'Privado' ? false : null)
      };

      console.log('Datos formateados para enviar:', JSON.stringify(proyectData));
      console.log('Valor de visibilidad seleccionado:', data.visibility);
      console.log('Valor de visible calculado:', proyectData.visible);
      
      // Llamada directa a la API sin depender del hook
      const API_URL = 'http://localhost:3000/api/proyect';
      console.log('Enviando PUT a:', `${API_URL}/${id}`);
      
      // Primero actualizamos los datos del proyecto
      let response;
      try {
        console.log('⏱️ Iniciando llamada axios PUT...');
        response = await axios({
          method: 'PUT',
          url: `${API_URL}/${id}`,
          data: proyectData,
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000 // 10 segundos timeout
        });
        console.log('✅ Llamada axios completada correctamente');
      } catch (axiosError) {
        console.error('❌ Error en llamada axios:', axiosError);
        console.error('Detalles:', axiosError.response?.data || axiosError.message);
        console.error('URL intentada:', `${API_URL}/${id}`);
        throw axiosError; // Re-lanzamos para que lo capture el try/catch principal
      }
      
      // Después de actualizar el proyecto, subimos los archivos si hay alguno
      let uploadResults = [];
      if (files.length > 0) {
        console.log('📂 Subiendo archivos al proyecto actualizado...');
        
        try {
          // Creamos un único FormData con todos los archivos
          const formData = new FormData();
          
          // Agregamos todos los archivos al mismo campo 'url' (ahora Multer lo maneja como array)
          files.forEach(file => {
            formData.append('url', file);
            console.log(`Añadiendo archivo al FormData: ${file.name}, tamaño: ${(file.size / (1024 * 1024)).toFixed(2)} MB`);
          });
          
          // Agregamos el ID del proyecto solo una vez
          formData.append('proyect', id);
          formData.append('name', 'Múltiples archivos'); // Nombre genérico, el servidor usará los nombres originales
          
          // Mostramos el contenido del FormData para depuración
          console.log('FormData contenidos:', [...formData.entries()].map(entry => 
            `${entry[0]}: ${entry[1] instanceof File ? entry[1].name : entry[1]}`
          ));
          
          // Declaramos las variables para los resultados fuera del scope del try/catch
          let successfulUploads = [];
          let failedUploads = [];
          
          // Hacemos una única solicitud con todos los archivos
          try {
            const fileResponse = await axios.post('http://localhost:3000/api/resources', formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              },
              timeout: 60000 // Aumentamos el timeout para múltiples archivos
            });
            
            console.log('✅ Archivos subidos con éxito:', fileResponse.data);
            
            // Creamos un array de resultados exitosos para mantener compatibilidad con el resto del código
            uploadResults = files.map(file => ({
              success: true,
              data: fileResponse.data,
              fileName: file.name
            }));
            
            // Todos son exitosos en este caso
            successfulUploads = uploadResults;
            failedUploads = [];
          } catch (uploadError) {
            console.error('❌ Error al subir archivos:', uploadError);
            console.error('Código de estado:', uploadError.response?.status);
            console.error('Detalles del error:', uploadError.response?.data || uploadError.message);
            
            // Creamos un array de resultados fallidos
            uploadResults = files.map(file => ({
              success: false,
              fileName: file.name,
              errorMessage: uploadError.response?.data?.message || uploadError.message,
              statusCode: uploadError.response?.status || 'Desconocido'
            }));
            
            // Todos fallaron en este caso ya que fue una sola solicitud
            successfulUploads = [];
            failedUploads = uploadResults;
          }

          if (successfulUploads.length > 0) {
            console.log('✅ Archivos subidos con éxito:', successfulUploads);
            setShowUploadSuccess(true);
            
            if (successfulUploads.length === files.length) {
              setFiles([]); // Limpiamos la lista solo si todos fueron exitosos
            }
          }
          
          if (failedUploads.length > 0) {
            console.warn('⚠️ Algunos archivos no se pudieron subir correctamente:', failedUploads);
            setShowUploadError(true);
            
            // Crear un mensaje detallado de error
            let errorSummary;
            if (failedUploads.length === files.length) {
              errorSummary = 'Ningún archivo pudo ser subido';
            } else {
              errorSummary = `${failedUploads.length} de ${files.length} archivos fallaron`;
            }
            
            // Si todos son errores 500, probablemente hay un problema en el servidor
            const allServerErrors = failedUploads.every(file => file.statusCode === 500);
            let errorMessage;
            
            if (allServerErrors) {
              errorMessage = `Error en el servidor al procesar los archivos. ${errorSummary}.`;
            } else {
              errorMessage = `Error al subir archivos: ${errorSummary}.\nRevise el tamaño y formato de los archivos.`;
            }
            
            setUploadErrorMessage(errorMessage);
          }
        } catch (uploadError) {
          console.error('❌❌ ERROR GENERAL en la subida de archivos:', uploadError);
          setShowUploadError(true);
          setUploadErrorMessage('Error inesperado durante la subida de archivos');
        }
      }
      
      // Si hay recursos marcados para eliminar, procesarlos
      if (resourcesToDelete.length > 0) {
        try {
          await Promise.all(
            resourcesToDelete.map((resId) =>
              axios.delete(`http://localhost:3000/api/resources/${resId}`)
            )
          );
          console.log('🗑️ Recursos eliminados correctamente:', resourcesToDelete.length);
          setResourcesToDelete([]);
        } catch(deleteErr){
          console.error('Error al eliminar recursos:', deleteErr);
          // No detenemos el flujo principal, pero se puede mostrar toast si deseas
        }
      }
      
      // Verificar la respuesta del proyecto y mostrar el toast correspondiente
      if (response && response.status >= 200 && response.status < 300) {
        console.log('Actualización exitosa. Datos de respuesta:', response.data);
        setShowSuccessToast(true);
        setShowErrorToast(false);
        
        // Solo redireccionamos automáticamente si no hubo errores en la subida de archivos
        // o si no se seleccionaron archivos
        const hasFileUploadErrors = files.length > 0 && uploadResults.some(result => !result.success);
        
        if (!hasFileUploadErrors) {
          console.log('⏱️ Configurando redirección después de 2.5 segundos');
          setTimeout(() => {
            try {
              console.log('🔄 Ejecutando redirección programada');
              // Re-habilitar la detección de inactividad antes de redirigir
              console.log('▶️ EditProject: Re-habilitando detección de inactividad antes de redirigir');
              try {
                enableTimeout();
                console.log('✅ Timeout habilitado correctamente');
              } catch (timeoutEnableError) {
                console.error('❌ Error al re-habilitar timeout:', timeoutEnableError);
              }
              
              // Usamos SOLO navigate() de React Router para mantener el estado
              // y evitar problemas con la sesión
              console.log('📍 Redirigiendo con navigate() de React Router');
              navigate('/portafolio/proyectos');
            } catch (e) {
              console.error('❌ Error al ejecutar redirección:', e);
              // Si falla navigate, como último recurso intentamos otra aproximación
              // pero esto no debería ser necesario normalmente
              console.log('⚠️ Intentando redirección alternativa');
              window.location.replace('/portafolio/proyectos');
            }
          }, 2500);
        } else {
          console.log('No se redirige automáticamente porque hubo errores en la subida de archivos');
          console.log('El usuario puede intentar subir los archivos nuevamente o navegar manualmente');
          // Re-habilitar timeout aunque no se redirija
          try {
            enableTimeout();
            console.log('✅ Timeout habilitado correctamente');
          } catch (timeoutEnableError) {
            console.error('❌ Error al re-habilitar timeout:', timeoutEnableError);
          }
        }
      } else {
        console.error('La respuesta no indica éxito:', response);
        setShowErrorToast(true);
        setShowSuccessToast(false);
        
        // Re-habilitar timeout en caso de error
        try {
          enableTimeout();
          console.log('✅ Timeout habilitado en caso de error');
        } catch (timeoutError) {
          console.error('❌ Error al re-habilitar timeout:', timeoutError);
        }
      }
    } catch (error) {
      console.error('❌❌ ERROR AL ACTUALIZAR EL PROYECTO:', error);
      console.error('Tipo de error:', error.name);
      console.error('Mensaje:', error.message);
      console.error('Stack:', error.stack);
      console.error('Respuesta del servidor:', error.response?.data);
      console.error('Estado HTTP:', error.response?.status);
      setShowErrorToast(true);
      setShowSuccessToast(false);
      
      // Asegurarnos de que el timeout se reestablezca incluso en caso de error
      try {
        console.log('▶️ Reactivando timeout después de error');
        enableTimeout();
      } catch (finalError) {
        console.error('Error final al reactivar timeout:', finalError);
      }
    } finally {
      setLoading(false);
      console.log('===== FIN DE ACTUALIZACIÓN DE PROYECTO =====');
    }
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
    loading,
    files,
    showUploadSuccess,
    setShowUploadSuccess,
    showUploadError,
    setShowUploadError,
    uploadErrorMessage,
    setUploadErrorMessage,
    projectData,
    resourcesToDelete,
    hasChanges,
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
    watch,
    setValue,
    
    // Opciones
    visibilityOptions,
    sizeOptions,
    saturationOptions,
    stateOptions,
    
    // Funciones
    onSubmit,
    onError,
    handleFileChange,
    handleToggleDeleteResource,
    handleCancel,
    id
  };
};

export default useEditProject; 