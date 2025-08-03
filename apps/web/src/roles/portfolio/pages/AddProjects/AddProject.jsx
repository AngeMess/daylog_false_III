import React from 'react';
import { motion as Motion } from 'framer-motion';
import { Button } from "../../../../components/Buttons";
import {
  Check,
  AlertCircle,
  AlertTriangle,
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
  Briefcase
} from 'lucide-react';
import { Controller } from 'react-hook-form';
import FormInput from '../../../../components/ui/FormInput';
import FormSelect from '../../../../components/ui/FormSelect';
import '../../../../components/Toast.css';
import DatePickerPopover from '../../../../components/DatePickerPopover/DatePickerPopover';
import CustomHeading from '../../../../components/Titles/TitleH1';
import './StyleAddProyect.css';
import { useAddProject } from './hooks';

/**
 * Componente AddProject - Página para crear nuevos proyectos
 * 
 * Este componente utiliza el hook personalizado useAddProject para manejar toda la lógica
 * de estado, validaciones y envío del formulario, manteniendo el componente enfocado
 * únicamente en la presentación y estructura de la interfaz.
 */
const AddProject = () => {
  // Usar el hook personalizado para manejar toda la lógica
  const {
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
    getValues,
    
    // Validaciones y opciones
    validationRules,
    sizeOptions,
    saturationOptions,
    
    // Funciones
    onSubmit,
    onError,
    handleCancel
  } = useAddProject();

  return (
    <div className="p-6 md:p-8 w-full min-h-screen flex flex-col">
      {/* ===== ENCABEZADO DE LA PÁGINA ===== */}
      {/* Contenedor principal con animación de entrada */}
      <Motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <CustomHeading
          text="Crear Proyecto"
          color="#01426A"
        />
      </Motion.div>

      {/* ===== CONTENIDO PRINCIPAL DEL FORMULARIO ===== */}
      {/* Contenedor del formulario con animación y estructura responsiva */}
      <Motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="form-container"
      >
        {/* Formulario principal que maneja el envío de datos */}
        <form onSubmit={handleSubmit(onSubmit, onError)} className="project-form">
          {/* Contenedor de todos los campos del formulario */}
          <div className="form-fields-container">
            {/* ===== PRIMERA FILA DE CAMPOS ===== */}
            {/* Código, Supervisor y Tamaño del proyecto */}
            <div className="form-row form-row-triple">
              <Controller
                name="code"
                control={control}
                rules={{
                  required: "El código es obligatorio",
                  maxLength: { value: 6, message: "Máximo 6 caracteres" },
                  minLength: { value: 6, message: "Debe tener 6 caracteres" }
                }}
                render={({ field, fieldState: { error } }) => (
                  <FormInput
                    id="code"
                    label="Código"
                    icon={Hash}
                    error={error?.message}
                    required
                    maxLength={6}
                    // Añade una clase para el borde rojo si hay error
                    className={error ? "border-red-500" : ""}
                    {...field}
                    onChange={e => {
                      // Bloquear más de 6 caracteres
                      if (e.target.value.length <= 6) field.onChange(e);
                    }}
                  />
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
                      placeholder="Seleccione supervisor (opcional)"
                      {...field}
                    />
                  </div>
                )}
              />

              <Controller
                name="size"
                control={control}
                rules={validationRules.size}
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
                  </div>
                )}
              />

              <Controller
                name="country"
                control={control}
                rules={validationRules.country}
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
                rules={validationRules.state}
                render={({ field, fieldState: { error } }) => (
                  <div className="field-container-z999">
                    <FormSelect
                      id="state"
                      label="Estado"
                      icon={FileText}
                      error={error?.message}
                      options={[{ value: 'Pendiente', label: 'Pendiente' }]}
                      required
                      disabled={true}
                      className="bg-gray-100 cursor-not-allowed"
                      {...field}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Los proyectos nuevos siempre inician en estado "Pendiente"
                    </p>
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
                render={({ field, fieldState: { error } }) => (
                  <div className="field-container">
                    <FormSelect
                      id="visibility"
                      label="Visibilidad"
                      icon={Eye}
                      error={error?.message}
                      options={[{ value: 'Privado', label: 'Privado' }]}
                      disabled={true}
                      className="bg-gray-100 cursor-not-allowed"
                      {...field}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Los proyectos nuevos siempre inician con visibilidad "Privado"
                    </p>
                  </div>
                )}
              />

              <Controller
                name="workTeam"
                control={control}
                rules={validationRules.workTeam}
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
                rules={validationRules.saturation}
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
                rules={validationRules.proyectName}
                render={({ field, fieldState: { error } }) => (
                  <FormInput
                    id="proyectName"
                    label="Nombre del proyecto"
                    icon={FileText}
                    error={error?.message}
                    required
                    {...field}
                  />
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
                    // Forzar la fecha como local (no UTC)
                    const [year, month, day] = value.split('-').map(Number);
                    const selected = new Date(year, month - 1, day); // Mes base 0
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    selected.setHours(0, 0, 0, 0);
                    if (selected < today) return "No puedes seleccionar una fecha pasada";
                    return true;
                  }
                }}
                render={({ field, fieldState: { error } }) => (
                  <DatePickerPopover
                    id="startDate"
                    label="Fecha inicio"
                    value={field.value}
                    onChange={field.onChange}
                    error={error?.message}
                    required
                    minDate={new Date()} // Deshabilita fechas pasadas
                  />
                )}
              />

              <Controller
                name="endDate"
                control={control}
                rules={{
                  required: "La fecha de finalización es obligatoria",
                  validate: value => {
                    const start = new Date(getValues("startDate"));
                    const end = new Date(value);
                    const minEnd = new Date(start);
                    minEnd.setDate(minEnd.getDate() + 7);
                    if (end < minEnd) return "La fecha fin debe ser al menos 7 días después de la fecha inicio";
                    return true;
                  }
                }}
                render={({ field, fieldState: { error } }) => (
                  <DatePickerPopover
                    id="endDate"
                    label="Fecha fin"
                    value={field.value}
                    onChange={field.onChange}
                    error={error?.message}
                    required
                    minDate={field.value ? new Date(new Date(field.value).setDate(new Date(field.value).getDate() + 7)) : undefined}
                  />
                )}
              />
            </div>
          </div>



          {/* ===== BOTONES DE ACCIÓN ===== */}
          {/* Contenedor de botones con diseño responsivo mejorado */}
          <div className="action-buttons-container">
            <Button 
              variant="btn_secondary" 
              type="button" 
              onClick={handleCancel}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>

            <Button 
              variant="btn_primary" 
              type="submit" 
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {loading ? (
                <>
                  <Loader size={18} className="mr-2 animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <span>Crear</span>
              )}
            </Button>
          </div>
        </form>
      </Motion.div>

      {/* ===== TOASTS DE NOTIFICACIÓN ===== */}
      {/* Toast de éxito - Se muestra cuando el proyecto se crea correctamente */}
      {showSuccessToast && (
        <div className="fixed bottom-5 right-5 z-[9999]">
          <Motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-8 rounded-xl shadow-md w-full flex-grow"
            style={{
              position: 'relative',
              maxHeight: 'calc(100vh - 200px)',
              overflowY: 'auto',
              overflowX: 'visible'
            }}
          >
            <Check size={20} />
            <p className="flex-grow ml-3">Proyecto guardado con éxito</p>
            <button onClick={() => setShowSuccessToast(false)} className="p-1 hover:bg-white/20 rounded-full">
              <X size={16} />
            </button>
          </Motion.div>
        </div>
      )}

      {/* Toast de error - Se muestra cuando ocurre un error al crear el proyecto */}
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

      {/* Toast de advertencia - Se muestra cuando el proyecto ya existe */}
      {showWarningToast && (
        <div className="fixed bottom-5 right-5 z-[9999]">
          <Motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="bg-yellow-500 text-white p-3 rounded-lg shadow-lg flex items-center min-w-[300px]"
          >
            <AlertTriangle size={20} />
            <p className="flex-grow ml-3">El proyecto ya ha sido ingresado</p>
            <button onClick={() => setShowWarningToast(false)} className="p-1 hover:bg-white/20 rounded-full">
              <X size={16} />
            </button>
          </Motion.div>
        </div>
      )}
    </div>
  );
};

export default AddProject;

