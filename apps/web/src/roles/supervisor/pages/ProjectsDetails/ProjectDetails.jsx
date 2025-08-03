// ProjectDetails.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../../../../components/Buttons";
import {
  ArrowLeft,
  Calendar,
  User,
  Globe,
  Users,
  Edit,
  Plus,
  Layers,
  CheckCircle2,
  XCircle,
  Clock,
  X,
  Search,
} from "lucide-react";
import Modal from "react-modal";
import ProjectEmployeesTable from "../../../../components/Projects/ProjectEmployeesTable";
import CustomHeading from "../../../../components/Titles/TitleH1";
import CustomSubtitle from "../../../../components/Titles/Subtitle";
import { motion as Motion } from "framer-motion";
import { useProjectDetails } from "../../hooks/useProjectDetails";
import useWorkTeam from "../../../admin/hooks/useWorkTeam";
import { toast } from "react-hot-toast";

Modal.setAppElement("#root");

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // REMOVER setEmployees de la desestructuración, el hook lo maneja internamente
  const { project, employees, loading, error, updateProjectWorkTeam } =
    useProjectDetails(id);
  const { searchMultipleRoleEmployees, getAreaName } = useWorkTeam();

  // Puedes remover estos si no los usas para el estado del proyecto
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedNewStatus, setSelectedNewStatus] = useState("");

  const [addEmployeeModalOpen, setAddEmployeeModalOpen] = useState(false);
  const [searchEmployee, setSearchEmployee] = useState("");
  const [employeesList, setEmployeesList] = useState([]);
  const [selectedEmployeesToAdd, setSelectedEmployeesToAdd] = useState([]);
  const [isAddingEmployees, setIsAddingEmployees] = useState(false); // Nuevo estado para indicar que se está agregando

  const handleSearchEmployee = useCallback(
    async (searchTerm) => {
      if (searchTerm.length > 2) {
        const results = await searchMultipleRoleEmployees(searchTerm);
        const activeEmployees = results.filter((employee) => employee.isActive);
        setEmployeesList(activeEmployees);
      } else {
        setEmployeesList([]);
      }
    },
    [searchMultipleRoleEmployees]
  );

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      handleSearchEmployee(searchEmployee);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchEmployee, handleSearchEmployee]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Cargando detalles del proyecto...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Error: {error}</p>
        <button
          onClick={() => navigate("/supervisor/proyectos")}
          className="ml-4 px-4 py-2 bg-[#01426A] text-white rounded-md"
        >
          Volver
        </button>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>No se encontraron detalles para este proyecto.</p>
        <button
          onClick={() => navigate("/supervisor/proyectos")}
          className="ml-4 px-4 py-2 bg-[#01426A] text-white rounded-md"
        >
          Volver
        </button>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pendiente":
        return (
          <div className="flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-md">
            <Clock size={16} className="mr-1" />
            <span>Pendiente</span>
          </div>
        );
      case "En proceso":
        return (
          <div className="flex items-center px-3 py-1 text-sm bg-[#01426A] text-white rounded-md">
            <Layers size={16} className="mr-1" />
            <span>En proceso</span>
          </div>
        );
      case "Finalizado":
      case "Completado":
        return (
          <div className="flex items-center px-3 py-1 text-sm bg-green-100 text-green-800 rounded-md">
            <CheckCircle2 size={16} className="mr-1" />
            <span>Finalizado</span>
          </div>
        );
      default:
        return null;
    }
  };

  const getSaturationBadge = (saturation) => {
    switch (saturation) {
      case "Baja":
        return (
          <div className="flex items-center px-3 py-1 text-sm bg-green-100 text-green-800 rounded-md">
            <span>Saturación Baja</span>
          </div>
        );
      case "Normal":
        return (
          <div className="flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-md">
            <span>Saturación Normal</span>
          </div>
        );
      case "Alta":
        return (
          <div className="flex items-center px-3 py-1 text-sm bg-red-100 text-red-800 rounded-md">
            <span>Saturación Alta</span>
          </div>
        );
      default:
        return null;
    }
  };

  const getSizeBadge = (size) => {
    switch (size) {
      case "Pequeño":
        return (
          <div className="flex items-center px-3 py-1 text-sm bg-green-100 text-green-800 rounded-md">
            <span>Tamaño Pequeño</span>
          </div>
        );
      case "Mediano":
        return (
          <div className="flex items-center px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-md">
            <span>Tamaño Mediano</span>
          </div>
        );
      case "Grande":
        return (
          <div className="flex items-center px-3 py-1 text-sm bg-orange-100 text-orange-800 rounded-md">
            <span>Tamaño Grande</span>
          </div>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No definida";

    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const handleSelectEmployeeToAdd = (employee) => {
    setSelectedEmployeesToAdd((prev) => {
      if (prev.find((emp) => emp._id === employee._id)) {
        return prev.filter((emp) => emp._id !== employee._id);
      } else {
        return [...prev, employee];
      }
    });
  };

  const handleAddSelectedEmployees = async () => {
    if (selectedEmployeesToAdd.length === 0) {
      toast.error("Por favor, selecciona al menos un empleado para agregar.");
      return;
    }

    const currentEmployeeIds = employees.map((emp) => emp.employeeId);
    const newEmployeesFiltered = selectedEmployeesToAdd.filter(
      (newEmp) => !currentEmployeeIds.includes(newEmp._id)
    );

    if (newEmployeesFiltered.length === 0) {
      toast.error(
        "Los empleados seleccionados ya están asignados a este proyecto."
      );
      return;
    }

    const updatedEmployeesForBackend = [
      ...employees.map((emp) => ({ id: emp.employeeId })),
      ...newEmployeesFiltered.map((emp) => ({ id: emp._id })),
    ];

    setIsAddingEmployees(true); // Empieza el proceso de adición
    try {
      const success = await updateProjectWorkTeam(
        project._id,
        updatedEmployeesForBackend
      );

      if (success) {
        // Si la actualización fue exitosa, useProjectDetails ya habrá llamado a fetchProjectDetails
        // para refrescar el estado 'project' y 'employees'.
        // NO necesitamos actualizar 'employees' manualmente aquí.
        toast.success("Empleados agregados exitosamente al proyecto.");
        setAddEmployeeModalOpen(false);
        setSelectedEmployeesToAdd([]);
        setSearchEmployee("");
        setEmployeesList([]);
      } else {
        // updateProjectWorkTeam ya muestra un toast de error, pero puedes agregar otro aquí si quieres un mensaje más específico.
      }
    } catch (err) {
      console.error("Error al agregar empleados:", err);
      toast.error(`Error al agregar empleados: ${err.message}`);
    } finally {
      setIsAddingEmployees(false); // Finaliza el proceso de adición, sea éxito o fallo
    }
  };

  return (
    <div className="p-6 w-full min-h-screen flex flex-col">
      {/* Encabezado con botón de regreso */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate("/supervisor/proyectos")}
          className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={24} className="text-gray-600" />
        </button>
        <div>
          <CustomHeading
            text={`Proyecto: ${project.code || project.proyectName}`}
            color="#01426A"
          />
        </div>
      </div>

      {/* Contenido principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna izquierda - Información del proyecto */}
        <div className="lg:col-span-2">
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl p-6 shadow-sm mb-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {project.proyectName}
                </h2>
                <p className="text-gray-500">Código: {project.code}</p>
              </div>
            </div>

            {/* Estado y badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              {getStatusBadge(project.state)}
              {getSaturationBadge(project.saturation)}
              {getSizeBadge(project.size)}
            </div>

            {/* Información detallada */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Fechas
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Calendar size={18} className="text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Fecha de inicio</p>
                      <p className="font-medium">
                        {formatDate(project.startDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar size={18} className="text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">
                        Fecha de finalización
                      </p>
                      <p className="font-medium">
                        {formatDate(project.finishDate)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Responsables
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <User size={18} className="text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Supervisor</p>
                      <p className="font-medium">
                        {project.supervisor?.fullName || "No asignado"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Users size={18} className="text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Equipo de trabajo</p>
                      <p className="font-medium">
                        {project.workTeam?.name || "No asignado"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Ubicación
                </h3>
                <div className="flex items-center">
                  <Globe size={18} className="text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">País</p>
                    <p className="font-medium">
                      {project.country?.name || "No especificado"}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Área</h3>
                <div className="flex items-center">
                  <Layers size={18} className="text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Área principal</p>
                    <p className="font-medium">
                      {project.mainAreaArea
                        ? `${project.mainAreaArea.mainArea?.name || ""} - ${project.mainAreaArea.area?.name || ""}`
                        : "No especificada"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Motion.div>

          {/* Tabla de empleados */}
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <div className="flex justify-between items-center mb-4">
              <CustomSubtitle text="Empleados asignados" />
              <Button
                variant="btn_primary"
                onClick={() => setAddEmployeeModalOpen(true)}
              >
                <Plus size={18} />
                Agregar Empleado
              </Button>
            </div>
            {/* Agrega un indicador de carga si isAddingEmployees es true */}
            {isAddingEmployees ? (
              <div className="flex justify-center items-center py-8">
                <p className="text-gray-500">Agregando empleados...</p>
              </div>
            ) : (
              <ProjectEmployeesTable
                employeeActivities={
                  Array.isArray(employees)
                    ? employees.map((e) => ({
                        fullName:
                          e.nombre && e.apellido
                            ? `${e.nombre} ${e.apellido}`
                            : e.nombre || "",
                        cuscaId: e.cuscaId || "",
                        actividades: e.actividades ?? 0,
                        employeeId: e.employeeId,
                      }))
                    : []
                }
                onEmployeeClick={() =>
                  navigate("/supervisor/proyectos/detalle-proyecto-act")
                }
              />
            )}
          </Motion.div>
        </div>

        {/* Columna derecha - Estadísticas y actividad */}
        <div>
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm mb-6"
          >
            <CustomSubtitle text="Estadísticas" />
            <div className="space-y-4 mt-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Total actividades</p>
                <p className="text-2xl font-bold text-gray-800">
                  {employees.reduce((sum, emp) => sum + emp.actividades, 0)}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Empleados asignados</p>
                <p className="text-2xl font-bold text-gray-800">
                  {employees.length}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Visibilidad</p>
                <p className="text-xl font-bold text-gray-800">
                  {project.visible ? "Visible" : "No visible"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {project.visible
                    ? "El proyecto es visible para todos los empleados"
                    : "El proyecto está oculto para los empleados"}
                </p>
              </div>
            </div>
          </Motion.div>
        </div>
      </div>

      {/* Modal de búsqueda de empleados */}
      <Modal
        isOpen={addEmployeeModalOpen}
        onRequestClose={() => {
          setAddEmployeeModalOpen(false);
          setSelectedEmployeesToAdd([]);
          setSearchEmployee("");
          setEmployeesList([]);
        }}
        className="modal-content"
        overlayClassName="modal-overlay"
        style={{
          content: {
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            borderRadius: "12px",
            border: "none",
            padding: "20px",
            width: "auto",
            maxWidth: "90%",
            maxHeight: "90vh",
            overflow: "auto",
            boxShadow: "0 4px 24px rgba(0, 0, 0, 0.1)",
          },
          overlay: {
            position: "fixed",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
        }}
        contentLabel="Buscar y agregar empleado"
      >
        <div className="flex flex-col items-center w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Buscar y agregar empleado(s)
          </h2>

          <div className="w-full max-w-md">
            <div className="relative mb-6">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Buscar empleado por nombre o CuscaID..."
                value={searchEmployee}
                onChange={(e) => setSearchEmployee(e.target.value)}
                className="w-full px-10 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Empleados seleccionados para agregar */}
            {selectedEmployeesToAdd.length > 0 && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-sm font-medium text-blue-800 mb-2">
                  Empleados a añadir:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedEmployeesToAdd.map((emp) => (
                    <span
                      key={emp._id}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-200 text-blue-800"
                    >
                      {emp.fullName}
                      <button
                        type="button"
                        onClick={() => handleSelectEmployeeToAdd(emp)}
                        className="flex-shrink-0 ml-1.5 h-3 w-3 rounded-full inline-flex items-center justify-center text-blue-400 hover:bg-blue-300 hover:text-blue-500 focus:outline-none focus:bg-blue-500 focus:text-white"
                      >
                        <span className="sr-only">Remover {emp.fullName}</span>
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Lista de empleados para seleccionar */}
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {employeesList.length > 0 ? (
                employeesList.map((employee) => (
                  <div
                    key={employee._id}
                    className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${selectedEmployeesToAdd.some((e) => e._id === employee._id) ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300"}`}
                    onClick={() => handleSelectEmployeeToAdd(employee)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{employee.fullName}</p>
                        <p className="text-sm text-gray-500">
                          Rol: {employee.daylogRol}
                        </p>
                      </div>
                      <p className="text-sm text-gray-500">
                        {employee.cuscaId}
                      </p>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Área:{" "}
                      {employee.mainAreaArea
                        ? getAreaName(employee.mainAreaArea)
                        : "Sin área asignada"}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">
                  {searchEmployee.length > 0
                    ? "No se encontraron empleados activos con ese criterio."
                    : "Escribe para buscar empleados (ej. Alejandro, María, CUS-001)."}
                </p>
              )}
            </div>
          </div>

          <div className="flex space-x-4 w-full mt-6">
            <Button
              variant="btn_second_secondary"
              onClick={() => {
                setAddEmployeeModalOpen(false);
                setSelectedEmployeesToAdd([]);
                setSearchEmployee("");
                setEmployeesList([]);
              }}
            >
              Cancelar
            </Button>

            <Button
              variant="btn_second_primary"
              onClick={handleAddSelectedEmployees}
              disabled={
                selectedEmployeesToAdd.length === 0 || isAddingEmployees
              }
            >
              {isAddingEmployees ? "Agregando..." : "Agregar seleccionado(s)"}{" "}
              {/* Texto de carga */}
            </Button>
          </div>

          <button
            onClick={() => {
              setAddEmployeeModalOpen(false);
              setSelectedEmployeesToAdd([]);
              setSearchEmployee("");
              setEmployeesList([]);
            }}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
          >
            <X size={24} />
          </button>
        </div>
      </Modal>
    </div>
  );
}
