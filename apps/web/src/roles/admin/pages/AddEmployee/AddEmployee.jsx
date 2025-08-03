/**
 * Componente para agregar un nuevo empleado al sistema
 * Permite crear un nuevo registro de empleado con toda su información personal y laboral
 * Incluye validación de formularios, búsqueda de referencias y manejo de estados de carga
 */
import React from 'react';
import { motion as MotionComponent } from 'framer-motion'; // Para animaciones
import { Controller } from 'react-hook-form'; // Para manejo de formularios
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
// Importación de iconos de Lucide
import {
  Earth, BookKey, Mails, UserPlus2, CircleArrowLeft, User, Check, AlertCircle, X, Search, Loader2
} from 'lucide-react';
// Componentes de UI personalizados
import FormInput from '../../../../components/ui/FormInput';
import FormInputPasswordWithGenerate from '../../../../components/FormInputPasswordWithGenerate';
import FormSelect from '../../../../components/ui/FormSelect';
import '../../../../components/toast.css'; // Estilos para notificaciones
import CustomHeading from '../../../../components/Titles/TitleH1'; // Componente de título personalizado
import { Button } from "../../../../components/Buttons"; // Componente de botón personalizado
import { useAddEmployee } from './hooks';

/**
 * Componente AddEmployee - Página para crear nuevos empleados
 * 
 * Este componente utiliza el hook personalizado useAddEmployee para manejar toda la lógica
 * de estado, validaciones y envío del formulario, manteniendo el componente enfocado
 * únicamente en la presentación y estructura de la interfaz.
 */
const AddEmployee = () => {
  // Navegación
  const navigate = useNavigate();
  
  const {
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
  } = useAddEmployee();

  // Renderizado de la interfaz (idéntico al original, pero sin lógica interna)
  return (
    <div className="p-6 md:p-8 w-full">
      <MotionComponent.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 flex items-center"
      >
        <div>
          <div className="flex justify-between items-center mb-2">
            <CustomHeading 
                   text="Crear un empleado"    
                   color="#01426A" 
                />
          </div>
          <div className="flex justify-between items-center ">
            <h3 className="text-l font-light" style={{ color: '#000' }}>
              Crea un empleado y asignale un rol dentro de la app
            </h3>
          </div>
        </div>
      </MotionComponent.div>

      <MotionComponent.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-xl p-6 md:p-8 shadow-sm"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-700">Información Básica</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                <Controller
                  name="cuscaId"
                  control={control}
                  rules={{ required: 'El CuscaID es obligatorio' }}
                  render={({ field, fieldState: { error } }) => (
                    <FormInput
                      id="cuscaId"
                      label="CuscaID"
                      value={field.value}
                      onChange={field.onChange}
                      icon={User}
                      error={error?.message}
                      maxLength={6}
                      required
                    />
                  )}
                />

                <Controller
                  name="fullName"
                  control={control}
                  rules={{ required: 'El nombre completo es obligatorio' }}
                  render={({ field, fieldState: { error } }) => (
                    <FormInput
                      id="fullName"
                      label="Nombre Completo"
                      value={field.value}
                      onChange={field.onChange}
                      icon={User}
                      error={error?.message}
                      required
                    />
                  )}
                />

                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: 'El email es obligatorio',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email inválido'
                    }
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <FormInput
                      id="email"
                      label="Email"
                      type="email"
                      value={field.value}
                      onChange={field.onChange}
                      icon={Mails}
                      error={error?.message}
                      required
                    />
                  )}
                />

                {/* Función para generar una contraseña segura */}
                {useMemo(() => {
                  return (
                    <Controller
                      name="password"
                      control={control}
                      rules={{
                        required: 'La contraseña es obligatoria',
                        minLength: {
                          value: 8,
                          message: 'La contraseña debe tener al menos 8 caracteres'
                        },
                        validate: {
                          hasUppercase: value => /[A-Z]/.test(value) || 'Debe contener al menos una mayúscula',
                          hasLowercase: value => /[a-z]/.test(value) || 'Debe contener al menos una minúscula',
                          hasNumber: value => /[0-9]/.test(value) || 'Debe contener al menos un número',
                          hasSpecial: value => /[!@#$%^&*()_+~`|}{[\]\\:;?><,./\-=]/.test(value) || 'Debe contener al menos un símbolo especial'
                        }
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <FormInputPasswordWithGenerate
                          id="password"
                          label="Contraseña"
                          value={field.value || ''}
                          onChange={field.onChange}
                          icon={BookKey}
                          error={error?.message}
                          required
                          readOnly
                          generatePassword={generateStrongPassword}
                        />
                      )}
                    />
                  );
                }, [control])}

                <Controller
                  name="daylogRol"
                  control={control}
                  rules={{ required: 'El rol es obligatorio' }}
                  render={({ field, fieldState: { error } }) => (
                    <FormSelect
                      id="daylogRol"
                      label="Rol"
                      value={field.value}
                      onChange={field.onChange}
                      options={[
                        { value: 'Empleado', label: 'Empleado' },
                        { value: 'Supervisor', label: 'Supervisor' },
                        { value: 'Portafolio', label: 'Portafolio' },
                        { value: 'Admin', label: 'Admin' }
                      ]}
                      icon={BookKey}
                      error={error?.message}
                      required
                    />
                  )}
                />
                <Controller
                  name="country"
                  control={control}
                  rules={{ required: 'El país es obligatorio' }}
                  render={({ field, fieldState: { error } }) => (
                    <FormSelect
                      id="country"
                      label="País"
                      value={field.value}
                      onChange={field.onChange}
                      options={[
                        { value: 'Guatemala', label: 'Guatemala' },
                        { value: 'El Salvador', label: 'El Salvador' },
                        { value: 'Honduras', label: 'Honduras' }
                      ]}
                      icon={Earth}
                      error={error?.message}
                      required
                    />
                  )}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-700">Jerarquía y Áreas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="relative" ref={bossSearchRef}>
                  <label className="block text-sm font-medium mb-2" style={{ fontFamily: 'Montserrat', fontWeight: 500, color: '#8D91A0' }}>
                    Jefe Inmediato
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="searchBoss"
                      value={searchBoss}
                      onChange={(e) => {
                        setSearchBoss(e.target.value);
                        setShowBossDropdown(true);
                      }}
                      onFocus={() => setShowBossDropdown(true)}
                      onBlur={() => setTimeout(() => setShowBossDropdown(false), 200)}
                      placeholder="Buscar jefe..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      style={{ fontFamily: 'Montserrat' }}
                      required
                    />
                    <Search className="absolute right-3 top-3 text-gray-400" size={20} />
                  </div>

                  {showBossDropdown && filteredBosses.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredBosses.map((employee) => (
                        <div
                          key={employee._id}
                          onClick={() => {
                            setSelectedBoss(employee);
                            setValue('inmediateBoss', employee._id);
                            setSearchBoss(employee.fullName);
                            setShowBossDropdown(false);
                          }}
                          className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100"
                        >
                          <div className="font-medium">{employee.fullName}</div>
                          <div className="text-sm text-gray-500">ID: {employee.cuscaId}</div>
                          <div className="text-xs text-gray-400">{employee.position}</div>
                          <div className="text-xs text-blue-600 font-medium">Rol: {employee.daylogRol}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedBoss && (
                    <div className="mt-2 flex items-center bg-blue-50 rounded-lg">
                      <div className="flex-1 p-2">
                        <span className="text-sm text-blue-700">
                          Jefe Inmediato: {selectedBoss.fullName} ({selectedBoss.cuscaId}) - {selectedBoss.daylogRol}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedBoss(null);
                          setValue('inmediateBoss', '');
                          setSearchBoss('');
                        }}
                        className="p-2 hover:bg-blue-100 rounded-r-lg"
                      >
                        <X className="h-4 w-4 text-blue-600" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="relative w-full" ref={subManagerSearchRef}>
                  <label className="block text-sm font-medium mb-2" style={{ fontFamily: 'Montserrat', fontWeight: 500, color: '#8D91A0' }}>
                    Subgerente
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="searchSubManager"
                      value={searchSubManager}
                      onChange={(e) => {
                        setSearchSubManager(e.target.value);
                        setShowSubManagerDropdown(true);
                      }}
                      onFocus={() => setShowSubManagerDropdown(true)}
                      onBlur={() => setTimeout(() => setShowSubManagerDropdown(false), 200)}
                      placeholder="Buscar subgerente..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      style={{ fontFamily: 'Montserrat' }}
                      required
                    />
                    <Search className="absolute right-3 top-3 text-gray-400" size={20} />
                  </div>

                  {showSubManagerDropdown && filteredSubManagers.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredSubManagers.map((employee) => (
                        <div
                          key={employee._id}
                          onClick={() => {
                            setSelectedSubManager(employee);
                            setValue('subManager', employee._id);
                            setSearchSubManager(employee.fullName);
                            setShowSubManagerDropdown(false);
                          }}
                          className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100"
                        >
                          <div className="font-medium">{employee.fullName}</div>
                          <div className="text-sm text-gray-500">ID: {employee.cuscaId}</div>
                          <div className="text-xs text-gray-400">{employee.position}</div>
                          <div className="text-xs text-blue-600 font-medium">Rol: {employee.daylogRol}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedSubManager && (
                    <div className="mt-2 flex items-center bg-blue-50 rounded-lg">
                      <div className="flex-1 p-2">
                        <span className="text-sm text-blue-700">
                          Subgerente: {selectedSubManager.fullName} ({selectedSubManager.cuscaId}) - {selectedSubManager.daylogRol}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedSubManager(null);
                          setValue('subManager', '');
                          setSearchSubManager('');
                        }}
                        className="p-2 hover:bg-blue-100 rounded-r-lg"
                      >
                        <X className="h-4 w-4 text-blue-600" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="relative w-full" ref={areaSearchRef}>
                  <label className="block text-sm font-medium mb-2" style={{ fontFamily: 'Montserrat', fontWeight: 500, color: '#8D91A0' }}>
                    Área Madre y Subárea
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="searchArea"
                      value={searchArea}
                      onChange={(e) => {
                        setSearchArea(e.target.value);
                        setShowAreaDropdown(true);
                      }}
                      onFocus={() => setShowAreaDropdown(true)}
                      onBlur={() => setTimeout(() => setShowAreaDropdown(false), 200)}
                      placeholder="Buscar área..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      style={{ fontFamily: 'Montserrat' }}
                      required
                    />
                    <Search className="absolute right-3 top-3 text-gray-400" size={20} />
                  </div>

                  {showAreaDropdown && filteredAreas.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredAreas.map((area) => (
                        <div
                          key={area._id}
                          onClick={() => {
                            setSelectedArea(area);
                            setValue('mainAreaArea', area._id);
                            setSearchArea(`${area.mainArea?.name || ''} - ${area.area?.name || ''}`);
                            setShowAreaDropdown(false);
                          }}
                          className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 search-item"
                        >
                          <div className="font-medium">{area.mainArea?.name || ''}</div>
                          <div className="text-sm text-gray-500">Subárea: {area.area?.name || ''}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedArea && (
                    <div className="mt-2 p-2 bg-blue-50 rounded-lg selected-message">
                      <span>
                        Área: {selectedArea.mainArea?.name || ''} - {selectedArea.area?.name || ''}
                      </span>
                    </div>
                  )}
                </div>

                <div className="relative w-full" ref={positionSearchRef}>
                  <label className="block text-sm font-medium mb-2" style={{ fontFamily: 'Montserrat', fontWeight: 500, color: '#8D91A0' }}>
                    Puesto
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="searchPosition"
                      value={selectedPosition || searchPosition}
                      onChange={(e) => {
                        const value = e.target.value;
                        setSearchPosition(value);
                        setShowPositionDropdown(!!value);
                      }}
                      onFocus={() => setShowPositionDropdown(true)}
                      placeholder="Buscar puesto..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      style={{ fontFamily: 'Montserrat' }}
                      required
                    />
                    {isSearching ? (
                      <Loader2 className="absolute right-3 top-3 h-5 w-5 animate-spin text-gray-400" />
                    ) : (
                      <Search className="absolute right-3 top-3 text-gray-400" size={20} />
                    )}
                  </div>

                  {showPositionDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredPositions.length > 0 ? (
                        filteredPositions.map((position, index) => (
                          <div
                            key={index}
                            onClick={() => {
                              setSelectedPosition(position);
                              setValue('position', position);
                              setSearchPosition('');
                              setShowPositionDropdown(false);
                            }}
                            className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100"
                          >
                            <div className="font-medium">{position}</div>
                          </div>
                        ))
                      ) : searchPosition ? (
                        <div className="p-3 text-gray-500 italic">
                          No se encontraron coincidencias
                        </div>
                      ) : null}
                    </div>
                  )}

                  {selectedPosition && (
                    <div className="mt-2 flex items-center bg-blue-50 rounded-lg">
                      <div className="flex-1 p-2">
                        <span className="text-sm text-blue-700">
                          Puesto: {selectedPosition}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPosition(null);
                          setValue('position', '');
                          setSearchPosition('');
                        }}
                        className="p-2 hover:bg-blue-100 rounded-r-lg"
                      >
                        <X className="h-4 w-4 text-blue-600" />
                      </button>
                    </div>
                  )}
                  {errors.position && (
                    <p className="mt-1 text-sm text-red-600">{errors.position.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-end space-x-0 space-y-3 sm:space-x-4 sm:space-y-0 pt-6">
            <Button 
              variant="btn_secondary" 
              type="button"
              onClick={() => navigate('/admin/gestionEmpleados')}
              disabled={isSubmitting}
            >
              <CircleArrowLeft size={20} className="mr-2" />
              Cancelar
            </Button>
            <Button 
              variant="btn_primary" 
              type="submit"
              disabled={isSubmitting || !isValid}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <UserPlus2 size={20} className="mr-2" />
                  Crear Empleado
                </>
              )}
            </Button>
          </div>
        </form>
      </MotionComponent.div>

      {showSuccessToast && (
        <div className="fixed bottom-5 right-5 z-[9999]">
          <MotionComponent.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="bg-green-500 text-white p-3 rounded-lg shadow-lg flex items-center min-w-[300px]"
          >
            <div className="flex items-center space-x-3">
              <Check size={20} />
              <p className="flex-grow">Empleado guardado con éxito</p>
              <button onClick={() => setShowSuccessToast(false)} className="p-1 hover:bg-white/20 rounded-full">
                <X size={16} />
              </button>
            </div>
          </MotionComponent.div>
        </div>
      )}

      {showErrorToast && (
        <div className="fixed bottom-5 right-5 z-[9999]">
          <MotionComponent.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="bg-red-500 text-white p-3 rounded-lg shadow-lg flex items-center min-w-[300px]"
          >
            <div className="flex items-center space-x-3">
              <AlertCircle size={20} />
              <p className="flex-grow">{registerError || 'Error al guardar el empleado'}</p>
              <button onClick={() => setShowErrorToast(false)} className="p-1 hover:bg-white/20 rounded-full">
                <X size={16} />
              </button>
            </div>
          </MotionComponent.div>
        </div>
      )}

      {showWarningToast && (
        <div className="fixed bottom-5 right-5 z-[9999]">
          <MotionComponent.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="bg-yellow-500 text-white p-3 rounded-lg shadow-lg flex items-center min-w-[300px]"
          >
            <div className="flex items-center space-x-3">
              <AlertCircle size={20} />
              <p className="flex-grow">Por favor completa todos los campos requeridos correctamente</p>
              <button onClick={() => setShowWarningToast(false)} className="p-1 hover:bg-white/20 rounded-full">
                <X size={16} />
              </button>
            </div>
          </MotionComponent.div>
        </div>
      )}
    </div>
  );
};

export default AddEmployee;

