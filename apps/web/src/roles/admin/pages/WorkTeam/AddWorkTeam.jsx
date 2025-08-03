import React from 'react';
import { motion as MotionComponent } from 'framer-motion';
import { Users, CircleArrowLeft, AlertCircle, AlertTriangle, Check, X, Search, Building2 } from 'lucide-react';
import FormInput from '../../../../components/ui/FormInput';
import FormSelect from '../../../../components/ui/FormSelect';
import '../../../../components/Toast.css';
import { Button } from '../../../../components/Buttons';
import WorkTeam from './WorkTeam';
import CustomHeading from '../../../../components/Titles/TitleH1';
import useAddWorkTeamPage from './hooks/useAddWorkTeamPage';

/**
 * Página para crear un nuevo grupo de trabajo.
 * Utiliza el hook useAddWorkTeamPage para manejar la lógica de UI y estados.
 */
const AgregarGrupo = ({ onCancel }) => {
  // Hook personalizado para toda la lógica de la página de agregar equipo
  const {
    loading,
    error,
    formData,
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
    filteredEmployees,
    filteredAreas,
    selectedEmployees,
    selectedSupervisor,
    selectedArea,
    showSuccessToast,
    setShowSuccessToast,
    showErrorToast,
    setShowErrorToast,
    showWarningToast,
    setShowWarningToast,
    customWarningMessage,
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
  } = useAddWorkTeamPage(onCancel);

  if (showWorkTeam) {
    return <WorkTeam onCancel={() => setShowWorkTeam(false)} />;
  }

  return (
    <div className="w-full p-4 sm:p-6 flex flex-col items-center">
      <CustomHeading
        text="Crear nuevo grupo de trabajo"
        color="#01426A"
      />
      <br />
      <form onSubmit={handleSubmit} className="space-y-10 w-full max-w-lg">
        <div className="space-y-8 w-full">
          <FormInput
            id="name"
            label="Nombre del equipo"
            value={formData.name}
            onChange={handleChange}
            icon={Users}
            required
            labelStyle={{ fontFamily: 'Montserrat', fontWeight: 500, color: '#8D91A0' }}
            className="w-full mb-6"
          />
          <FormSelect
            id="teamType"
            label="Tipo de equipo de trabajo"
            value={formData.teamType}
            onChange={handleChange}
            options={tipoEquipoOptions}
            icon={Users}
            labelStyle={{ fontFamily: 'Montserrat', fontWeight: 500, color: '#8D91A0' }}
            className="w-full mb-6"
          />
          <div className="relative">
            <label className="block text-sm font-medium mb-2" style={{ fontFamily: 'Montserrat', fontWeight: 500, color: '#8D91A0' }}>
              Área *
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar área por nombre..."
                value={areaSearch}
                onChange={(e) => setAreaSearch(e.target.value)}
                onFocus={() => setShowAreaDropdown(true)}
                onBlur={() => setTimeout(() => setShowAreaDropdown(false), 200)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ fontFamily: 'Montserrat' }}
              />
              <Search className="absolute right-3 top-3 text-gray-400" size={20} />
            </div>
            {showAreaDropdown && filteredAreas.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredAreas.map((area) => (
                  <div
                    key={area._id}
                    onClick={() => handleSelectArea(area)}
                    className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100"
                  >
                    <div className="font-medium" style={{ fontFamily: 'Montserrat', color: '#01426A' }}>{area.mainArea?.name || 'Área Principal'}</div>
                    <div className="text-sm text-gray-500" style={{ fontFamily: 'Montserrat' }}>{area.area?.name || 'Subárea'}</div>
                  </div>
                ))}
              </div>
            )}
            {selectedArea && (
              <div className="mt-2 p-2 bg-blue-50 rounded-lg flex items-center">
                <Building2 className="text-blue-700 mr-2" size={16} />
                <span className="text-sm text-blue-700" style={{ fontFamily: 'Montserrat' }}>
                  Área seleccionada: {selectedArea.mainArea?.name || 'Área Principal'} - {selectedArea.area?.name || 'Subárea'}
                </span>
              </div>
            )}
          </div>
          <div className="relative">
            <label className="block text-sm font-medium mb-2" style={{ fontFamily: 'Montserrat', fontWeight: 500, color: '#8D91A0' }}>
              Supervisor * (Solo empleados con rol Supervisor)
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar supervisor por nombre o CuscaID..."
                value={supervisorSearch}
                onChange={(e) => setSupervisorSearch(e.target.value)}
                onFocus={() => setShowSupervisorDropdown(true)}
                onBlur={() => setTimeout(() => setShowSupervisorDropdown(false), 200)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ fontFamily: 'Montserrat' }}
              />
              <Search className="absolute right-3 top-3 text-gray-400" size={20} />
            </div>
            {showSupervisorDropdown && filteredSupervisors.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredSupervisors.map((employee) => (
                  <div
                    key={employee._id}
                    onClick={() => handleSelectSupervisor(employee)}
                    className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100"
                  >
                    <div className="font-medium" style={{ fontFamily: 'Montserrat' }}>{employee.fullName}</div>
                    <div className="text-sm text-gray-500" style={{ fontFamily: 'Montserrat' }}>ID: {employee.cuscaId}</div>
                    <div className="text-xs text-gray-400" style={{ fontFamily: 'Montserrat' }}>{employee.position}</div>
                    <div className="text-xs text-blue-600 font-medium" style={{ fontFamily: 'Montserrat' }}>Rol: {employee.daylogRol}</div>
                  </div>
                ))}
              </div>
            )}
            {selectedSupervisor && (
              <div className="mt-2 p-2 bg-blue-50 rounded-lg">
                <span className="text-sm text-blue-700" style={{ fontFamily: 'Montserrat' }}>
                  Supervisor: {selectedSupervisor.fullName} ({selectedSupervisor.cuscaId}) - {selectedSupervisor.daylogRol}
                </span>
              </div>
            )}
          </div>
          <div className="relative">
            <label className="block text-sm font-medium mb-2" style={{ fontFamily: 'Montserrat', fontWeight: 500, color: '#8D91A0' }}>
              Empleados del equipo (Empleados, Supervisores y Portafolio)
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar empleados por nombre o CuscaID..."
                value={employeeSearch}
                onChange={(e) => setEmployeeSearch(e.target.value)}
                onFocus={() => setShowEmployeeDropdown(true)}
                onBlur={() => setTimeout(() => setShowEmployeeDropdown(false), 200)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ fontFamily: 'Montserrat' }}
              />
              <Search className="absolute right-3 top-3 text-gray-400" size={20} />
            </div>
            {showEmployeeDropdown && filteredEmployees.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredEmployees
                  .filter(emp => !selectedEmployees.find(selected => selected._id === emp._id))
                  .map((employee) => (
                    <div
                      key={employee._id}
                      onClick={() => handleSelectEmployee(employee)}
                      className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100"
                    >
                      <div className="font-medium" style={{ fontFamily: 'Montserrat' }}>{employee.fullName}</div>
                      <div className="text-sm text-gray-500" style={{ fontFamily: 'Montserrat' }}>ID: {employee.cuscaId}</div>
                      <div className="text-xs text-gray-400" style={{ fontFamily: 'Montserrat' }}>{employee.position}</div>
                      <div className={`text-xs font-medium ${getRoleColor(employee.daylogRol)}`} style={{ fontFamily: 'Montserrat' }}>
                        Rol: {employee.daylogRol}
                      </div>
                    </div>
                  ))}
              </div>
            )}
            {selectedEmployees.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="font-medium text-gray-700" style={{ fontFamily: 'Montserrat' }}>Empleados seleccionados:</h4>
                {selectedEmployees.map((employee) => (
                  <div key={employee._id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-medium" style={{ fontFamily: 'Montserrat' }}>{employee.fullName}</span>
                      <span className="text-sm text-gray-500 ml-2" style={{ fontFamily: 'Montserrat' }}>({employee.cuscaId})</span>
                      <div className="text-xs text-gray-400" style={{ fontFamily: 'Montserrat' }}>{employee.position}</div>
                      <div className={`text-xs font-medium ${getRoleColor(employee.daylogRol)}`} style={{ fontFamily: 'Montserrat' }}>
                        Rol: {employee.daylogRol}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveEmployee(employee._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center">
              <Check className="text-green-600 mr-2" size={16} />
              <span className="text-sm text-green-700 font-medium" style={{ fontFamily: 'Montserrat' }}>
                El equipo se creará automáticamente en estado activo
              </span>
            </div>
          </div>
        </div>
        {/* Botones */}
        <div className="flex flex-col sm:flex-row sm:justify-center items-center gap-4 pt-6">
          <Button
            variant="btn_secondary"
            type="button"
            disabled={loading}
            onClick={handleCancel}
            className="w-full sm:flex-1 lg:w-auto" 
          >
            <CircleArrowLeft size={18} className="mr-2" />
            Cancelar
          </Button>
          <Button
            variant="btn_primary"
            type="submit"
            disabled={loading}
            className="w-full sm:flex-1 lg:w-auto" 
          >
            {loading ? (
              <span style={{ fontFamily: 'Montserrat' }}>Creando...</span>
            ) : (
              <span style={{ fontFamily: 'Montserrat' }}>Crear equipo</span>
            )}
          </Button>
        </div>
      </form>
      {showSuccessToast && (
        <div className="fixed bottom-5 right-5 z-[9999]">
          <MotionComponent.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="bg-green-500 text-white p-3 rounded-lg shadow-lg flex items-center min-w-[300px]"
          >
            <div className="flex items-center space-x-3">
              <Check size={18} />
              <p className="flex-grow" style={{ fontFamily: 'Montserrat', fontWeight: 500 }}>Grupo de trabajo creado con éxito</p>
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
              <AlertCircle size={18} />
              <p className="flex-grow" style={{ fontFamily: 'Montserrat', fontWeight: 500 }}>
                {error || 'Error al crear el grupo de trabajo'}
              </p>
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
              <AlertTriangle size={18} />
              <p className="flex-grow" style={{ fontFamily: 'Montserrat', fontWeight: 500 }}>
                {customWarningMessage || 'El grupo de trabajo ya existe'}
              </p>
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

export default AgregarGrupo;