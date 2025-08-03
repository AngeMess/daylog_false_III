import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Search, X, Check, PenLine } from "lucide-react";
import useWorkTeam from "../../hooks/useWorkTeam";
import CustomHeading from "../../../../components/Titles/TitleH1";
import ActionButtonsCard from '../../components/WorkTeamCards/ActionButtonsCard';
import TeamInfoCard from '../../../../components/CardsWorkTeam/TeamInfoCard';
import TeamMembersTable from '../../../../components/CardsWorkTeam/TeamMembersTable';
import EditTeamCard from "../../components/WorkTeamCards/EditTeamCard"; 
import FormInput from "../../../../components/ui/FormInput"; 
import FormSelect from "../../../../components/ui/FormSelect"; 


export default function DetalleEquipo({ equipoId, onVolver }) {
  // ================================================================================
  // ESTADOS Y CONFIGURACIÓN GENERAL COMPARTIDA
  // ================================================================================

  const [equipo, setEquipo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toggling, setToggling] = useState(false);

  const {
    areas,
    fetchAreas,
    updateWorkTeam,
    searchSupervisors,
    searchMultipleRoleEmployees,
    getEmployeesByRole,
    getEmployeesByMultipleRoles,
  } = useWorkTeam();

  // Opciones para los selects
  const tipoEquipoOptions = [
    { value: "Kanban Team", label: "Kanban Team" },
    { value: "Extreme Programming", label: "Extreme Programming" },
    { value: "Feature Team", label: "Feature Team" },
    { value: "Agile Product Team", label: "Agile Product Team" },
    { value: "Tribe y Squad", label: "Tribe y Squad" },
  ];

  // ================================================================================
  // PRIMERA PANTALLA - VISTA DE SOLO LECTURA (DETALLE DEL EQUIPO)
  // ================================================================================

  // Función memoizada para obtener el nombre del área
  const getAreaName = useCallback(
    (mainAreaAreaData) => {
      console.log("Datos del área recibidos:", mainAreaAreaData);
      console.log("Areas disponibles:", areas);

      if (!mainAreaAreaData) return "Sin área asignada";

      // Si los datos ya vienen poblados del backend (como objeto)
      if (typeof mainAreaAreaData === "object" && mainAreaAreaData !== null) {
        const mainAreaName =
          mainAreaAreaData.mainArea?.name || "Área Principal";
        const areaName = mainAreaAreaData.area?.name || "Subárea";
        return `${mainAreaName} - ${areaName}`;
      }

      // Si solo viene el ID (como string), buscar en areas
      if (typeof mainAreaAreaData === "string" && areas.length > 0) {
        const area = areas.find((area) => area._id === mainAreaAreaData);
        if (area) {
          const mainAreaName = area.mainArea?.name || "Área Principal";
          const areaName = area.area?.name || "Subárea";
          return `${mainAreaName} - ${areaName}`;
        }
      }

      return "Área no encontrada";
    },
    [areas]
  );

  // Función para cargar detalles del equipo (PRIMERA PANTALLA)
  const fetchTeamDetails = useCallback(async () => {
    if (!equipoId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `http://localhost:3000/api/workteams/${equipoId}`
      );
      if (!response.ok) {
        throw new Error("Error al obtener los detalles del equipo");
      }

      const teamData = await response.json();
      console.log("Datos del equipo obtenidos:", teamData);
      console.log("mainAreaArea del equipo:", teamData.mainAreaArea);

      setEquipo(teamData);

      // Inicializar datos de edición con los valores actuales del equipo
      setEditData({
        name: teamData.name || "",
        teamType: teamData.teamType || "",
        mainAreaArea: teamData.mainAreaArea?._id || teamData.mainAreaArea || "",
        supervisor: teamData.supervisor?._id || "",
        employees:
          teamData.employees?.map((emp) => ({ id: emp.id?._id || emp.id })) ||
          [],
      });

      // Configurar supervisor seleccionado
      if (teamData.supervisor) {
        setSelectedSupervisor(teamData.supervisor);
        setSupervisorSearch(teamData.supervisor.fullName || "");
      }

      // Configurar empleados seleccionados
      if (teamData.employees) {
        const employeesData = teamData.employees
          .map((emp) => emp.id)
          .filter(Boolean);
        setSelectedEmployees(employeesData);
      }
    } catch (err) {
      console.error("Error al cargar detalles del equipo:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [equipoId]);

  // Función para toggle del estado isActive (PRIMERA PANTALLA)
  const handleToggleActiveStatus = async () => {
    const newStatus = !equipo.isActive;
    const action = newStatus ? "habilitar" : "deshabilitar";

    if (window.confirm(`¿Estás seguro de que deseas ${action} este equipo?`)) {
      try {
        setToggling(true);

        const response = await fetch(
          `http://localhost:3000/api/workteams/${equipoId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              isActive: newStatus,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Error al actualizar el estado del equipo");
        }

        // Recargar los datos del equipo
        await fetchTeamDetails();

        alert(`Equipo ${action}do exitosamente`);
      } catch (err) {
        console.error("Error al cambiar estado:", err);
        alert(`Error al ${action} el equipo`);
      } finally {
        setToggling(false);
      }
    }
  };

  // Handler para iniciar edición (TRANSICIÓN A SEGUNDA PANTALLA)
  const handleEditTeam = () => {
    setIsEditing(true);
  };

  // ================================================================================
  // SEGUNDA PANTALLA - VISTA DE EDICIÓN
  // ================================================================================

  // Estados para edición (SEGUNDA PANTALLA)
  const [editData, setEditData] = useState({
    name: "",
    teamType: "",
    mainAreaArea: "",
    supervisor: "",
    employees: [],
  });

  // Estados para búsquedas (SEGUNDA PANTALLA)
  const [supervisorSearch, setSupervisorSearch] = useState("");
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [showSupervisorDropdown, setShowSupervisorDropdown] = useState(false);
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
  const [filteredSupervisors, setFilteredSupervisors] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectedSupervisor, setSelectedSupervisor] = useState(null);

  // Handlers para edición (SEGUNDA PANTALLA)
  const handleInputChange = (e) => {
    const { id, value } = e.target; // Changed from 'name' to 'id'
    setEditData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSelectSupervisor = (employee) => {
    setSelectedSupervisor(employee);
    setEditData((prev) => ({ ...prev, supervisor: employee._id }));
    setSupervisorSearch(employee.fullName);
    setShowSupervisorDropdown(false);
  };

  const handleSelectEmployee = (employee) => {
    if (!selectedEmployees.find((emp) => emp._id === employee._id)) {
      setSelectedEmployees((prev) => [...prev, employee]);
      setEditData((prev) => ({
        ...prev,
        employees: [...prev.employees, { id: employee._id }],
      }));
    }
    setEmployeeSearch("");
    setShowEmployeeDropdown(false);
  };

  const handleRemoveEmployee = (employeeId) => {
    setSelectedEmployees((prev) =>
      prev.filter((emp) => emp._id !== employeeId)
    );
    setEditData((prev) => ({
      ...prev,
      employees: prev.employees.filter((emp) => emp.id !== employeeId),
    }));
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Resetear datos a los valores originales
    fetchTeamDetails();
  };

  const handleSaveEdit = async () => {
    try {
      setSaving(true);

      if (
        !editData.name ||
        !editData.teamType ||
        !editData.mainAreaArea ||
        !editData.supervisor
      ) {
        alert("Por favor completa todos los campos requeridos");
        return;
      }

      const result = await updateWorkTeam(equipoId, editData);

      if (result.success) {
        setIsEditing(false);
        await fetchTeamDetails(); // Recargar datos
        alert("Equipo actualizado exitosamente");
      } else {
        alert("Error al actualizar el equipo: " + result.error);
      }
    } catch (err) {
      console.error("Error al guardar:", err);
      alert("Error al guardar los cambios");
    } finally {
      setSaving(false);
    }
  };

  // Función auxiliar para colores de roles (SEGUNDA PANTALLA)
  const getRoleColor = (role) => {
    switch (role) {
      case "Supervisor":
        return "text-blue-600";
      case "Empleado":
        return "text-green-600";
      case "Portafolio":
        return "text-purple-600";
      default:
        return "text-gray-600";
    }
  };
  // ================================================================================
  // EFFECTS COMPARTIDOS Y DE INICIALIZACIÓN
  // ================================================================================

  // Efecto para cargar áreas
  useEffect(() => {
    const loadAreas = async () => {
      if (areas.length === 0) {
        console.log("Cargando áreas...");
        await fetchAreas();
      }
    };
    loadAreas();
  }, [areas.length, fetchAreas]);

  useEffect(() => {
    if (areas.length === 0) {
      fetchAreas();
    }
  }, [areas.length, fetchAreas]);

  // Efecto para cargar detalles del equipo
  useEffect(() => {
    fetchTeamDetails();
  }, [fetchTeamDetails]);

  // Efectos para búsquedas (SEGUNDA PANTALLA)
  useEffect(() => {
    if (isEditing) {
      const loadInitialData = async () => {
        const initialSupervisors = await getEmployeesByRole("Supervisor");
        setFilteredSupervisors(initialSupervisors.slice(0, 10));

        const initialEmployees = await getEmployeesByMultipleRoles([
          "Empleado",
          "Supervisor",
          "Portafolio",
        ]);
        setFilteredEmployees(initialEmployees.slice(0, 10));
      };
      loadInitialData();
    }
  }, [isEditing]);

  useEffect(() => {
    if (isEditing) {
      const handleSupervisorSearch = async () => {
        const results = await searchSupervisors(supervisorSearch);
        setFilteredSupervisors(results.slice(0, 10));
      };

      const debounceTimer = setTimeout(handleSupervisorSearch, 300);
      return () => clearTimeout(debounceTimer);
    }
  }, [supervisorSearch, isEditing]);

  useEffect(() => {
    if (isEditing) {
      const handleEmployeeSearch = async () => {
        const results = await searchMultipleRoleEmployees(employeeSearch);
        setFilteredEmployees(results.slice(0, 10));
      };

      const debounceTimer = setTimeout(handleEmployeeSearch, 300);
      return () => clearTimeout(debounceTimer);
    }
  }, [employeeSearch, isEditing]);

  // ================================================================================
  // RENDER - ESTADOS DE CARGA Y ERROR
  // ================================================================================

  // Early returns para diferentes estados
  if (loading) {
    return (
      <div className="p-6 w-full font-['Montserrat'] min-h-screen">
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <div className="text-lg text-gray-500">
              Cargando datos del equipo...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 w-full font-['Montserrat'] min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <div className="text-red-400">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error al cargar el equipo
              </h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              <button
                onClick={onVolver}
                className="mt-2 text-sm bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200"
              >
                Volver a la lista
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!equipo) {
    return (
      <div className="p-6 w-full font-['Montserrat'] min-h-screen">
        <div className="flex justify-center items-center h-96">
          <div className="text-lg text-gray-500">
            No se encontró el equipo solicitado
          </div>
        </div>
      </div>
    );
  }

  // Crear opciones de área
  const areaOptions = areas.map((areaRel) => {
    const mainAreaName = areaRel.mainArea?.name || "Área Principal";
    const areaName = areaRel.area?.name || "Subárea";

    return {
      value: areaRel._id,
      label: `${mainAreaName} - ${areaName}`,
    };
  });

  // ================================================================================
  // RENDER PRINCIPAL - ESTRUCTURA DE AMBAS PANTALLAS
  // ================================================================================

  return (
    <div className="p-6 w-full font-['Montserrat'] min-h-screen">
      {/* ================================================================================
    HEADER CON BOTONES - COMPARTIDO ENTRE AMBAS PANTALLAS (AHORA RESPONSIVO)
    ================================================================================ */}
      <ActionButtonsCard
        onVolver={onVolver}
        isEditing={isEditing}
        saving={saving}
        handleCancelEdit={handleCancelEdit}
        handleSaveEdit={handleSaveEdit}
        handleEditTeam={handleEditTeam}
        handleToggleActiveStatus={handleToggleActiveStatus}
        toggling={toggling}
        isActive={equipo.isActive} // Pass isActive as a prop
      />

      {/* ================================================================================
          CONTENIDO PRINCIPAL - ALTERNANCIA ENTRE PRIMERA Y SEGUNDA PANTALLA
          ================================================================================ */}
      {!isEditing ? (
        <TeamInfoCard equipo={equipo} getAreaName={getAreaName} />
      ) : (
        <EditTeamCard
          equipo={equipo}
          editData={editData}
          handleInputChange={handleInputChange}
          tipoEquipoOptions={tipoEquipoOptions}
          areaOptions={areaOptions}
          supervisorSearch={supervisorSearch}
          setSupervisorSearch={setSupervisorSearch}
          showSupervisorDropdown={showSupervisorDropdown}
          setShowSupervisorDropdown={setShowSupervisorDropdown}
          filteredSupervisors={filteredSupervisors}
          handleSelectSupervisor={handleSelectSupervisor}
          selectedSupervisor={selectedSupervisor}
          employeeSearch={employeeSearch}
          setEmployeeSearch={setEmployeeSearch}
          showEmployeeDropdown={showEmployeeDropdown}
          setShowEmployeeDropdown={setShowEmployeeDropdown}
          filteredEmployees={filteredEmployees}
          handleSelectEmployee={handleSelectEmployee}
          selectedEmployees={selectedEmployees}
          handleRemoveEmployee={handleRemoveEmployee}
          getRoleColor={getRoleColor}
          FormInput={FormInput} 
          FormSelect={FormSelect} 
        />
      )}

      {/* Tabla de miembros */}
      <TeamMembersTable employees={equipo.employees} />
    </div>
  );
}