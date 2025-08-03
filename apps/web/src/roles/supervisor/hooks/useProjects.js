// src/hooks/useProjects.js
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/authContext'; // Asumiendo que useAuth está en src/context/authContext.js
import { toast } from 'react-hot-toast';

export const useProjects = () => {
  const { cuscaId, isLoggedIn } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = useCallback(async () => {
    if (!isLoggedIn || !cuscaId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // CAMBIO CLAVE AQUÍ: Añadir '/proyect' al path
      const response = await fetch(`http://localhost:3000/api/proyect/proyects/supervisor/${cuscaId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Aquí podrías añadir el token de autorización si tus APIs lo requieren
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });

      if (!response.ok) {
        // Intentar parsear el error si no es un 404 HTML
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
        } else {
          // Si no es JSON, es probable que sea HTML (como el 404)
          const textError = await response.text();
          console.error("Server responded with non-JSON:", textError);
          throw new Error(`Error ${response.status}: ${response.statusText}. Respuesta no es JSON.`);
        }
      }

      const data = await response.json();
      setProjects(data);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError(err.message);
      toast.error(`Error al cargar proyectos: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [cuscaId, isLoggedIn]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return { projects, loading, error, refreshProjects: fetchProjects };
};