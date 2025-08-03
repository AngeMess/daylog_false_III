import React, { useState, useEffect } from 'react';
import { FileText, Filter, Search, Check, X, AlertCircle, Calendar, Info } from 'lucide-react'; 
import CustomHeading from '../../../../components/Titles/TitleH1';
import CustomDescription from '../../../../components/Titles/TitleH3';
import { LoadingState, ErrorState, EmptyState } from '../../../../components/ui/stateHandler'; // Import EmptyState
import RequestFormCard from '../../components/CardsPermissions/RequestFormCard';
import PermissionStatsCards from '../../components/CardsPermissions/PermissionStatsCards';
import CompensatoryHoursCard from '../../components/CardsPermissions/CompensatoryHoursCard';
import FilterButton from '../../../../components/ui/FilterButton'


const PermissionsRequests = () => {
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);

  // Estados para filtros y búsqueda
  const [filterYear, setFilterYear] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Estados para StateHandler
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [requestsData, setRequestsData] = useState([]);

  // Inicialización de datos con manejo de estados
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Simular un pequeño delay para mostrar el loading
        await new Promise(resolve => setTimeout(resolve, 500));

        const storedData = localStorage.getItem('permissionRequests');
        const defaultData = [
          {
            date: '21/6/2025',
            type: 'Día médico',
            reason: 'Consulta médica',
            status: 'Pendiente'
          },
          {
            date: '21/4/2025',
            type: 'Día médico',
            reason: 'Consulta médica',
            status: 'Aprobado'
          },
          {
            date: '21/4/2025',
            type: 'Día médico',
            reason: 'Consulta médica',
            status: 'Rechazado'
          },
          {
            date: '15/3/2025',
            type: 'Personal',
            reason: 'Asuntos familiares',
            status: 'Aprobado'
          },
          {
            date: '10/2/2025',
            type: 'Emergencia',
            reason: 'Emergencia médica familiar',
            status: 'Pendiente' // Changed to Pendiente for better testing of filters
          }
        ];

        const data = storedData ? JSON.parse(storedData) : defaultData;
        setRequestsData(data);

      } catch (error) {
        console.error("Failed to load requests data", error);
        setError("Error al cargar los datos. Por favor, intenta nuevamente.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Guardar datos en localStorage
  useEffect(() => {
    if (requestsData.length > 0 && !isLoading) {
      try {
        localStorage.setItem('permissionRequests', JSON.stringify(requestsData));
      } catch (error) {
        console.error("Failed to save requests to localStorage", error);
      }
    }
  }, [requestsData, isLoading]);

  const permissionOptions = [
    { value: 'medical-day', label: 'Día médico' },
    { value: 'personal', label: 'Personal' },
    { value: 'emergency', label: 'Emergencia' },
    { value: 'vacation', label: 'Vacaciones' },
    { value: 'compensatory', label: 'Compensatorio' }
  ];

  const getStatusClass = (status) => {
    switch (status) {
      case 'Pendiente': return 'text-yellow-600 bg-yellow-50';
      case 'Aprobado': return 'text-green-600 bg-green-50';
      case 'Rechazado': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getPermissionLabel = (value) => {
    const option = permissionOptions.find(opt => opt.value === value);
    return option ? option.label : value;
  };

  const handleSubmit = async ({ permissionType, reason, date }) => {
    try {
      setIsSubmitting(true);

      // Simular envío de solicitud
      await new Promise(resolve => setTimeout(resolve, 1000));

      const formattedDateForNewRequest = formatDateForDisplay(date);

      const newRequest = {
        date: formattedDateForNewRequest,
        type: getPermissionLabel(permissionType),
        reason: reason,
        status: 'Pendiente'
      };

      setRequestsData(prevData => [newRequest, ...prevData]);

      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);

    } catch (error) {
      console.error("Error submitting request:", error);
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    window.location.reload();
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
    // Ensure date is valid before trying to get the year
    const parts = request.date.split('/');
    const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`; // Convert to YYYY-MM-DD for Date object
    const requestDateObj = new Date(formattedDate);
    const requestYear = isNaN(requestDateObj.getFullYear()) ? '' : requestDateObj.getFullYear().toString();


    const matchesYear = filterYear ? requestYear === filterYear : true;
    const matchesStatus = filterStatus ? request.status === filterStatus : true;
    const matchesSearch = searchTerm ?
      Object.values(request).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      ) : true;
    return matchesYear && matchesStatus && matchesSearch;
  });

  // Options for Year filter
  const allYears = Array.from(new Set(requestsData
    .map(req => {
      const parts = req.date.split('/');
      const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
      const dateObj = new Date(formattedDate);
      return isNaN(dateObj.getFullYear()) ? null : dateObj.getFullYear();
    })
    .filter(year => year !== null)
  )).sort((a, b) => b - a);


  // Options for Status filter
  const allStatuses = ['Pendiente', 'Aprobado', 'Rechazado'];

  // Mostrar estado de error
  if (error) {
    return (
      <div className="min-h-screen p-6">
        <div className="w-full mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="text-blue-600" size={24} />
              </div>
              <CustomHeading
                text="Permisos y solicitudes"
                color="#01426A"
              />
            </div>
            <CustomDescription
              text="Error al cargar los datos. Por favor, intenta nuevamente."
            />
          </div>
          <ErrorState
            message={error}
            onRetry={handleRetry}
            showRetryButton={true}
          />
        </div>
      </div>
    );
  }

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
            text=" Gestiona tus solicitudes de permisos y revisa el historial"
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">

          {/* Formulario Component */}
          <RequestFormCard
            permissionOptions={permissionOptions}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            setShowErrorToast={setShowErrorToast}
          />

          {/* Estadísticas y Horas */}
          <div className="space-y-6 w-full">
            {isLoading ? (
              <LoadingState message="Cargando estadísticas..." />
            ) : (
              <>
                <PermissionStatsCards statistics={statistics} />
                <CompensatoryHoursCard hours="3h" />
              </>
            )}
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

                {/* FilterButton with customContent for Year and Status */}
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
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <LoadingState message="Cargando historial de solicitudes..." />
            ) : filteredRequests.length === 0 ? (
              <EmptyState
                message="No se encontraron solicitudes."
                description="Intenta ajustar tus filtros o búsqueda."
                icon={Info} // You can choose an appropriate icon from lucide-react
                iconColor="text-blue-400" // Or any other color
              />
            ) : (
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
                      Estado
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 rounded-full text-base font-medium ${getStatusClass(request.status)}`} style={{ fontFamily: 'Montserrat' }}>
                          {request.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Toast notifications */}
      {showSuccessToast && (
        <div className="fixed bottom-5 right-5 z-50">
          <div className="bg-green-500 text-white p-4 rounded-lg shadow-lg flex items-center min-w-[300px]">
            <Check size={20} className="mr-3" />
            <span style={{ fontFamily: 'Montserrat', fontWeight: 500 }}>
              Solicitud enviada con éxito
            </span>
            <button
              onClick={() => setShowSuccessToast(false)}
              className="ml-auto p-1 hover:bg-white/20 rounded-full"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {showErrorToast && (
        <div className="fixed bottom-5 right-5 z-50">
          <div className="bg-red-500 text-white p-4 rounded-lg shadow-lg flex items-center min-w-[300px]">
            <AlertCircle size={20} className="mr-3" />
            <span style={{ fontFamily: 'Montserrat', fontWeight: 500 }}>
              Por favor completa todos los campos requeridos
            </span>
            <button
              onClick={() => setShowErrorToast(false)}
              className="ml-auto p-1 hover:bg-white/20 rounded-full"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PermissionsRequests;