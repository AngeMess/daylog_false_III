// src/hooks/useProjectDetails.js
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';

export const useProjectDetails = (projectId) => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employees, setEmployees] = useState([]);

  const fetchProjectDetails = useCallback(async () => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:3000/api/proyect/${projectId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${localStorage.getItem('token')}` // If authentication is required
        },
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
        } else {
          const textError = await response.text();
          console.error("Server responded with non-JSON:", textError);
          throw new Error(`Error ${response.status}: ${response.statusText}. Respuesta no es JSON.`);
        }
      }

      const data = await response.json();
      setProject(data);

      if (data.workTeam && Array.isArray(data.workTeam.employees)) {
        const formattedEmployees = data.workTeam.employees
          .filter(emp => emp && emp.id)
          .map(emp => {
            const fullName = emp.id.fullName || '';
            const [nombre, ...apellidoParts] = fullName.split(' ');
            const apellido = apellidoParts.join(' ');

            return {
              nombre: nombre,
              apellido: apellido,
              cuscaId: emp.id.cuscaId || '',
              actividades: 0,
              employeeId: emp.id._id || ''
            };
          });
        setEmployees(formattedEmployees);
      } else {
        setEmployees([]);
      }

    } catch (err) {
      console.error(`Error fetching project details for ID ${projectId}:`, err);
      setError(err.message);
      toast.error(`Error al cargar los detalles del proyecto: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const updateProjectWorkTeam = useCallback(async (currentProjectId, newEmployeesArray) => {
    try {
      const projectResponse = await fetch(`http://localhost:3000/api/proyect/${currentProjectId}`); //
      if (!projectResponse.ok) { //
        const errorData = await projectResponse.json(); //
        throw new Error(errorData.message || 'Error al obtener el proyecto para actualizar el equipo de trabajo.'); //
      }
      const currentProjectData = await projectResponse.json(); //

      if (!currentProjectData.workTeam) { //
        toast.error("El proyecto no tiene un equipo de trabajo asignado para actualizar."); //
        return false; //
      }

      const workTeamId = currentProjectData.workTeam._id; //

      const dataToSend = {
        employees: newEmployeesArray.map(emp => ({ id: emp.id || emp._id })) // Ensure correct format
      };

      const response = await fetch(`http://localhost:3000/api/workteams/${workTeamId}`, { //
        method: 'PUT', //
        headers: { //
          'Content-Type': 'application/json', //
        },
        body: JSON.stringify(dataToSend), //
      });

      if (!response.ok) { //
        const errorData = await response.json(); //
        throw new Error(errorData.message || 'Error al actualizar el equipo de trabajo.'); //
      }

      await fetchProjectDetails();
      return true;
    } catch (err) {
      console.error("Error updating project work team:", err);
      toast.error(`Error al actualizar el equipo de trabajo del proyecto: ${err.message}`);
      return false;
    }
  }, [fetchProjectDetails]);

  useEffect(() => {
    fetchProjectDetails();
  }, [fetchProjectDetails]);

  return {
    project,
    employees,
    loading,
    error,
    refreshProjectDetails: fetchProjectDetails,
    setEmployees,
    updateProjectWorkTeam
  };
};