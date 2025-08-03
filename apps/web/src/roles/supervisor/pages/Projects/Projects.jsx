// src/pages/supervisor/Projects.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomHeading from '../../../../components/Titles/TitleH1';
import { Filter, Search } from 'lucide-react';
import { SearchComponent } from "../../../../components/Search";
import { useProjects } from '../../hooks/useProjects';
import FilterButton from '../../../../components/ui/FilterButton';
import ProjectCard from '../../components/ProjectCard';

export default function Projects() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const { projects, loading, error, refreshProjects } = useProjects();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Cargando proyectos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Error: {error}</p>
        <button onClick={refreshProjects} className="ml-4 px-4 py-2 bg-[#01426A] text-white rounded-md">Reintentar</button>
      </div>
    );
  }

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.proyectName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || project.state === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const filterOptions = [
    { value: 'all', label: 'Todos' },
    { value: 'En proceso', label: 'En proceso' },
    { value: 'Pendiente', label: 'Pendiente' },
    { value: 'Finalizado', label: 'Finalizado' },
  ];

  return (
    <div className="p-6 min-h-screen">
      <CustomHeading level={1} className="text-[#01426A] mb-6">
        Proyectos Asignados
      </CustomHeading>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center space-x-2">
          <FilterButton
            label="Filtrar"
            icon={Filter}
            options={filterOptions}
            onSelect={setSelectedFilter}
            selectedValue={selectedFilter}
            title="Filtrar por estado"
          />
          <SearchComponent
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholder="Buscar proyectos..."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              // PASO CLAVE: Pasa el ID del proyecto a la ruta de detalle
              onClick={() => navigate(`/supervisor/proyectos/detalle-proyecto/${project._id}`)}
            />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">No se encontraron proyectos asignados a este supervisor.</p>
        )}
      </div>
    </div>
  );
}