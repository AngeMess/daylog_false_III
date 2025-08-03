import React from "react";
import CustomHeading from "../../../../components/Titles/TitleH1";
import { Search, X, Users, Tag, ListFilter, Building2 } from "lucide-react"; // Import necessary icons

export default function EditTeamCard({
  equipo,
  editData,
  handleInputChange,
  tipoEquipoOptions,
  areaOptions,
  supervisorSearch,
  setSupervisorSearch,
  showSupervisorDropdown,
  setShowSupervisorDropdown,
  filteredSupervisors,
  handleSelectSupervisor,
  selectedSupervisor,
  employeeSearch,
  setEmployeeSearch,
  showEmployeeDropdown,
  setShowEmployeeDropdown,
  filteredEmployees,
  handleSelectEmployee,
  selectedEmployees,
  handleRemoveEmployee,
  getRoleColor,
  // Destructure the FormInput and FormSelect components passed as props
  FormInput,
  FormSelect,
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border">
      <CustomHeading text="Editando equipo" color="#01426A" />

    <br />
    <br />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Nombre del equipo */}
        <FormInput
          id="name"
          label="Nombre del equipo"
          value={editData.name}
          onChange={handleInputChange}
          icon={Users} // Example icon for team name
          required
        />

        {/* Código (solo lectura) */}
        <FormInput
          id="code"
          label="Código"
          value={equipo.code}
          readOnly
          disabled
          icon={Tag} // Example icon for code
        />

        {/* Tipo de equipo */}
        <FormSelect
          id="teamType"
          label="Tipo de equipo"
          value={editData.teamType}
          onChange={handleInputChange}
          options={tipoEquipoOptions}
          icon={ListFilter} // Example icon for team type
          required
        />

        {/* Área */}
        <FormSelect
          id="mainAreaArea"
          label="Área"
          value={editData.mainAreaArea}
          onChange={handleInputChange}
          options={areaOptions}
          icon={Building2} // Example icon for area
          required
        />
      </div>

      
      {/* Supervisor - SEGUNDA PANTALLA */}
      <div className="relative mt-4">
        {" "}
        {/* Added margin top for spacing */}
        <label className="block text-sm font-medium mb-2 text-[#8D91A0]">
          Supervisor * (Solo empleados con rol Supervisor)
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar supervisor por nombre o CuscaID..."
            value={supervisorSearch}
            onChange={(e) => setSupervisorSearch(e.target.value)}
            onFocus={() => setShowSupervisorDropdown(true)}
            onBlur={() =>
              setTimeout(() => setShowSupervisorDropdown(false), 200)
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Search
            className="absolute right-3 top-3 text-gray-400"
            size={20}
          />
        </div>

        {showSupervisorDropdown && filteredSupervisors.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {filteredSupervisors.map((employee) => (
              <div
                key={employee._id}
                onClick={() => handleSelectSupervisor(employee)}
                className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100"
              >
                <div className="font-medium">{employee.fullName}</div>
                <div className="text-sm text-gray-500">
                  ID: {employee.cuscaId}
                </div>
                <div className="text-xs text-gray-400">
                  {employee.position}
                </div>
                <div className="text-xs text-blue-600 font-medium">
                  Rol: {employee.daylogRol}
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedSupervisor && (
          <div className="mt-2 p-2 bg-blue-50 rounded-lg">
            <span className="text-sm text-blue-700">
              Supervisor: {selectedSupervisor.fullName} (
              {selectedSupervisor.cuscaId}) - {selectedSupervisor.daylogRol}
            </span>
          </div>
        )}
      </div>

      {/* Empleados */}
      <div className="relative mt-4">
        {" "}
        {/* Added margin top for spacing */}
        <label className="block text-sm font-medium mb-2 text-[#8D91A0]">
          Empleados del equipo (Empleados, Supervisores y Portafolio)
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar empleados por nombre o CuscaID..."
            value={employeeSearch}
            onChange={(e) => setEmployeeSearch(e.target.value)}
            onFocus={() => setShowEmployeeDropdown(true)}
            onBlur={() =>
              setTimeout(() => setShowEmployeeDropdown(false), 200)
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Search
            className="absolute right-3 top-3 text-gray-400"
            size={20}
          />
        </div>

        {showEmployeeDropdown && filteredEmployees.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {filteredEmployees
              .filter(
                (emp) =>
                  !selectedEmployees.find(
                    (selected) => selected._id === emp._id
                  )
              )
              .map((employee) => (
                <div
                  key={employee._id}
                  onClick={() => handleSelectEmployee(employee)}
                  className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100"
                >
                  <div className="font-medium">{employee.fullName}</div>
                  <div className="text-sm text-gray-500">
                    ID: {employee.cuscaId}
                  </div>
                  <div className="text-xs text-gray-400">
                    {employee.position}
                  </div>
                  <div
                    className={`text-xs font-medium ${getRoleColor(
                      employee.daylogRol
                    )}`}
                  >
                    Rol: {employee.daylogRol}
                  </div>
                </div>
              ))}
          </div>
        )}

        {selectedEmployees.length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="font-medium text-gray-700">
              Empleados seleccionados:
            </h4>
            {selectedEmployees.map((employee) => (
              <div
                key={employee._id}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
              >
                <div>
                  <span className="font-medium">{employee.fullName}</span>
                  <span className="text-sm text-gray-500 ml-2">
                    ({employee.cuscaId})
                  </span>
                  <div className="text-xs text-gray-400">
                    {employee.position}
                  </div>
                  <div
                    className={`text-xs font-medium ${getRoleColor(
                      employee.daylogRol
                    )}`}
                  >
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
    </div>
  );
}