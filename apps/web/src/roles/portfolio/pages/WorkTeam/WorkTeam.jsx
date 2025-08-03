// WorkTeam.jsx
import React from 'react';
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import DetalleEquipo from './DetalleEquipo';
import { useNavigate } from 'react-router-dom';
import useWorkTeam from '../../hooks/useWorkTeam';
import CustomHeading from '../../../../components/Titles/TitleH1';
import { SearchComponent } from '../../../../components/Search';
import BestWorkTeamCards from '../../components/CardsWorkTeam/BestWorkTeamCards';
import TeamCard from '../../../../components/CardsWorkTeam/TeamCard';
import { LoadingState, ErrorState, EmptyState } from '../../../../components/ui/stateHandler';
import './WorkTeam.css'

export default function GruposTrabajo() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEquipoId, setSelectedEquipoId] = useState(null);

  const {
    workTeams,
    loading,
    error,
    fetchWorkTeams,
    areas,
    fetchAreas,
    getAreaName
  } = useWorkTeam();

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchWorkTeams();
    fetchAreas();
  }, []);

  // Filtrar equipos basado en la búsqueda y ahora solo por habilitados
  const filteredEquipos = workTeams.filter((equipo) => {
    const areaName = getAreaName(equipo.mainAreaArea);

    // Solo mostrar equipos habilitados
    const matchesStatus = equipo.isActive;

    // Filtrar por búsqueda
    const matchesSearch =
      equipo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipo.teamType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      areaName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipo.supervisor?.fullName?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const showTeamDetail = (equipoId) => {
    console.log('Mostrando detalles del equipo ID:', equipoId);
    setSelectedEquipoId(equipoId);
  };

  // SOLUCIÓN 1: Modificar handleVolver para recargar datos
  const handleVolver = () => {
    setSelectedEquipoId(null);
    // Recargar los datos cuando se vuelve de DetalleEquipo
    fetchWorkTeams();
    fetchAreas();
  };

  // Función para reintentar la carga de datos
  const handleRetry = () => {
    fetchWorkTeams();
    fetchAreas();
  };

  if (selectedEquipoId) {
    // SOLUCIÓN 2: Pasar callback de actualización a DetalleEquipo
    return (
      <DetalleEquipo
        equipoId={selectedEquipoId}
        onVolver={handleVolver}
        onTeamUpdated={() => {
          fetchWorkTeams();
          fetchAreas();
        }}
      />
    );
  }

  // Estado de carga inicial
  if (loading && workTeams.length === 0) {
    return (
      <div className="grupos-trabajo-container p-6 w-full font-['Montserrat']">
        <LoadingState message="Cargando equipos de trabajo..." />
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div className="grupos-trabajo-container p-6 w-full font-['Montserrat']">
        <ErrorState 
          message={error} 
          onRetry={handleRetry}
          showRetryButton={true}
        />
      </div>
    );
  }

  return (
    <div className="grupos-trabajo-container p-4 sm:p-6 w-full font-['Montserrat']">
      <div className="mb-6">
        <CustomHeading
          text="Grupos de Trabajo"
          color="#01426A"
        />
        <br />
      </div>

      {/* Sección responsive para clasificación y búsqueda */}
      <div className="mb-8">
        {/* Desktop (769px o más): lado a lado */}
        <div className="hidden lg:flex justify-between items-center">
          <h2 className="text-xl font-semibold flex items-center" style={{ color: '#01426A' }}>
            <span className="bg-yellow-400 text-blue-900 px-3 py-1 rounded-full text-lg font-bold mr-3 shadow-md">🏆</span>
            Clasificación: Mejores Grupos de Trabajo
          </h2>
          <div className="relative">
            <SearchComponent
              type="text"
              placeholder="Buscar eq. por nombre"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>

        {/* Tablet (431px-768px): búsqueda arriba, clasificación abajo */}
        <div className="hidden sm:block lg:hidden">
          <div className="relative mb-4">
            <SearchComponent
              type="text"
              placeholder="Buscar eq. por nombre"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
          <h2 className="text-xl font-semibold flex items-center" style={{ color: '#01426A' }}>
            <span className="bg-yellow-400 text-blue-900 px-3 py-1 rounded-full text-lg font-bold mr-3 shadow-md">🏆</span>
            Clasificación: Mejores Grupos de Trabajo
          </h2>
        </div>

        {/* Mobile (430px o menos): búsqueda arriba, clasificación abajo */}
        <div className="block sm:hidden">
          <div className="relative mb-4">
            <SearchComponent
              type="text"
              placeholder="Buscar eq. por nombre"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          </div>
          <h2 className="text-base font-semibold flex items-center" style={{ color: '#01426A' }}>
            <span className="bg-yellow-400 text-blue-900 px-2 py-1 rounded-full text-sm font-bold mr-2 shadow-md">🏆</span>
            Clasificación: Mejores Grupos de Trabajo
          </h2>
        </div>
      </div>

      <BestWorkTeamCards />

      <br />
      <br />

      {/* Mostrar estado vacío cuando no hay equipos */}
      {workTeams.length === 0 && !loading ? (
        <EmptyState 
          message="¡No hay equipos para mostrar!"
          description="No se han registrado equipos de trabajo habilitados."
          icon={() => <div className="text-6xl">👥</div>}
        />
      ) : filteredEquipos.length === 0 && workTeams.length > 0 ? (
        <EmptyState 
          message="No se encontraron equipos habilitados"
          description={searchTerm 
            ? "Intenta ajustar los criterios de búsqueda para equipos habilitados" 
            : "No hay equipos de trabajo habilitados registrados"
          }
          icon={() => <div className="text-6xl">🔍</div>}
          actionButton={searchTerm ? (
            <button
              onClick={() => setSearchTerm('')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Limpiar búsqueda
            </button>
          ) : null}
        />
      ) : (
        /* Grid de equipos - Responsive */
        <div className="equipos-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredEquipos.map((equipo) => (
            <TeamCard
              key={equipo._id}
              equipo={equipo}
              areaName={getAreaName(equipo.mainAreaArea)}
              onClick={() => showTeamDetail(equipo._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}