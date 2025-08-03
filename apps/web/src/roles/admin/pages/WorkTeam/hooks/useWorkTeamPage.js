import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useWorkTeam from '../../../hooks/useWorkTeam';

/**
 * Hook personalizado para la lógica de la página principal de equipos de trabajo
 * Maneja búsqueda, filtros, selección de equipo, control de modales y navegación interna.
 */
export default function useWorkTeamPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('habilitado');
  const [selectedEquipoId, setSelectedEquipoId] = useState(null);
  const [showAddWorkTeam, setShowAddWorkTeam] = useState(false);
  const filterMenuRef = useRef(null);

  const {
    workTeams,
    loading,
    error,
    fetchWorkTeams,
    fetchAreas,
    getAreaName
  } = useWorkTeam();

  // Cargar datos al montar el hook
  useEffect(() => {
    fetchWorkTeams();
    fetchAreas();
  }, []);

  // Filtrar equipos basado en la búsqueda y estado seleccionado
  const filteredEquipos = workTeams.filter((equipo) => {
    const areaName = getAreaName(equipo.mainAreaArea);
    const matchesStatus = selectedStatus === 'habilitado' ? equipo.isActive === true : equipo.isActive === false;
    const matchesSearch =
      equipo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipo.teamType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      areaName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipo.supervisor?.fullName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Handlers y helpers
  const showTeamDetail = (equipoId) => setSelectedEquipoId(equipoId);
  const handleRetry = () => { fetchWorkTeams(); fetchAreas(); };
  const handleVolver = () => { setSelectedEquipoId(null); fetchWorkTeams(); fetchAreas(); };
  const handleCloseAddWorkTeam = () => { setShowAddWorkTeam(false); fetchWorkTeams(); };
  const handleEstadoSelect = (estado) => setSelectedStatus(estado);
  const handleClearSearch = () => setSearchTerm('');
  const handleCreateTeam = () => navigate('/admin/grupos/agregar-grupo');

  return {
    searchTerm,
    setSearchTerm,
    selectedStatus,
    setSelectedStatus,
    selectedEquipoId,
    setSelectedEquipoId,
    showAddWorkTeam,
    setShowAddWorkTeam,
    filterMenuRef,
    workTeams,
    loading,
    error,
    fetchWorkTeams,
    fetchAreas,
    getAreaName,
    filteredEquipos,
    showTeamDetail,
    handleRetry,
    handleVolver,
    handleCloseAddWorkTeam,
    handleEstadoSelect,
    handleClearSearch,
    handleCreateTeam
  };
} 