import React, { useState, useMemo, useRef, useEffect } from 'react';
import AreaDetailView from './AreaDetailView';
import { Button } from '../../../../components/Buttons';
import { SearchComponent } from '../../../../components/Search';
import {
  Search,
  ArrowLeft,
  Plus,
  Triangle,
  Layers,
  Pyramid,
  FileText,
  Trash,
  AlertTriangle
} from 'lucide-react';
import CreateArea from './CreateArea';
import CreateParentArea from './CreateParentArea';
import CombineAreaMadre from './CombineAreaMadre';
import useMainAreaArea from '../../hooks/useAreaMainAreaApi.jsx';
import CustomHeading from '../../../../components/Titles/TitleH1';
import CustomDescription from '../../../../components/Titles/TitleH3';
import { LoadingState, ErrorState, EmptyState } from '../../../../components/ui/stateHandler.jsx';
import AreaCard from '../../components/AreaCards/AreaCard.jsx'; // Import the AreaCard component
import AreaManagementCards from '../../components/AreaCards/AreaManagementCards .jsx'; // Import the new component

const AreaManagement = () => {
  // Hook personalizado para gestión de áreas combinadas
  const {
    mainAreaAreas,
    loading,
    error,
    createMainAreaArea,
    updateMainAreaArea,
    deleteMainAreaArea,
    clearError
  } = useMainAreaArea();

  // Estado para animación
  const [animate, setAnimate] = useState(false);
  // Estado para mostrar la pantalla de crear área
  const [showCreateArea, setShowCreateArea] = useState(false);
  // Estado para mostrar la pantalla de crear área madre
  const [showCreateParentArea, setShowCreateParentArea] = useState(false);
  // Estado para mostrar la pantalla de juntar área con área madre
  const [showCombineAreaMadre, setShowCombineAreaMadre] = useState(false);
  // Estado para mostrar el modal de confirmación de eliminación
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  // Estado para guardar el área a eliminar
  const [areaToDelete, setAreaToDelete] = useState(null);
  // Estado para mostrar la vista detalle de un área
  const [showAreaDetail, setShowAreaDetail] = useState(false);
  // Estado para guardar el área seleccionada para ver detalles
  const [selectedArea, setSelectedArea] = useState(null);
  // Estado para el loading de eliminación
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Estados
  const [activeTab, setActiveTab] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');

  // Procesar áreas para mostrar formato combinado (Área Principal - Área)
  const processedAreas = useMemo(() => {
    return mainAreaAreas.map(area => {
      let displayName = 'No asignado';
      let mainAreaName = '';
      let areaName = '';

      // Procesar según la estructura del área
      if (area.mainArea && area.area) {
        mainAreaName = area.mainArea.name || '';
        areaName = area.area.name || '';
        displayName = `${mainAreaName} - ${areaName}`.trim();
        if (displayName === ' - ') displayName = 'No asignado';
      } else if (area.name) {
        // Si no tiene mainArea pero tiene name, usar el name
        displayName = area.name;
      }

      return {
        ...area,
        displayName,
        mainAreaName,
        areaName,
        // Calcular la cantidad de empleados si existe
        amountEmployee: area.amountEmployee || 0
      };
    });
  }, [mainAreaAreas]);

  // Filtrar áreas según el término de búsqueda
  const filteredAreas = useMemo(() => {
    return processedAreas.filter(area => {
      const matchesSearch = searchTerm === '' ||
        area.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (area.name && area.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (area.mainAreaName && area.mainAreaName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (area.areaName && area.areaName.toLowerCase().includes(searchTerm.toLowerCase()));

      return matchesSearch;
    });
  }, [processedAreas, searchTerm]);

  // Manejar eliminación de área
  const handleDeleteArea = async () => {
    if (!areaToDelete) return;

    setDeleteLoading(true);
    try {
      await deleteMainAreaArea(areaToDelete._id);
      setShowDeleteModal(false);
      setAreaToDelete(null);
    } catch (error) {
      console.error('Error al eliminar área:', error);
      // El error ya se maneja en el hook
    } finally {
      setDeleteLoading(false);
    }
  };

  // Manejar creación de área desde CreateArea
  const handleCreateArea = async (areaData) => {
    try {
      await createMainAreaArea(areaData);
      setShowCreateArea(false);
    } catch (error) {
      console.error('Error al crear área:', error);
      // El error ya se maneja en el hook
    }
  };

  // Función para reintentar carga de datos
  const handleRetry = () => {
    clearError();
    // Aquí puedes agregar lógica adicional para recargar datos si es necesario
  };

  // Limpiar errores cuando el componente se monta
  useEffect(() => {
    if (error) {
      // Opcionalmente puedes mostrar una notificación de error aquí
      console.error('Error en áreas:', error);
    }
  }, [error]);

  return (
    <div className="p-6">
      {/* Ajustes para los iconos triangulares en la tabla */}
      <style jsx>{`
        .area-row .triangle-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          margin-right: 12px;
        }
      `}</style>

      {showCreateArea ? (
        <CreateArea
          onCancel={() => setShowCreateArea(false)}
          onSubmit={handleCreateArea}
          loading={loading}
        />
      ) : showCreateParentArea ? (
        <CreateParentArea onCancel={() => setShowCreateParentArea(false)} />
      ) : showCombineAreaMadre ? (
        <CombineAreaMadre onCancel={() => setShowCombineAreaMadre(false)} />
      ) : showAreaDetail && selectedArea ? (
        <AreaDetailView
          area={selectedArea}
          onClose={() => setShowAreaDetail(false)}
        />
      ) : activeTab === 'list' ? (
        <div className="p-0">
          <div className="flex justify-between items-center mb-2">
            <CustomHeading
              text="Lista de Áreas"
              color="#01426A"
            />
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
            <CustomDescription
              text="Áreas combinadas dentro de DayLog"
            />
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-auto order-2 sm:order-1">
                <SearchComponent
                  type="text"
                  placeholder="Buscar áreas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-auto"
                />
                <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                  <Search size={18} strokeWidth={2} aria-hidden="true" />
                </div>
              </div>
              <Button
                variant="btn_primary"
                onClick={() => {
                  setActiveTab('manage');
                  setAnimate(true);
                  setTimeout(() => setAnimate(false), 300);
                }}
                className="px-4 py-2 w-full sm:w-auto order-1 sm:order-2"
              >
                <span className="flex items-center gap-2">Gestionar áreas</span>
              </Button>
            </div>
          </div>

          <div className="rounded-lg">
            {/* Mostrar estado de error */}
            {error && (
              <ErrorState
                message={error}
                onRetry={handleRetry}
                showRetryButton={true}
              />
            )}

            {/* Mostrar estado de carga */}
            {loading && mainAreaAreas.length === 0 && !error && (
              <LoadingState message="Cargando áreas..." />
            )}

            {/* Mostrar contenido cuando no hay loading ni error */}
            {!loading && !error && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAreas.length === 0 ? (
                  <div className="col-span-full">
                    <EmptyState
                      icon={Triangle}
                      iconColor="text-blue-500"
                      message={
                        mainAreaAreas.length === 0
                          ? "No hay áreas registradas"
                          : "No se encontraron áreas"
                      }
                      description={
                        mainAreaAreas.length === 0
                          ? "Comienza creando tu primera área o área combinada"
                          : searchTerm
                          ? `No hay áreas que coincidan con "${searchTerm}"`
                          : "No hay áreas que coincidan con los filtros seleccionados" // This text can remain as it refers to the search term as a "filter" broadly
                      }
                      actionButton={
                        mainAreaAreas.length === 0 ? (
                          <Button
                            variant="btn_primary"
                            onClick={() => setActiveTab('manage')}
                            className="mt-4"
                          >
                            <Plus size={16} className="mr-2" />
                            Crear primera área
                          </Button>
                        ) : (
                          <Button
                            variant="btn_g"
                            onClick={() => {
                              setSearchTerm('');
                            }}
                            className="mt-4"
                          >
                            Limpiar búsqueda
                          </Button>
                        )
                      }
                    />
                  </div>
                ) : (
                  filteredAreas.map((area) => (
                    <AreaCard
                      key={area._id}
                      area={area}
                      onShowDetail={(areaToShow) => {
                        setSelectedArea(areaToShow);
                        setShowAreaDetail(true);
                      }}
                      onDelete={(areaToDeleteConfirm) => {
                        setAreaToDelete(areaToDeleteConfirm);
                        setShowDeleteModal(true);
                      }}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-start mb-2">
            <div className="flex flex-col">
              <CustomHeading
                text="Gestión de Áreas"
                color="#01426A"
              />
              <br />
              <h3 className="text-l font-light mb-8" style={{ color: '#000' }}>Administra las áreas combinadas de DayLog</h3>
            </div>
          </div>
          <div className="flex items-center justify-start mb-10">
            <div className="flex items-center gap-6">
              <Button
                onClick={() => setActiveTab('list')}
                variant="btn_secondary"
              >
                <ArrowLeft size={16} className="h-4 w-4" />
                <span>Volver</span>
              </Button>
            </div>
          </div>

          {/* Render the new AreaManagementCards component */}
          <AreaManagementCards
            setShowCreateArea={setShowCreateArea}
            setShowCreateParentArea={setShowCreateParentArea}
            setShowCombineAreaMadre={setShowCombineAreaMadre}
            loading={loading} // Pass the loading state
            animate={animate} // Pass the animate state
          />
        </div>
      )}

      {/* Modal de confirmación para eliminar área */}
      {showDeleteModal && areaToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
          <div className="fixed inset-0 bg-transparent backdrop-blur-md" style={{ backdropFilter: 'blur(8px)' }}></div>
          <div className="relative bg-white rounded-lg shadow-xl p-6 max-w-md w-full z-50">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-center text-gray-800">¿Eliminar área?</h3>
              <p className="text-gray-600 text-center mb-6">
                Estás a punto de eliminar el área <strong>{areaToDelete.displayName}</strong>. Esta acción no se puede deshacer.
              </p>
              <div className="flex justify-center space-x-4 w-full">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setAreaToDelete(null);
                  }}
                  disabled={deleteLoading}
                  className="px-6 py-2.5 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteArea}
                  disabled={deleteLoading}
                  className="px-6 py-2.5 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {deleteLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Eliminando...
                    </>
                  ) : (
                    'Eliminar'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AreaManagement;