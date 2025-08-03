import React from 'react';
import { motion as MotionComponent } from 'framer-motion';
import { Button } from "../../../../components/Buttons";
import {
  CircleCheck,
  CircleX,
  PenLine,
  CircleArrowLeft,
  User,
  UserRound,
  Briefcase,
  Building2,
  Search,
  Check,
  AlertCircle,
  X
} from 'lucide-react';
import FormInput from '../../../../components/ui/FormInput';
import FormInputPassword from '../../../../components/FormInputPassword';
import FormSelect from '../../../../components/ui/FormSelect';
import '../../../../components/toast.css';
import CustomHeading from '../../../../components/Titles/TitleH1';
import { useEditEmployee } from './hooks';

const EditEmployee = () => {
  const {
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
  } = useEditEmployee();

  // Renderizado de la interfaz (idéntico al original, pero sin lógica interna)
  return (
    isLoading ? (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D6AC50]"></div>
      </div>
    ) : error ? (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg my-4">
        <p className="font-medium">Error</p>
        <p className="text-sm">{error}</p>
      </div>
    ) : (
      <div className="p-6 md:p-8 w-full">
        {/* Encabezado con botón de volver */}
        <MotionComponent.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 flex items-center justify-between"
        >
          <div className="flex items-center">
            <CustomHeading
              text="Editar Empleado"
              color="#01426A"
            />
          </div>
          <div className="flex items-center gap-4">
            {employee?.isActive ? (
              <div className="bg-[#DFF5E7] text-[#0B6B35] rounded-full py-2 px-4 flex justify-center items-center gap-2">
                <CircleCheck
                  className="-ms-1 me-2 opacity-100"
                  size={22}
                  strokeWidth={2}
                  aria-hidden="true"
                />
                <span className="text-base font-normal">Habilitado</span>
              </div>
            ) : (
              <div className="bg-[#B6B8BD] text-[#4F4F4F] rounded-full py-2 px-4 flex justify-center items-center gap-2">
                <CircleX
                  className="-ms-1 me-2 opacity-100"
                  size={22}
                  strokeWidth={2}
                  aria-hidden="true"
                />
                <span className="text-base font-normal">Inhabilitado</span>
              </div>
            )}
            <div className="text-gray-500">{employee?.cuscaId || 'N/A'}</div>
          </div>
        </MotionComponent.div>

        {/* Contenido del formulario */}
        <MotionComponent.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-xl p-6 md:p-8 shadow-sm"
        >
          <h2 className="text-lg font-medium text-[#01426A] mb-4">Empleado</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
              {/* Primera columna - Datos Personales */}
              <div>
                <FormInput
                  id="nombreCompleto"
                  label="Nombre Completo"
                  value={formData.nombreCompleto}
                  onChange={handleChange}
                  icon={User}
                />
                <FormSelect
                  id="pais"
                  label="País"
                  value={formData.pais || ''}
                  onChange={handleChange}
                  options={paisesOptions}
                  icon={Building2}
                />
              </div>

              {/* Segunda columna - Datos Laborales */}
              <div>
                <FormSelect
                  id="rol"
                  label="Rol"
                  value={formData.rol}
                  onChange={handleChange}
                  options={rolesOptions}
                  icon={Briefcase}
                />
                <FormSelect
                  id="estado"
                  label="Estado"
                  value={formData.estado}
                  onChange={handleChange}
                  options={estadosOptions}
                  icon={UserRound}
                />
              </div>
            </div>

            {/* Buscadores */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-700">Buscadores</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                {/* Jefe Inmediato */}
                <div ref={bossSearchRef} className="relative w-full">
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
                      placeholder="Buscar jefe por nombre o CuscaID..."
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
                            setFormData(prev => ({ ...prev, jefeInmediato: employee.fullName }));
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
                        onClick={() => {
                          setSelectedBoss(null);
                          setFormData(prev => ({ ...prev, jefeInmediato: '' }));
                          setSearchBoss('');
                        }}
                        className="p-2 hover:bg-blue-100 rounded-r-lg"
                      >
                        <X className="h-4 w-4 text-blue-600" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Área */}
                <div ref={areaSearchRef} className="relative w-full">
                  <label className="block text-sm font-medium mb-2" style={{ fontFamily: 'Montserrat', fontWeight: 500, color: '#8D91A0' }}>
                    Área
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
                          key={area.id}
                          onClick={() => {
                            setSelectedArea(area);
                            setFormData(prev => ({ ...prev, area: area.mainArea?.name || area.area?.name }));
                            setSearchArea(area.mainArea?.name || area.area?.name);
                            setShowAreaDropdown(false);
                          }}
                          className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100"
                        >
                          <div className="font-medium">{area.mainArea?.name || area.area?.name}</div>
                          <div className="text-xs text-gray-400">{area.mainArea?.name ? 'Área Principal' : 'Área'}: {area.area?.name}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedArea && (
                    <div className="mt-2 flex items-center bg-blue-50 rounded-lg">
                      <div className="flex-1 p-2">
                        <span className="text-sm text-blue-700">
                          Área: {selectedArea.mainArea?.name || selectedArea.area?.name}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedArea(null);
                          setFormData(prev => ({ ...prev, area: '' }));
                          setSearchArea('');
                        }}
                        className="p-2 hover:bg-blue-100 rounded-r-lg"
                      >
                        <X className="h-4 w-4 text-blue-600" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Sub Gerente */}
                <div ref={subManagerSearchRef} className="relative w-full">
                  <label className="block text-sm font-medium mb-2" style={{ fontFamily: 'Montserrat', fontWeight: 500, color: '#8D91A0' }}>
                    Sub Gerente
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
                      placeholder="Buscar subgerente por nombre o CuscaID..."
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
                            setFormData(prev => ({ ...prev, subGerente: employee.fullName }));
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
                          Sub Gerente: {selectedSubManager.fullName} ({selectedSubManager.cuscaId}) - {selectedSubManager.daylogRol}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedSubManager(null);
                          setFormData(prev => ({ ...prev, subGerente: '' }));
                          setSearchSubManager('');
                        }}
                        className="p-2 hover:bg-blue-100 rounded-r-lg"
                      >
                        <X className="h-4 w-4 text-blue-600" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Puesto */}
                <div ref={positionSearchRef} className="relative w-full">
                  <label className="block text-sm font-medium mb-2" style={{ fontFamily: 'Montserrat', fontWeight: 500, color: '#8D91A0' }}>
                    Puesto
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="searchPosition"
                      value={searchPosition}
                      onChange={(e) => {
                        setSearchPosition(e.target.value);
                        setShowPositionDropdown(!!e.target.value);
                      }}
                      onFocus={() => setShowPositionDropdown(true)}
                      placeholder="Buscar puesto..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      style={{ fontFamily: 'Montserrat' }}
                      required
                    />
                    <Search className="absolute right-3 top-3 text-gray-400" size={20} />
                  </div>

                  {showPositionDropdown && filteredPositions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredPositions.map((position) => (
                        <div
                          key={position}
                          onClick={() => {
                            setSelectedPosition(position);
                            setFormData(prev => ({ ...prev, puesto: position }));
                            setSearchPosition(position);
                            setShowPositionDropdown(false);
                          }}
                          className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100"
                        >
                          <div className="font-medium">{position}</div>
                        </div>
                      ))}
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
                        onClick={() => {
                          setSelectedPosition(null);
                          setFormData(prev => ({ ...prev, puesto: '' }));
                          setSearchPosition('');
                        }}
                        className="p-2 hover:bg-blue-100 rounded-r-lg"
                      >
                        <X className="h-4 w-4 text-blue-600" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-wrap justify-end space-x-0 space-y-3 sm:space-x-4 sm:space-y-0 pt-6">
              <Button variant="btn_secondary" onClick={() => navigate('/admin/gestionEmpleados')}>
              <CircleArrowLeft size={20} />
                Cancelar
              </Button>
              <Button variant="btn_primary" type="submit">
              <PenLine size={20} />
                Actualizar
              </Button>
            </div>
          </form>
        </MotionComponent.div>

        {/* Toast de éxito */}
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
                <p className="flex-grow">Empleado actualizado con éxito</p>
                <button onClick={() => setShowSuccessToast(false)} className="p-1 hover:bg-white/20 rounded-full">
                  <X size={16} />
                </button>
              </div>
            </MotionComponent.div>
          </div>
        )}

        {/* Toast de error */}
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
                <p className="flex-grow">Error al actualizar el empleado</p>
                <button onClick={() => setShowErrorToast(false)} className="p-1 hover:bg-white/20 rounded-full">
                  <X size={16} />
                </button>
              </div>
            </MotionComponent.div>
          </div>
        )}
      </div>
    )
  );
};

export default EditEmployee;