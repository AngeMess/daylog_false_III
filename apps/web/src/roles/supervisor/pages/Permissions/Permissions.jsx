import React, { useState, useEffect } from 'react';
import { Calendar, FileText, Clock, Filter, Search, Info, Check, X, AlertCircle, MoreHorizontal } from 'lucide-react';
import CustomHeading from '../../../../components/Titles/TitleH1';
import CustomDescription from '../../../../components/Titles/TitleH3';
import { Button } from "../../../../components/Buttons";
import DropdownMenuComponent from '../../../../components/DropdownMenu/DropdownMenu';
import PermissionStatCard from '../../components/PermissionStatCard';
import FilterButton from '../../../../components/ui/FilterButton'

const PermissionsRequests = () => {
  // Estados para filtros y búsqueda
  const [filterYear, setFilterYear] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Inicialización de datos
  const [requestsData, setRequestsData] = useState(() => {
    try {
      const storedData = localStorage.getItem('permissionRequests');
      return storedData ? JSON.parse(storedData) : [
        { date: '21/6/2025', type: 'Día médico', reason: 'Consulta médica', status: 'Pendiente', employee: 'Juan Pérez' },
        { date: '21/4/2025', type: 'Día médico', reason: 'Revisión médica anual', status: 'Aprobado', employee: 'María García' },
        { date: '21/4/2025', type: 'Día personal', reason: 'Asunto familiar urgente', status: 'Rechazado', employee: 'Pedro López' },
        { date: '15/3/2025', type: 'Vacaciones', reason: 'Viaje a la playa', status: 'Aprobado', employee: 'Ana Martínez' },
        { date: '10/2/2025', type: 'Emergencia', reason: 'Emergencia dental', status: 'Pendiente', employee: 'Luis Rodríguez' }
      ];
    } catch (error) {
      console.error("Failed to parse requests from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('permissionRequests', JSON.stringify(requestsData));
    } catch (error) {
      console.error("Failed to save requests to localStorage", error);
    }
  }, [requestsData]);

  const getStatusClass = (status) => {
    switch (status) {
      case 'Pendiente': return 'text-yellow-600 bg-yellow-50';
      case 'Aprobado': return 'text-green-600 bg-green-50';
      case 'Rechazado': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const handleShowRequest = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const handleApproveReject = (status) => {
    setRequestsData(prevData =>
      prevData.map(req =>
        req === selectedRequest ? { ...req, status: status } : req
      )
    );
    setShowModal(false);
    setSelectedRequest(null);
  };

  const getStatistics = () => {
    const approved = requestsData.filter(req => req.status === 'Aprobado').length;
    const pending = requestsData.filter(req => req.status === 'Pendiente').length;
    const rejected = requestsData.filter(req => req.status === 'Rechazado').length;

    return { approved, pending, rejected };
  };

  const statistics = getStatistics();

  // Lógica de filtrado y búsqueda
  const filteredRequests = requestsData.filter(request => {
    const requestYear = new Date(request.date.split('/').reverse().join('-')).getFullYear().toString();

    const matchesYear = filterYear ? requestYear === filterYear : true;
    const matchesStatus = filterStatus ? request.status === filterStatus : true;
    const matchesSearch = searchTerm ?
      Object.values(request).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      ) : true;
    return matchesYear && matchesStatus && matchesSearch;
  });

  // Options for Year filter
  const allYears = Array.from(new Set(requestsData.map(req => new Date(req.date.split('/').reverse().join('-')).getFullYear())))
    .sort((a, b) => b - a);

  // Options for Status filter
  const allStatuses = ['Pendiente', 'Aprobado', 'Rechazado'];

  return (
    <div className="min-h-screen p-6">
      <div className="w-full mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <CustomHeading
              text="Permisos y solicitudes"
              color="#01426A"
            />
          </div>
          <CustomDescription
            text=" Gestiona las solicitudes de permisos de los empleados"
          />
        </div>

        <div className="grid grid-cols-1 gap-8 items-start">

          {/* Estadísticas */}
          <div className="space-y-6 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <PermissionStatCard
                title="Aprobadas"
                value={statistics.approved}
                colorClass="text-green-600"
              />
              <PermissionStatCard
                title="Pendientes"
                value={statistics.pending}
                colorClass="text-yellow-600"
              />
              <PermissionStatCard
                title="Rechazadas"
                value={statistics.rejected}
                colorClass="text-red-600"
              />
            </div>
          </div>
        </div>


        {/* Historial de solicitudes */}
        <div className="bg-white rounded-xl shadow-lg mt-8">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">

                <h2
                  className="text-xl font-semibold text-[#194167] whitespace-nowrap" // Added whitespace-nowrap
                  style={{ fontFamily: 'Montserrat' }}
                >
                  Historial de solicitudes
                </h2>

                {/* Single FilterButton for both Year and Status */}
                <FilterButton
                  label="Filtrar"
                  icon={Filter}
                  customContent={
                    <div
                      className="flex px-6 py-4 gap-x-20"
                      style={{ fontFamily: 'Montserrat' }}
                    >
                      {/* Año */}
                      <div className="flex flex-col">
                        <h4 className="font-semibold text-[#01426A] mb-4">Año</h4>
                        <div className="flex flex-col max-w-[160px] space-y-2">
                          {allYears.map(year => (
                            <span
                              key={year}
                              onClick={() => setFilterYear(year.toString())}
                              className={`cursor-pointer text-sm font-medium transition-colors duration-200 ${filterYear === year.toString()
                                ? 'text-[#FFC600]'
                                : 'text-gray-700 hover:text-[#FFC600]'
                                }`}
                              style={{ userSelect: 'none' }}
                            >
                              {year}
                            </span>
                          ))}
                          <span
                            onClick={() => setFilterYear('')}
                            className={`cursor-pointer text-sm font-medium transition-colors duration-200 mt-2 ${!filterYear
                              ? 'text-[#FFC600]'
                              : 'text-gray-700 hover:text-[#FFC600]'
                              }`}
                            style={{ userSelect: 'none' }}
                          >
                            Todos
                          </span>
                        </div>
                      </div>

                      {/* Estado */}
                      <div className="flex flex-col">
                        <h4 className="font-semibold text-[#01426A] mb-4">Estado</h4>
                        <div className="flex flex-col gap-3 max-w-[160px]">
                          {allStatuses.map(status => (
                            <span
                              key={status}
                              onClick={() => setFilterStatus(status)}
                              className={`cursor-pointer text-sm font-medium transition-colors duration-200 ${filterStatus === status
                                ? 'text-[#FFC600]'
                                : 'text-gray-700 hover:text-[#FFC600]'
                                }`}
                              style={{ userSelect: 'none' }}
                            >
                              {status}
                            </span>
                          ))}
                          <span
                            onClick={() => setFilterStatus('')}
                            className={`cursor-pointer text-sm font-medium transition-colors duration-200 ${!filterStatus
                              ? 'text-[#FFC600]'
                              : 'text-gray-700 hover:text-[#FFC600]'
                              }`}
                            style={{ userSelect: 'none' }}
                          >
                            Todos
                          </span>
                        </div>
                      </div>
                    </div>
                  }
                />
              </div>

              <div className="relative"> {/* Barra de búsqueda */}
                <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar solicitudes..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ fontFamily: 'Montserrat' }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'Montserrat' }}>
                    Fecha
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'Montserrat' }}>
                    Tipo
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'Montserrat' }}>
                    Motivo
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'Montserrat' }}>
                    Empleado
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'Montserrat' }}>
                    Estado
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'Montserrat' }}>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.map((request, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900" style={{ fontFamily: 'Montserrat' }}>
                      {request.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900" style={{ fontFamily: 'Montserrat' }}>
                      {request.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700" style={{ fontFamily: 'Montserrat' }}>
                      {request.reason}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900" style={{ fontFamily: 'Montserrat' }}>
                      {request.employee}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 rounded-full text-base font-medium ${getStatusClass(request.status)}`} style={{ fontFamily: 'Montserrat' }}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <DropdownMenuComponent
                        options={[
                          {
                            label: "Mostrar",
                            icon: FileText,
                            onClick: () => handleShowRequest(request)
                          }
                        ]}
                        triggerColor="#667085"
                        hoverColor="#D6AC50"
                        backgroundColor="white"
                        iconSize={20}
                      />
                    </td>
                  </tr>
                ))}
                {filteredRequests.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-base text-gray-500" style={{ fontFamily: 'Montserrat' }}>
                      No se encontraron solicitudes.
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>
        </div>
      </div>

      {/* Modal de Detalle de Permiso */}
      {showModal && selectedRequest && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: 'rgba(110, 110, 110, 0.66)' }} // 6E6E6E con 66% de opacidad
        >
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-[#194167]" style={{ fontFamily: 'Montserrat' }}>
                Detalle de permiso
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4 text-gray-700" style={{ fontFamily: 'Montserrat' }}>
              <div>
                <p className="font-semibold text-[#01426A]">Motivo</p>
                <p>{selectedRequest.reason}</p>
              </div>
              <div>
                <p className="font-semibold text-[#01426A]">Tipo de permiso</p>
                <p>{selectedRequest.type}</p>
              </div>
              <div>
                <p className="font-semibold text-[#01426A]">Empleado</p>
                <p>{selectedRequest.employee}</p>
              </div>
              <div>
                <p className="font-semibold text-[#01426A]">Fecha</p>
                <p>{selectedRequest.date}</p>
              </div>
            </div>
            <div className="mt-8 flex justify-between gap-4">
              <Button
                variant="btn_second_primary"
                className="w-1/2 justify-center"
                onClick={() => handleApproveReject('Aprobado')}
              >
                Aprobar
              </Button>
              <Button
                variant="btn_secondary"
                className="w-1/2 justify-center"
                onClick={() => handleApproveReject('Rechazado')}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2"
                >
                  <path d="M18 6L6 18M6 6l12 12"></path>
                </svg>
                Rechazar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PermissionsRequests;