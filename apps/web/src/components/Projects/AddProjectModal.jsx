import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { X, User, Calendar, Hash, Layers, Globe, FileText, Eye, LayoutGrid, Users, Loader, AlertCircle } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import FormInput from '../../../components/FormInput';
import FormSelect from '../../../components/FormSelect';
import Toast from '../Toast';
import useProyectsApi from '../../hooks/useProjectsApi';
import useSupervisorsApi from '../../roles/admin/hooks/useSupervisorsApi';

// Asegurarse de que Modal esté configurado para accesibilidad
Modal.setAppElement('#root');

const AddProjectModal = ({ isOpen, onClose, onSave }) => {
  const { createProyect } = useProyectsApi();
  const { supervisors, loading: loadingSupervisors } = useSupervisorsApi();
  
  // Estado para los toasts
  const [toasts, setToasts] = useState([]);
  
  // Estado para controlar la carga
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Configuración de react-hook-form con validaciones
  const { 
    control, 
    handleSubmit: hookFormSubmit, 
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      code: '',
      supervisor: '',
      area: '',
      country: '',
      status: 'Pendiente', // Valor por defecto
      visible: true, // Valor por defecto
      eliminated: false, // Valor por defecto
      size: '',
      workTeam: '',
      proyectName: '',
      startDate: '',
      finishDate: ''
    }
  });
  
  // Función para añadir un toast
  const addToast = (message, type) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    return id;
  };
  
  // Función para eliminar un toast
  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };
  
  // Opciones para los selectores con IDs reales
  const areaOptions = [
    { value: '64c00c97382e8d86a5bddc16', label: 'Tecnología - Gestión de proyectos' },
    { value: '64c00c97382e8d86a5bddc17', label: 'Tecnología - Desarrollo de Software' },
    { value: '64c00c97382e8d86a5bddc18', label: 'Tecnología - Analista' }
  ];
  
  const countryOptions = [
    { value: '64c010b5382e8d86a5bddc19', label: 'Guatemala' },
    { value: '64c010b5382e8d86a5bddc1a', label: 'Honduras' },
    { value: '64c010b5382e8d86a5bddc1b', label: 'El Salvador' }
  ];
  
  const statusOptions = [
    { value: 'Pendiente', label: 'Pendiente' },
    { value: 'En proceso', label: 'En proceso' },
    { value: 'Finalizado', label: 'Finalizado' },
    { value: 'Cancelado', label: 'Cancelado' },
    { value: 'En riesgo', label: 'En riesgo' },
    { value: 'Atrasado', label: 'Atrasado' },
    { value: 'Repriorizado', label: 'Repriorizado' }
  ];


  
  const visibilityOptions = [
    { value: true, label: 'Habilitado' },
    { value: false, label: 'Deshabilitado' }
  ];
  
  const sizeOptions = [
    { value: 'Grande', label: 'Grande' },
    { value: 'Mediano', label: 'Mediano' },
    { value: 'Pequeño', label: 'Pequeño' }
  ];
  
  // Formatear la lista de supervisores para el selector
  const supervisorOptions = supervisors.map(supervisor => ({
    value: supervisor._id,
    label: `${supervisor.name} ${supervisor.lastName || ''}`
  }));
  
  const workTeamOptions = [
    { value: '64c00c97382e8d86a5bddc1c', label: 'Guanacos' },
    { value: '64c00c97382e8d86a5bddc1d', label: 'Legenda' },
    { value: '64c00c97382e8d86a5bddc1e', label: 'Dungeonids' }
  ];
  
  // Manejador para enviar el formulario con react-hook-form
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      
      // Transformar los datos al formato esperado por la API
      const proyectData = {
        code: data.code,
        proyectName: data.proyectName,
        startDate: data.startDate,
        finishDate: data.finishDate,
        size: data.size,
        state: data.status,
        type: data.area, // ID del área
        workTeam: data.workTeam, // ID del equipo de trabajo
        country: data.country, // ID del país
        visible: data.visible,
        eliminated: data.eliminated,
        saturation: 0, // Valor inicial
        supervisor: data.supervisor // ID del supervisor
      };
      
      // Crear el proyecto en el backend usando nuestro hook
      const result = await createProyect(proyectData);
      
      if (result) {
        // Notificar éxito
        addToast('Proyecto creado con éxito', 'success');
        
        // Ejecutar callback onSave si existe
        if (onSave) {
          onSave(proyectData);
        }
        
        // Cerrar el modal después de un breve retraso
        setTimeout(() => {
          reset(); // Reset de react-hook-form
          onClose();
        }, 1500);
      } else {
        // Si result es null, hubo un error en la API
        addToast('Error al crear el proyecto', 'error');
      }
    } catch (error) {
      console.error('Error al crear proyecto:', error);
      addToast(error.message || 'Error al crear el proyecto', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Cerrar modal y limpiar datos
  const handleClose = () => {
    reset(); // Reset de react-hook-form
    onClose();
  };
  
  // Resetear el formulario cuando se cierra el modal
  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);
  
  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={handleClose}
        className="modal-content-project"
        overlayClassName="modal-overlay-project"
        style={{
          content: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            borderRadius: '12px',
            border: 'none',
            padding: '30px',
            width: '90%',
            maxWidth: '800px',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)',
            backgroundColor: 'white'
          },
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(8px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }
        }}
        contentLabel="Gestión de proyecto"
      >
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-[#01426A]">Gestión de proyecto</h2>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-800 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          
          <form onSubmit={hookFormSubmit(onSubmit)} className="space-y-4">
            {/* Primera fila */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="relative">
                <Controller
                  name="code"
                  control={control}
                  rules={{ 
                    required: 'El código es obligatorio',
                    maxLength: {
                      value: 100,
                      message: 'El código no puede exceder los 100 caracteres'
                    }
                  }}
                  render={({ field }) => (
                    <FormInput
                      id="code"
                      label="Código"
                      value={field.value}
                      onChange={field.onChange}
                      icon={Hash}
                      required
                    />
                  )}
                />
                {errors.code && (
                  <div className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle size={12} className="mr-1" />
                    {errors.code.message}
                  </div>
                )}
              </div>
              
              <div className="relative">
                <Controller
                  name="supervisor"
                  control={control}
                  rules={{ required: 'El supervisor es obligatorio' }}
                  render={({ field }) => (
                    <FormSelect
                      id="supervisor"
                      label="Nombre del supervisor"
                      value={field.value}
                      onChange={field.onChange}
                      options={supervisorOptions}
                      icon={User}
                      disabled={loadingSupervisors}
                      required
                    />
                  )}
                />
                {errors.supervisor && (
                  <div className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle size={12} className="mr-1" />
                    {errors.supervisor.message}
                  </div>
                )}
                {loadingSupervisors && (
                  <div className="text-blue-500 text-xs mt-1 flex items-center">
                    <Loader size={12} className="mr-1 animate-spin" />
                    Cargando supervisores...
                  </div>
                )}
              </div>
              
              <div className="relative">
                <Controller
                  name="size"
                  control={control}
                  rules={{ required: 'El tamaño es obligatorio' }}
                  render={({ field }) => (
                    <FormSelect
                      id="size"
                      label="Tamaño"
                      value={field.value}
                      onChange={field.onChange}
                      options={sizeOptions}
                      icon={LayoutGrid}
                      required
                    />
                  )}
                />
                {errors.size && (
                  <div className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle size={12} className="mr-1" />
                    {errors.size.message}
                  </div>
                )}
              </div>
            </div>
            
            {/* Segunda fila */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="relative">
                <Controller
                  name="area"
                  control={control}
                  rules={{ required: 'El área es obligatoria' }}
                  render={({ field }) => (
                    <FormSelect
                      id="area"
                      label="Área madre y Subárea"
                      value={field.value}
                      onChange={field.onChange}
                      options={areaOptions}
                      icon={Layers}
                      required
                    />
                  )}
                />
                {errors.area && (
                  <div className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle size={12} className="mr-1" />
                    {errors.area.message}
                  </div>
                )}
              </div>
              
              <div className="relative">
                <Controller
                  name="country"
                  control={control}
                  rules={{ required: 'El país es obligatorio' }}
                  render={({ field }) => (
                    <FormSelect
                      id="country"
                      label="País"
                      value={field.value}
                      onChange={field.onChange}
                      options={countryOptions}
                      icon={Globe}
                      required
                    />
                  )}
                />
                {errors.country && (
                  <div className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle size={12} className="mr-1" />
                    {errors.country.message}
                  </div>
                )}
              </div>
              
              <div className="relative">
                <Controller
                  name="status"
                  control={control}
                  rules={{ required: 'El estado es obligatorio' }}
                  render={({ field }) => (
                    <FormSelect
                      id="status"
                      label="Estado"
                      value={field.value}
                      onChange={field.onChange}
                      options={statusOptions}
                      icon={FileText}
                      required
                    />
                  )}
                />
                {errors.status && (
                  <div className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle size={12} className="mr-1" />
                    {errors.status.message}
                  </div>
                )}
              </div>
            </div>
            
            {/* Tercera fila */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="relative">
                <Controller
                  name="visible"
                  control={control}
                  render={({ field }) => (
                    <FormSelect
                      id="visible"
                      label="Visibilidad"
                      value={field.value}
                      onChange={field.onChange}
                      options={visibilityOptions}
                      icon={Eye}
                    />
                  )}
                />
              </div>
              
              <div className="relative">
                <Controller
                  name="workTeam"
                  control={control}
                  rules={{ required: 'El equipo de trabajo es obligatorio' }}
                  render={({ field }) => (
                    <FormSelect
                      id="workTeam"
                      label="Equipo de trabajo"
                      value={field.value}
                      onChange={field.onChange}
                      options={workTeamOptions}
                      icon={Users}
                      required
                    />
                  )}
                />
                {errors.workTeam && (
                  <div className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle size={12} className="mr-1" />
                    {errors.workTeam.message}
                  </div>
                )}
              </div>
            </div>
            
            {/* Cuarta fila */}
            <div className="grid grid-cols-1 gap-6">
              <div className="relative">
                <Controller
                  name="proyectName"
                  control={control}
                  rules={{ 
                    required: 'El nombre del proyecto es obligatorio',
                    maxLength: {
                      value: 100,
                      message: 'El nombre del proyecto no puede exceder los 100 caracteres'
                    }
                  }}
                  render={({ field }) => (
                    <FormInput
                      id="proyectName"
                      label="Nombre del proyecto"
                      value={field.value}
                      onChange={field.onChange}
                      icon={FileText}
                      required
                    />
                  )}
                />
                {errors.proyectName && (
                  <div className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle size={12} className="mr-1" />
                    {errors.proyectName.message}
                  </div>
                )}
              </div>
            </div>
            
            {/* Quinta fila */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <Controller
                  name="startDate"
                  control={control}
                  rules={{ required: 'La fecha de inicio es obligatoria' }}
                  render={({ field }) => (
                    <FormInput
                      id="startDate"
                      label="Fecha inicio"
                      value={field.value}
                      onChange={field.onChange}
                      icon={Calendar}
                      type="date"
                      required
                    />
                  )}
                />
                {errors.startDate && (
                  <div className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle size={12} className="mr-1" />
                    {errors.startDate.message}
                  </div>
                )}
              </div>
              
              <div className="relative">
                <Controller
                  name="finishDate"
                  control={control}
                  render={({ field }) => (
                    <FormInput
                      id="finishDate"
                      label="Fecha fin"
                      value={field.value}
                      onChange={field.onChange}
                      icon={Calendar}
                      type="date"
                    />
                  )}
                />
              </div>
            </div>
            
            {/* Botones de acción */}
            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={handleClose}
                className="py-2 px-6 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors flex items-center justify-center"
              >
                <span className="font-medium">Cancelar</span>
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`py-2 px-6 font-medium rounded-md transition-all duration-300 border border-transparent shadow-sm hover:shadow-md flex items-center justify-center space-x-2 ${isSubmitting ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-[#FFC600] text-[#01426A] hover:bg-[#01426A] hover:text-[#FFC600]'}`}
              >
                {isSubmitting && <Loader className="animate-spin" size={18} />}
                <span>{isSubmitting ? 'Creando...' : 'Crear'}</span>
              </button>
            </div>
          </form>
        </div>
      </Modal>
      
      {/* Mostrar toasts */}
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </>
  );
};

export default AddProjectModal;
