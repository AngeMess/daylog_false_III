import { useState, useEffect, useCallback } from 'react';
import useWorkTeam from '../../hooks/useWorkTeam';
import TeamDetailHeader from '../../components/CardsWorkTeam/TeamDetailHeader'; 
import TeamInfoCard from '../../../../components/CardsWorkTeam/TeamInfoCard'; 
import TeamMembersTable from '../../../../components/CardsWorkTeam/TeamMembersTable';
import { LoadingState, ErrorState, EmptyState } from '../../../../components/ui/stateHandler'; // Importar los componentes de estado  

export default function DetalleEquipo({ equipoId, onVolver }) {
  const [equipo, setEquipo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    areas,
    fetchAreas,
  } = useWorkTeam();

  // Función memoizada para obtener el nombre del área
  const getAreaName = useCallback((mainAreaAreaData) => {
    if (!mainAreaAreaData) return 'Sin área asignada';

    // Si los datos ya vienen poblados del backend (como objeto)
    if (typeof mainAreaAreaData === 'object' && mainAreaAreaData !== null) {
      const mainAreaName = mainAreaAreaData.mainArea?.name || 'Área Principal';
      const areaName = mainAreaAreaData.area?.name || 'Subárea';
      return `${mainAreaName} - ${areaName}`;
    }

    // Si solo viene el ID (como string), buscar en areas
    if (typeof mainAreaAreaData === 'string' && areas.length > 0) {
      const area = areas.find(area => area._id === mainAreaAreaData);
      if (area) {
        const mainAreaName = area.mainArea?.name || 'Área Principal';
        const areaName = area.area?.name || 'Subárea';
        return `${mainAreaName} - ${areaName}`;
      }
    }

    return 'Área no encontrada';
  }, [areas]);

  // Función para cargar detalles del equipo
  const fetchTeamDetails = useCallback(async () => {
    if (!equipoId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`http://localhost:3000/api/workteams/${equipoId}`);
      if (!response.ok) {
        throw new Error('Error al obtener los detalles del equipo');
      }

      const teamData = await response.json();
      console.log('Datos del equipo obtenidos:', teamData);
      console.log('mainAreaArea del equipo:', teamData.mainAreaArea);

      setEquipo(teamData);
    } catch (err) {
      console.error('Error al cargar detalles del equipo:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [equipoId]);

  // Función para reintentar la carga
  const handleRetry = useCallback(() => {
    fetchTeamDetails();
    if (areas.length === 0) {
      fetchAreas();
    }
  }, [fetchTeamDetails, fetchAreas, areas.length]);

  // Efecto para cargar áreas
  useEffect(() => {
    const loadAreas = async () => {
      if (areas.length === 0) {
        console.log('Cargando áreas...');
        await fetchAreas();
      }
    };
    loadAreas();
  }, [areas.length, fetchAreas]);

  // Efecto para cargar detalles del equipo
  useEffect(() => {
    fetchTeamDetails();
  }, [fetchTeamDetails]);

  const handleGenerateReport = () => {
    console.log('Generar Reporte button clicked. Functionality to be added.');
    alert('Funcionalidad de generar reporte aún no implementada.');
  };

  // Estado de carga
  if (loading) {
    return (
      <div className="p-6 w-full font-['Montserrat'] min-h-screen">
        <LoadingState message="Cargando datos del equipo..." />
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div className="p-6 w-full font-['Montserrat'] min-h-screen">
        <ErrorState 
          message={error}
          onRetry={handleRetry}
          showRetryButton={true}
        />
      </div>
    );
  }

  // Estado cuando no se encuentra el equipo
  if (!equipo) {
    return (
      <div className="p-6 w-full font-['Montserrat'] min-h-screen">
        <EmptyState 
          message="No se encontró el equipo solicitado"
          description="El equipo que buscas no existe o ha sido eliminado."
          icon={() => <div className="text-6xl">🔍</div>}
          actionButton={
            <button
              onClick={onVolver}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Volver a la lista
            </button>
          }
        />
      </div>
    );
  }

  return (
    <div className="p-6 w-full font-['Montserrat'] min-h-screen">
      {/* Encabezado con botones de Volver y Generar Reporte */}
      <TeamDetailHeader
        onVolver={onVolver}
        onGenerateReport={handleGenerateReport}
      />

      {/* Tarjeta con la información general del equipo */}
      <TeamInfoCard equipo={equipo} getAreaName={getAreaName} />

      {/* Tabla de miembros del equipo */}
      {equipo.employees && equipo.employees.length > 0 ? (
        <TeamMembersTable employees={equipo.employees} />
      ) : (
        <div className="mt-6">
          <EmptyState 
            message="No hay miembros en este equipo"
            description="Este equipo no tiene empleados asignados actualmente."
            icon={() => <div className="text-6xl">👥</div>}
          />
        </div>
      )}
    </div>
  );
}