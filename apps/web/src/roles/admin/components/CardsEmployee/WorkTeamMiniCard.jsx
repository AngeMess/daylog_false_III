import React from 'react';

export default function WorkTeamMiniCard({ team }) {
  if (!team) return null;

  return (
    <div key={team._id} className="bg-gray-50 rounded-lg p-4 border border-gray-100 hover:shadow-md transition-shadow">
      <h3 className="font-medium text-[#194167] text-base">{team.name}</h3>
      <p className="text-sm text-gray-600 mt-1">{team.teamType}</p>
      
      {(team.mainArea || team.subArea) && (
        <p className="text-xs text-gray-500 mt-2">
          <span className="font-medium">Área:</span> {team.mainArea} 
          {team.subArea && ` - ${team.subArea}`}
        </p>
      )}
      
      <p className="text-xs text-gray-500 mt-1">
        <span className="font-medium">Supervisor:</span> {team.supervisorName}
      </p>
    </div>
  );
}