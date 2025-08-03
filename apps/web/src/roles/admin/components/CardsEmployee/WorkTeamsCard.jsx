import React, { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import WorkTeamMiniCard from './WorkTeamMiniCard';
import useWorkTeam from '../../hooks/useWorkTeam';

export default function WorkTeamsCard({ employeeId }) {
  const { getWorkTeamsByEmployee } = useWorkTeam();
  const [workTeams, setWorkTeams] = useState([]);
  const [loadingWorkTeams, setLoadingWorkTeams] = useState(false);
  const [workTeamsError, setWorkTeamsError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    
    const loadWorkTeams = async () => {
      if (!employeeId) return;
      
      setLoadingWorkTeams(true);
      setWorkTeamsError(null);
      
      try {
        console.log('Cargando equipos para:', employeeId);
        const teams = await getWorkTeamsByEmployee(employeeId);
        console.log('Equipos cargados:', teams);
        
        if (isMounted) {
          setWorkTeams(Array.isArray(teams) ? teams : []);
        }
      } catch (err) {
        console.error('Error al cargar equipos de trabajo:', err);
        if (isMounted) {
          setWorkTeamsError('No se pudieron cargar los equipos de trabajo');
        }
      } finally {
        if (isMounted) {
          setLoadingWorkTeams(false);
        }
      }
    };
    
    loadWorkTeams();
    
    return () => {
      isMounted = false;
    };
  }, [employeeId, getWorkTeamsByEmployee]);

  const formatTeamData = (team) => {
    if (!team || typeof team !== 'object') return null;
    
    return {
      _id: team._id || '',
      name: team.name || 'Sin nombre',
      teamType: team.teamType || 'Sin tipo',
      mainArea: team.mainAreaArea?.mainArea?.name || 'Sin área',
      subArea: team.mainAreaArea?.area?.name || '',
      supervisorName: team.supervisor?.fullName || 'Sin supervisor'
    };
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm text-[#194167] overflow-hidden">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <Users className="mr-2 h-5 w-5" />
        Equipos de trabajo
      </h2>
      {loadingWorkTeams ? (
        <div className="text-center py-4">
          <p>Cargando equipos...</p>
        </div>
      ) : workTeamsError ? (
        <div className="text-red-500 text-sm">
          {workTeamsError}
        </div>
      ) : workTeams.length > 0 ? (
        <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {workTeams.map((team) => {
              const formattedTeam = formatTeamData(team);
              if (!formattedTeam) return null;
              
              return <WorkTeamMiniCard key={formattedTeam._id} team={formattedTeam} />;
            })}
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-500">No está asignado a ningún equipo</p>
      )}
    </div>
  );
}