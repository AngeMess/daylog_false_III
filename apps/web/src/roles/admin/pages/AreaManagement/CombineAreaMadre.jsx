import React, { useState, useEffect } from 'react';
import { Search, Triangle, Pyramid } from 'lucide-react';
import useAreas from '../../hooks/useAreaApi';
import useMainAreas from '../../hooks/useMainAreaApi';
import useMainAreaArea from '../../hooks/useAreaMainAreaApi';
import CustomHeading from '../../../../components/Titles/TitleH1';
import { LoadingState, ErrorState, EmptyState } from '../../../../components/ui/stateHandler';
import SelectionCard from '../../components/AreaCards/SelectionCard';
import { Button } from '../../../../components/Buttons';
const JuntarAreaMadre = ({ onCancel }) => {
  const [selectedAreaMadre, setSelectedAreaMadre] = useState(null);
  const [selectedAreasIds, setSelectedAreasIds] = useState([]);
  const [searchAreaMadre, setSearchAreaMadre] = useState('');
  const [searchArea, setSearchArea] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [mainAreasLoading, setMainAreasLoading] = useState(true);
  const [areasLoading, setAreasLoading] = useState(true);
  const [mainAreasError, setMainAreasError] = useState(null);
  const [areasError, setAreasError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const { mainAreas, getMainAreas } = useMainAreas();
  const { areas, getAreas } = useAreas();
  const { createMainAreaAreas, loading: relationLoading, error: relationError } = useMainAreaArea();

  useEffect(() => {
    const loadData = async () => {
      try {
        setMainAreasLoading(true);
        setAreasLoading(true);
        setMainAreasError(null);
        setAreasError(null);

        try {
          await getMainAreas();
        } catch (error) {
          console.error('Error loading main areas:', error);
          setMainAreasError(error);
        } finally {
          setMainAreasLoading(false);
        }

        try {
          await getAreas();
        } catch (error) {
          console.error('Error loading areas:', error);
          setAreasError(error);
        } finally {
          setAreasLoading(false);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  const filteredAreasMadre = mainAreas?.filter(area =>
    area.name.toLowerCase().includes(searchAreaMadre.toLowerCase())
  ) || [];

  const filteredAreas = areas?.filter(area =>
    area.name.toLowerCase().includes(searchArea.toLowerCase())
  ) || [];

  const handleSelectAreaMadre = (area) => {
    setSelectedAreaMadre(area);
  };

  const handleSelectArea = (area) => {
    const id = area._id;
    if (selectedAreasIds.includes(id)) {
      setSelectedAreasIds(selectedAreasIds.filter(selectedId => selectedId !== id));
    } else {
      setSelectedAreasIds([...selectedAreasIds, id]);
    }
  };

  const handleContinuar = () => {
    if (selectedAreaMadre && selectedAreasIds.length > 0) {
      setShowModal(true);
    }
  };

  const handleConfirmarUnion = async () => {
    setIsProcessing(true);
    try {
      console.log("Enviando IDs para crear relaciones:", {
        mainAreaId: selectedAreaMadre._id,
        areaIds: selectedAreasIds
      });

      const result = await createMainAreaAreas(selectedAreaMadre._id, selectedAreasIds);

      console.log("Relaciones creadas exitosamente:", result);

      alert(`Se crearon ${result.createdRelations?.length ?? 0} relaciones exitosamente`);

      setShowModal(false);

      setSelectedAreaMadre(null);
      setSelectedAreasIds([]);

      setTimeout(() => onCancel(), 1000);
    } catch (error) {
      console.error("Error al crear las relaciones:", error);
      alert(`Error al crear las relaciones. Por favor intenta de nuevo. Detalles: ${error.message || error}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelarUnion = () => {
    setShowModal(false);
  };

  const selectedAreas = areas?.filter(area => selectedAreasIds.includes(area._id)) || [];

  const retryMainAreas = async () => {
    setMainAreasLoading(true);
    setMainAreasError(null);
    try {
      await getMainAreas();
    } catch (error) {
      console.error('Error retrying main areas:', error);
      setMainAreasError(error);
    } finally {
      setMainAreasLoading(false);
    }
  };

  const retryAreas = async () => {
    setAreasLoading(true);
    setAreasError(null);
    try {
      await getAreas();
    } catch (error) {
      console.error('Error retrying areas:', error);
      setAreasError(error);
    } finally {
      setAreasLoading(false);
    }
  };

  const renderMainAreasContent = () => {
    if (mainAreasLoading) {
      return <LoadingState message="Cargando áreas madre..." />;
    }

    if (mainAreasError) {
      return (
        <ErrorState
          message={mainAreasError?.message || "Error al cargar las áreas madre"}
          onRetry={retryMainAreas}
        />
      );
    }

    if (!mainAreas || mainAreas.length === 0) {
      return (
        <EmptyState
          message="No hay áreas madre disponibles"
          description="Necesitas crear áreas madre antes de poder hacer relaciones"
          icon={Pyramid}
          iconColor="text-yellow-400"
        />
      );
    }

    return (
      <div className="space-y-3">
        {filteredAreasMadre.map((area) => (
          <SelectionCard
            key={area._id}
            area={area}
            isSelected={selectedAreaMadre?._id === area._id}
            onSelect={handleSelectAreaMadre}
            type="madre"
          />
        ))}
      </div>
    );
  };

  const renderAreasContent = () => {
    if (areasLoading) {
      return <LoadingState message="Cargando áreas..." />;
    }

    if (areasError) {
      return (
        <ErrorState
          message={areasError?.message || "Error al cargar las áreas"}
          onRetry={retryAreas}
        />
      );
    }

    if (!areas || areas.length === 0) {
      return (
        <EmptyState
          message="No hay áreas disponibles"
          description="Necesitas crear áreas antes de poder hacer relaciones"
          icon={Triangle}
          iconColor="text-blue-400"
        />
      );
    }

    return (
      <div className="space-y-3">
        {filteredAreas.map((area) => (
          <SelectionCard
            key={area._id}
            area={area}
            isSelected={selectedAreasIds.includes(area._id)}
            onSelect={handleSelectArea}
            type="area"
          />
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 relative">
      <div className="flex flex-col items-start mb-10">
        <CustomHeading
          text="Juntar Área con Área Madre"
          color="#01426A"
        />
        <br />

        {relationError && (
          <div className="w-full mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
            Error: {relationError}
          </div>
        )}

        <div className="w-full">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Área madre */}
            <div className="w-full md:w-1/2 bg-white rounded-3xl shadow-md p-6">
              <div className="flex items-center mb-4 gap-4">
                <h3 style={{ color: '#01426A' }} className="text-lg font-medium whitespace-nowrap">Área madre</h3>
                {!mainAreasLoading && !mainAreasError && mainAreas && mainAreas.length > 0 && (
                  <div className="relative search-container flex-1">
                    <input
                      type="text"
                      className="w-full pl-10 pr-4 py-2 border rounded-md outline-none text-sm bg-white"
                      placeholder="Buscar"
                      style={{ color: '#01426A' }}
                      value={searchAreaMadre}
                      onChange={(e) => setSearchAreaMadre(e.target.value)}
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  </div>
                )}
              </div>
              <div className="h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {renderMainAreasContent()}
              </div>
            </div>

            {/* Área */}
            <div className="w-full md:w-1/2 bg-white rounded-3xl shadow-md p-6">
              <div className="flex items-center mb-4 gap-4">
                <h3 style={{ color: '#01426A' }} className="text-lg font-medium whitespace-nowrap">Área</h3>
                {!areasLoading && !areasError && areas && areas.length > 0 && (
                  <div className="relative search-container flex-1">
                    <input
                      type="text"
                      className="w-full pl-10 pr-4 py-2 border rounded-md outline-none text-sm bg-white"
                      placeholder="Buscar"
                      style={{ color: '#01426A' }}
                      value={searchArea}
                      onChange={(e) => setSearchArea(e.target.value)}
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  </div>
                )}
              </div>
              <div className="h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {renderAreasContent()}
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-center mt-10 gap-4">
            <Button type="button" onClick={onCancel} disabled={isProcessing} variant="btn_secondary">
              Cancelar
            </Button>
            <Button onClick={handleContinuar} disabled={!selectedAreaMadre || selectedAreasIds.length === 0 || isProcessing || relationLoading} variant="btn_primary">
              {isProcessing || relationLoading ? 'Procesando...' : 'Continuar'}
            </Button>
          </div>

          {/* Modal de confirmación */}
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-transparent backdrop-blur-md" style={{ backdropFilter: 'blur(8px)' }}></div>
              <div className="bg-white rounded-3xl shadow-lg p-8 w-[500px] mx-4 z-10">
                <h3 className="text-lg font-medium text-center mb-6">Estás a punto de unir las siguientes áreas</h3>

                <div className="mb-6">
                  <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-4 mb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Pyramid size={20} className="text-yellow-500" strokeWidth={1.5} />
                      <span className="text-sm font-medium text-yellow-700">Área Madre:</span>
                    </div>
                    <span className="text-base font-semibold text-yellow-800">{selectedAreaMadre?.name}</span>
                  </div>

                  <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Triangle size={20} className="text-blue-500" strokeWidth={1.5} />
                      <span className="text-sm font-medium text-blue-700">Áreas seleccionadas ({selectedAreas.length}):</span>
                    </div>
                    <div className="space-y-1">
                      {selectedAreas.map((area, index) => (
                        <div key={area._id} className="text-sm text-blue-800">
                          {index + 1}. {area.name}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 text-center mb-6">
                  Se crearán {selectedAreas.length} relación(es) independiente(s). Se les notificará a todos los integrantes de esta acción.
                </p>

                <div className="flex justify-center gap-3">
                <Button type="button" onClick={handleCancelarUnion} disabled={isProcessing} variant="btn_secondary">
                    Cancelar
                  </Button>
                  <Button onClick={handleConfirmarUnion} disabled={isProcessing} variant="btn_primary">
                    {isProcessing ? 'Procesando...' : 'Aceptar'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JuntarAreaMadre;