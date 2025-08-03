import React from 'react';
import { motion as Motion } from 'framer-motion';
import {
  Check,
  AlertCircle,
  X,
  User,
  Hash,
  Layers,
  Globe,
  FileText,
  Eye,
  LayoutGrid,
  Users,
  Loader,
  Briefcase,
  Save,
} from 'lucide-react';
import { Controller } from 'react-hook-form';
import FormInput from '../../../../components/ui/FormInput';
import FormSelect from '../../../../components/ui/FormSelect';
import DatePickerPopover from '../../../../components/DatePickerPopover/DatePickerPopover';
import ResourcesList from '../../../../components/ResourcesList/ResourcesList';
import FileUpload from '../../../../components/FileUpload/FileUpload';
import CustomHeading from '../../../../components/Titles/TitleH1';
import './StyleEditProject.css';
import { Button } from "../../../../components/Buttons";
import { useEditProject } from './hooks';

/**
 * Componente EditProject - Página para editar proyectos existentes
 * 
 * Este componente utiliza el hook personalizado useEditProject para manejar toda la lógica
 * de estado, validaciones, manejo de archivos y actualización del formulario, manteniendo
 * el componente enfocado únicamente en la presentación y estructura de la interfaz.
 */
const EditProject = () => {
  console.log('EditProject component loaded');

  // Usar el hook personalizado para manejar toda la lógica
  const {
  // Estados
    showSuccessToast,
    setShowSuccessToast,
    showErrorToast,
    setShowErrorToast,
    loading,
    showUploadSuccess,
    setShowUploadSuccess,
    showUploadError,
    setShowUploadError,
    uploadErrorMessage,
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
    getValues,
    
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
  } = useEditProject();

  return (
    <div className="p-6 md:p-8 w-full min-h-screen flex flex-col">
      {/* ===== ENCABEZADO DE LA PÁGINA ===== */}
      {/* Contenedor principal con animación de entrada */}
      <Motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <CustomHeading 
          text="Editar proyecto"    
          color="#01426A" 
        />
      </Motion.div>
      
      {/* ===== CONTENIDO PRINCIPAL DEL FORMULARIO ===== */}
      {/* Contenedor del formulario con animación y estructura responsiva */}
      <Motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="form-container"
      >
        {/* ===== ESTADO DE CARGA ===== */}
        {/* Muestra un spinner mientras se cargan los datos del proyecto */}
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader size={24} className="animate-spin mr-2" />
            <span>Cargando proyecto...</span>
          </div>
        ) : (
          <>
            {/* ===== FORMULARIO PRINCIPAL ===== */}
            {/* Formulario que maneja la edición de datos del proyecto */}
            <form onSubmit={handleSubmit(onSubmit, onError)} className="project-form">
            {/* Contenedor de todos los campos del formulario */}
            <div className="form-fields-container">

            {/* ===== PRIMERA FILA DE CAMPOS ===== */}
            {/* Código (bloqueado), Supervisor y Tamaño del proyecto */}
            <div className="form-row form-row-triple">
              <Controller
                name="code"
                control={control}
                rules={{
                  required: "El código es obligatorio",
                  maxLength: { value: 6, message: "Máximo 6 caracteres" }
                }}
                render={({ field, fieldState: { error } }) => (
                  <div className="field-container">
                    <FormInput
                      id="code"
                      label="Código"
                      icon={Hash}
                      error={error?.message}
                      required
                      disabled={true}
                      className="bg-gray-100 cursor-not-allowed"
                      {...field}
                    />
                  </div>
                )}
              />
              
              <Controller
                name="supervisor"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <div className="field-container">
                    <FormSelect
                      id="supervisor"
                      label="Supervisor"
                      icon={User}
                      error={error?.message}
                      options={supervisors}
                      placeholder="Seleccione supervisor"
                      {...field}
                    />
                  </div>
                )}
              />
              
              <Controller
                name="size"
                control={control}
                rules={{ required: "El tamaño es obligatorio" }}
                render={({ field, fieldState: { error } }) => (
                  <div className="field-container-z1000">
                    <FormSelect
                      id="size"
                      label="Tamaño"
                      icon={LayoutGrid}
                      error={error?.message}
                      options={sizeOptions}
                      required
                      {...field}
                    />
                  </div>
                )}
              />
            </div>
            
            {/* Espaciador visual entre filas de campos */}
            <div className="form-spacer"></div>

            {/* ===== SEGUNDA FILA DE CAMPOS ===== */}
            {/* Área madre/subárea, País y Estado del proyecto */}
            <div className="form-row form-row-triple">
              <Controller
                name="mainAreaArea"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <div className="field-container">
                    <FormSelect
                      id="mainAreaArea"
                      label="Área madre y Subárea"
                      icon={Layers}
                      error={error?.message}
                      options={mainAreaAreas}
                      placeholder="Seleccione área principal (opcional)"
                      {...field}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Este campo es opcional
                    </p>
                  </div>
                )}
              />

        
              
              <Controller
                name="country"
                control={control}
                rules={{ required: "El país es obligatorio" }}
                render={({ field, fieldState: { error } }) => (
                  <div className="field-container">
                    <FormSelect
                      id="country"
                      label="País"
                      icon={Globe}
                      error={error?.message}
                      options={countries}
                      placeholder="Seleccione país"
                      required
                      {...field}
                    />
                  </div>
                )}
              />
              
              <Controller
                name="state"
                control={control}
                rules={{ required: "El estado es obligatorio" }}
                render={({ field, fieldState: { error } }) => (
                  <div className="field-container-z999">
                    <FormSelect
                      id="state"
                      label="Estado"
                      icon={FileText}
                      error={error?.message}
                      options={stateOptions}
                      required
                      {...field}
                    />
                  </div>
                )}
              />
            </div>
            
            {/* Espaciador visual entre filas de campos */}
            <div className="form-spacer"></div>

            {/* ===== TERCERA FILA DE CAMPOS ===== */}
            {/* Visibilidad, Equipo de trabajo y Saturación del proyecto */}
            <div className="form-row form-row-triple">
              <Controller
                name="visibility"
                control={control}
                render={({ field, fieldState: { error } }) => {
                  const currentState = getValues("state");
                  
                  // Determinar si es editable y qué opciones mostrar
                  let isEditable = false;
                  
                  if (currentState === 'Finalizado' || currentState === 'Cancelado' || currentState === 'Pendiente') {
                    // Proyectos pendientes, finalizados o cancelados pueden cambiar visibilidad
                    isEditable = true;
                  } else if (['En proceso', 'En riesgo', 'Atrasado', 'Repriorizado'].includes(currentState)) {
                    // Para proyectos en desarrollo, siempre deben ser visibles (no editable)
                    isEditable = false;
                    field.value = 'Visible'; // Forzar siempre a visible
                  }
                  
                  return (
                    <div className="field-container">
                      <FormSelect
                        id="visibility"
                        label="Visibilidad"
                        icon={Eye}
                        error={error?.message}
                        options={visibilityOptions}
                        disabled={!isEditable}
                        className={!isEditable ? "bg-gray-100 cursor-not-allowed" : ""}
                        {...field}
                      />
                      {!isEditable && (
                        <p className="text-xs text-gray-500 mt-1">
                          {['En proceso', 'En riesgo', 'Atrasado', 'Repriorizado'].includes(currentState)
                            ? 'Los proyectos en desarrollo deben ser siempre visibles'
                            : 'La visibilidad solo es editable para proyectos en estado Pendiente, Finalizado o Cancelado'
                          }
                        </p>
                      )}
                    </div>
                  );
                }}
              />
              
              <Controller
                name="workTeam"
                control={control}
                rules={{ required: "El equipo de trabajo es obligatorio" }}
                render={({ field, fieldState: { error } }) => (
                  <div className="field-container">
                    <FormSelect
                      id="workTeam"
                      label="Equipo de trabajo"
                      icon={Users}
                      error={error?.message}
                      options={workTeams}
                      placeholder="Seleccione equipo"
                      required
                      {...field}
                    />
                  </div>
                )}
              />
              
              <Controller
                name="saturation"
                control={control}
                rules={{ required: "La saturación es obligatoria" }}
                render={({ field, fieldState: { error } }) => (
                  <div className="field-container-z998">
                    <FormSelect
                      id="saturation"
                      label="Saturación"
                      icon={Briefcase}
                      error={error?.message}
                      options={saturationOptions}
                      required
                      {...field}
                    />
                  </div>
                )}
              />
            </div>
            
            {/* ===== CUARTA FILA DE CAMPOS ===== */}
            {/* Nombre del proyecto (campo único que ocupa toda la fila) */}
            <div className="form-row form-row-single">
              <Controller
                name="proyectName"
                control={control}
                rules={{
                  required: "El nombre del proyecto es obligatorio",
                  maxLength: { value: 100, message: "Máximo 100 caracteres" }
                }}
                render={({ field, fieldState: { error } }) => (
                  <div className="field-container">
                    <FormInput
                      id="proyectName"
                      label="Nombre del proyecto"
                      icon={FileText}
                      error={error?.message}
                      required
                      {...field}
                    />
                  </div>
                )}
              />
            </div>
            
            {/* ===== QUINTA FILA DE CAMPOS ===== */}
            {/* Fechas de inicio y fin del proyecto */}
            <div className="form-row form-row-double">
            <Controller
  name="startDate"
  control={control}
  rules={{
    required: "La fecha de inicio es obligatoria",
    validate: value => {
      if (!value) return "La fecha es obligatoria";
      
      // Si estamos editando un proyecto existente, verificar si la fecha ha cambiado
      if (projectData.startDate) {
        const originalStartDate = new Date(projectData.startDate);
        const newStartDate = new Date(value);
        
        // Normalizar fechas para comparación (solo fecha, sin hora)
        originalStartDate.setHours(0, 0, 0, 0);
        newStartDate.setHours(0, 0, 0, 0);
        
        // Si la fecha no ha cambiado, no validar
        if (originalStartDate.getTime() === newStartDate.getTime()) {
          return true;
        }
      }
      
      // Solo validar fechas pasadas para proyectos nuevos o cuando la fecha ha cambiado
      const [year, month, day] = value.split('-').map(Number);
      const selected = new Date(year, month - 1, day);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      selected.setHours(0, 0, 0, 0);
      if (selected < today) return "No puedes seleccionar una fecha pasada";
      return true;
    }
  }}
  render={({ field: { onChange, value }, fieldState: { error } }) => (
    <div className="field-container">
      <DatePickerPopover
        id="startDate"
        label="Fecha inicio"
        value={value}
        onChange={onChange}
        error={error?.message}
        required
        disabled={!!projectData.startDate} // Bloquear si ya existe fecha de inicio
      />
      {projectData.startDate && (
        <p className="text-xs text-gray-500 mt-1">
          Fecha de inicio bloqueada (proyecto ya creado)
        </p>
      )}
    </div>
  )}
/>
              
<Controller
  name="endDate"
  control={control}
  rules={{
    required: "La fecha de finalización es obligatoria",
    validate: value => {
      if (!value) return "La fecha es obligatoria";
      
      // Si estamos editando un proyecto existente, verificar si las fechas han cambiado
      if (projectData.finishDate) {
        const originalEndDate = new Date(projectData.finishDate);
        const newEndDate = new Date(value);
        
        // Normalizar fechas para comparación (solo fecha, sin hora)
        originalEndDate.setHours(0, 0, 0, 0);
        newEndDate.setHours(0, 0, 0, 0);
        
        // Si la fecha no ha cambiado, no validar
        if (originalEndDate.getTime() === newEndDate.getTime()) {
          return true;
        }
      }
      
      // Solo validar si las fechas han cambiado o es un proyecto nuevo
      const startValue = getValues("startDate");
      if (!startValue) return "Primero selecciona la fecha de inicio";
      
      const [sy, sm, sd] = startValue.split('-').map(Number);
      const [ey, em, ed] = value.split('-').map(Number);
      const start = new Date(sy, sm - 1, sd);
      const end = new Date(ey, em - 1, ed);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      
      // Validación: la fecha fin debe ser al menos 7 días después de la fecha inicio
      const minEnd = new Date(start);
      minEnd.setDate(minEnd.getDate() + 7);
      if (end < minEnd) return "La fecha fin debe ser al menos 7 días después de la fecha inicio";
      
      return true;
    }
  }}
  render={({ field: { onChange, value }, fieldState: { error } }) => (
    <div className="field-container">
      <DatePickerPopover
        id="endDate"
        label="Fecha fin"
        value={value}
        onChange={onChange}
        error={error?.message}
        required
        minDate={projectData.startDate ? new Date(projectData.startDate) : undefined}
      />
    </div>
  )}
/>
            </div>
            
            {/* ===== SECCIÓN DE RECURSOS DEL PROYECTO ===== */}
            {/* Contenedor principal para la gestión de archivos y recursos */}
            <div className="mt-8 border-t pt-6">
              <h3 className="text-xl font-semibold text-[#01426A] mb-4">Recursos del proyecto</h3>
              
              {/* ===== LISTA DE RECURSOS EXISTENTES ===== */}
              {/* Muestra los archivos ya subidos al proyecto con opción de eliminación */}
              <div className="mb-6">
                <ResourcesList 
                  projectId={id}
                  projectName={projectData.proyectName || 'Proyecto'}
                  deletable={true}
                  pendingDeleteIds={resourcesToDelete}
                  onToggleDelete={handleToggleDeleteResource}
                />
              </div>
              
              {/* ===== COMPONENTE PARA SUBIR NUEVOS ARCHIVOS ===== */}
              {/* Sección para agregar nuevos recursos al proyecto */}
              <div className="mt-8 mb-4">
                <h4 className="text-lg font-medium text-[#01426A] mb-2">Subir nuevos recursos</h4>
                <p className="text-gray-500 mb-4">Selecciona o arrastra los archivos que quieras añadir a este proyecto</p>
                
                {/* ===== ZONA DE SUBIDA DE ARCHIVOS ===== */}
                {/* Área drag & drop para seleccionar archivos */}
                <div className="border border-dashed border-gray-300 rounded-lg p-4 mb-4">
                  <FileUpload onChange={handleFileChange} maxFiles={5} />
                </div>
                
                {/* ===== BOTONES DE ACCIÓN ===== */}
                {/* Contenedor de botones usando el componente Button unificado */}
                <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 mt-8">
                  <Button
                    type="button"
                    variant="btn_secondary"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="btn_primary"
                    disabled={loading || !hasChanges}
                  >
                    {loading ? (
                      <><Loader size={18} className="mr-2 animate-spin" />Guardando...</>
                    ) : !hasChanges ? (
                      <span>Sin cambios</span>
                    ) : (
                      <><Save size={18} className="mr-2" />Guardar Cambios</>
                    )}
                  </Button>
                </div>
              </div>
            </div>
            </div> {/* Fin form-fields-container */}
          </form>
          
          {/* ===== TOASTS DE NOTIFICACIÓN ===== */}
          {/* Toast de éxito - Se muestra cuando el proyecto se actualiza correctamente */}
          {showSuccessToast && (
            <div className="fixed bottom-5 right-5 z-[9999]">
              <Motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="bg-green-500 text-white p-3 rounded-lg shadow-lg flex items-center min-w-[300px]"
              >
                <Check size={20} />
                <p className="flex-grow ml-3">Proyecto actualizado con éxito</p>
                <button onClick={() => setShowSuccessToast(false)} className="p-1 hover:bg-white/20 rounded-full">
                  <X size={16} />
                </button>
              </Motion.div>
            </div>
          )}
          {/* Toast de error - Se muestra cuando ocurre un error al actualizar el proyecto */}
          {showErrorToast && (
            <div className="fixed bottom-5 right-5 z-[9999]">
              <Motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="bg-red-500 text-white p-3 rounded-lg shadow-lg flex items-center min-w-[300px]"
              >
                <AlertCircle size={20} />
                <p className="flex-grow ml-3">Error al guardar el proyecto</p>
                <button onClick={() => setShowErrorToast(false)} className="p-1 hover:bg-white/20 rounded-full">
                  <X size={16} />
                </button>
              </Motion.div>
            </div>
          )}
          {/* Toast de éxito de subida - Se muestra cuando los archivos se suben correctamente */}
          {showUploadSuccess && (
            <div className="fixed bottom-5 right-5 z-[9999]">
              <Motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="bg-green-500 text-white p-3 rounded-lg shadow-lg flex items-center min-w-[300px]"
              >
                <Check size={20} />
                <p className="flex-grow ml-3">Archivos subidos correctamente</p>
                <button onClick={() => setShowUploadSuccess(false)} className="p-1 hover:bg-white/20 rounded-full">
                  <X size={16} />
                </button>
              </Motion.div>
            </div>
          )}
          {/* Toast de error de subida - Se muestra cuando hay problemas al subir archivos */}
          {showUploadError && (
            <div className="fixed bottom-5 right-5 z-[9999]">
              <Motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="bg-red-500 text-white p-3 rounded-lg shadow-lg flex items-center min-w-[300px]"
              >
                <AlertCircle size={20} />
                <p className="flex-grow ml-3">{uploadErrorMessage || 'Error al subir los archivos'}</p>
                <button onClick={() => setShowUploadError(false)} className="p-1 hover:bg-white/20 rounded-full">
                  <X size={16} />
                </button>
              </Motion.div>
            </div>
          )}
        </>
      )}
    </Motion.div>
  </div>
);
};

export default EditProject;
