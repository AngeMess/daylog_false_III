// src/roles/employee/hooks/useEmployeeProjects.js
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/authContext';

export const useEmployeeProjects = () => {
  const { user, cuscaId } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BASE_BACKEND_URL = 'http://localhost:3000';

  useEffect(() => {
    const fetchEmployeeProjects = async () => {
      console.log("DEBUG: Iniciando búsqueda de proyectos para cuscaId:", cuscaId);

      if (!user || !cuscaId) {
        setLoading(false);
        setError(!user ? "Usuario no autenticado" : "CuscaId no disponible");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // PASO 1: Obtener equipos de trabajo del empleado
        console.log("PASO 1: Obteniendo equipos de trabajo...");
        const workTeamsResponse = await fetch(
          `http://localhost:3000/api/workteams/employee-by-cusca/${cuscaId}`, 
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
          }
        );

        if (!workTeamsResponse.ok) {
          throw new Error(`Error al obtener equipos de trabajo: ${workTeamsResponse.status}`);
        }

        const employeeWorkTeams = await workTeamsResponse.json();
        console.log("DEBUG: Equipos de trabajo obtenidos:", employeeWorkTeams);

        if (!employeeWorkTeams || employeeWorkTeams.length === 0) {
          console.log("DEBUG: El empleado no está en ningún equipo");
          setProjects([]);
          setLoading(false);
          return;
        }

        // PASO 2: Extraer IDs de los equipos
        const workTeamIds = employeeWorkTeams.map(team => team._id);
        console.log("DEBUG: IDs de equipos extraídos:", workTeamIds);

        // PASO 3: Obtener proyectos por equipos de trabajo
        console.log("PASO 2: Obteniendo proyectos por equipos...");
        const projectsResponse = await fetch(
          `http://localhost:3000/api/proyect/by-workteams`, 
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ workTeamIds })
          }
        );

        console.log("DEBUG: Status de respuesta proyectos:", projectsResponse.status);

        if (!projectsResponse.ok) {
          const errorText = await projectsResponse.text();
          console.error("DEBUG: Error response:", errorText);
          throw new Error(`Error al obtener proyectos: ${projectsResponse.status} - ${errorText}`);
        }

        const projectsData = await projectsResponse.json();
        console.log("DEBUG: Proyectos obtenidos:", projectsData);
        
        setProjects(Array.isArray(projectsData) ? projectsData : []);

      } catch (err) {
        console.error('DEBUG: Error completo:', err);
        setError(`${err.message}`);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    if (user && cuscaId) {
      fetchEmployeeProjects();
    } else if (user === null) {
      setLoading(false);
      setError("Usuario no autenticado");
    }
  }, [user, cuscaId]);

  return { projects, loading, error };
};