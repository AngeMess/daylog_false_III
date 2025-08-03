import React from 'react';
import { Search, CircleHelp, Plus, Users } from 'lucide-react';
import FilterButton from '../../../../components/ui/FilterButton';
import DetalleEquipo from './WorkTeamDetails';
import AddWorkTeam from './AddWorkTeam';
import CustomHeading from '../../../../components/Titles/TitleH1';
import { SearchComponent } from '../../../../components/Search';
import { Button } from '../../../../components/Buttons';
import { LoadingState, ErrorState, EmptyState } from '../../../../components/ui/stateHandler';
import StatisticCard from '../../components/WorkTeamCards/StatisticCard'; 
import TeamCard from '../../../../components/CardsWorkTeam/TeamCard'; 
import './WorkTeam.css';
import useWorkTeamPage from './hooks/useWorkTeamPage';

/**
 * Página principal de gestión de Grupos de Trabajo.
 * Utiliza el hook useWorkTeamPage para manejar la lógica de UI y estados.
 */
export default function GruposTrabajo() {
  // Hook personalizado para toda la lógica de la página
  const {
    searchTerm,
    setSearchTerm,
    selectedStatus,
    selectedEquipoId,
    showAddWorkTeam,
    workTeams,
    loading,
    error,
    getAreaName,
    filteredEquipos,
    showTeamDetail,
    handleRetry,
    handleVolver,
    handleCloseAddWorkTeam,
    handleEstadoSelect,
    handleClearSearch,
    handleCreateTeam
  } = useWorkTeamPage();

  if (showAddWorkTeam) {
    return <AddWorkTeam onClose={handleCloseAddWorkTeam} />;
  }

  if (selectedEquipoId) {
    return (
      <DetalleEquipo
        equipoId={selectedEquipoId}
        onVolver={handleVolver}
        onTeamUpdated={handleRetry}
      />
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
        <div className="acciones-container flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex flex-col sm:flex-row items-stretch gap-4 w-full sm:w-auto">
            {/* Filtro de estado */}
            <FilterButton
              label="Estado"
              icon={CircleHelp}
              options={[
                { value: 'habilitado', label: 'Habilitado' },
                { value: 'deshabilitado', label: 'Deshabilitado' }
              ]}
              onSelect={handleEstadoSelect}
              selectedValue={selectedStatus}
              title="Estado"
              className="w-full sm:w-auto flex-grow"
              dropdownClassName="w-full max-w-xs sm:max-w-none"
            />
            {/* Botón crear - versión móvil */}
            <Button variant="btn_primary" className="sm:hidden w-full" onClick={handleCreateTeam}>
              <Plus size={16} />
              Crear equipo
            </Button>
          </div>
          <div className="spacer flex-grow"></div>
          <div className="relative w-full sm:w-auto">
            <SearchComponent
              type="text"
              placeholder={`Buscar eq. por nombre`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>
      </div>
      {/* Estados de carga, error y vacío */}
      {loading && workTeams.length === 0 && (
        <LoadingState message="Cargando equipos de trabajo..." />
      )}
      {error && (
        <ErrorState
          message={error}
          onRetry={handleRetry}
          showRetryButton={true}
        />
      )}
      {/* Contenido principal */}
      {!loading && !error && (
        <>
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatisticCard
              value={workTeams.filter(t => selectedStatus === 'habilitado' ? t.isActive : !t.isActive).length}
              label={`Equipos ${selectedStatus === 'habilitado' ? 'habilitados' : 'deshabilitados'}`}
              valueColor={selectedStatus === 'habilitado' ? 'text-green-600' : 'text-red-600'}
              backgroundColor={selectedStatus === 'habilitado' ? 'bg-green-50' : 'bg-red-50'}
              borderColor={selectedStatus === 'habilitado' ? 'border-green-200' : 'border-red-200'}
            />
            <StatisticCard
              value={filteredEquipos.reduce((total, team) => total + (team.employees?.length || 0), 0)}
              label="Total miembros"
              valueColor="text-blue-600"
            />
            <StatisticCard
              value={filteredEquipos.length}
              label="Equipos mostrados"
              valueColor="text-orange-600"
            />
          </div>
          {workTeams.length === 0 && (
            <EmptyState
              message="¡Crea tu primer equipo!"
              description="Comienza organizando tu trabajo en equipos eficientes"
              icon={Users}
              iconColor="text-blue-500"
              actionButton={
                <Button variant="btn_primary" onClick={handleCreateTeam}>
                  <Plus size={16} className="mr-2" />
                  Crear equipo
                </Button>
              }
            />
          )}
          {filteredEquipos.length === 0 && workTeams.length > 0 && (
            <EmptyState
              message={`No se encontraron equipos ${selectedStatus === 'habilitado' ? 'habilitados' : 'deshabilitados'}`}
              description={
                searchTerm
                  ? `Intenta ajustar los criterios de búsqueda para equipos ${selectedStatus === 'habilitado' ? 'habilitados' : 'deshabilitados'}`
                  : `No hay equipos de trabajo ${selectedStatus === 'habilitado' ? 'habilitados' : 'deshabilitados'} registrados`
              }
              icon={Search}
              iconColor="text-gray-500"
              actionButton={
                searchTerm ? (
                  <Button variant="btn_secondary" onClick={handleClearSearch}>
                    Limpiar búsqueda
                  </Button>
                ) : null
              }
            />
          )}
          {filteredEquipos.length > 0 && (
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
        </>
      )}
    </div>
  );
}