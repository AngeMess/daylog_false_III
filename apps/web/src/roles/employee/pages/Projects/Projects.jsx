// src/roles/employee/pages/Projects/Projects.jsx
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmployeeProjects } from '../../hooks/useEmployeeProjects ';
import { useAuth } from '../../../../context/authContext';

// Componentes UI
import CustomHeading from '../../../../components/Titles/TitleH1';
import { SearchComponent } from "../../../../components/Search";

export default function Projects() {
  const navigate = useNavigate();
  const { user, cuscaId } = useAuth();
  const { projects, loading, error } = useEmployeeProjects();

  const [searchTerm, setSearchTerm] = useState('');

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  const filteredProjects = useMemo(() => {
    if (!projects || !Array.isArray(projects)) {
      return [];
    }
    
    if (!searchTerm || !searchTerm.trim()) {
      return projects;
    }
    
    const searchLower = searchTerm.toLowerCase().trim();
    
    return projects.filter(project => {
      // Buscar por nombre del proyecto
      const projectName = project?.proyectName || project?.name || '';
      const nameMatch = projectName.toLowerCase().includes(searchLower);
      
      // Buscar por estado
      const projectStatus = project?.status || '';
      const statusMatch = projectStatus.toLowerCase().includes(searchLower);
      
      // Buscar por descripción
      const projectDescription = project?.description || '';
      const descriptionMatch = projectDescription.toLowerCase().includes(searchLower);
      
      // Buscar por país
      const countryName = project?.country?.name || '';
      const countryMatch = countryName.toLowerCase().includes(searchLower);
      
      // Buscar por supervisor
      const supervisorName = project?.supervisor?.fullName || '';
      const supervisorMatch = supervisorName.toLowerCase().includes(searchLower);
      
      return nameMatch || statusMatch || descriptionMatch || countryMatch || supervisorMatch;
    });
  }, [projects, searchTerm]);

  const handleCardClick = (projectId) => {
    navigate(`/employee/proyectos/detalle-proyecto/${projectId}`);
  };

  const getStatusColor = (status) => {
    const statusMap = {
      'En progreso': { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
      'Completado': { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-300' },
      'Pendiente': { bg: 'bg-[#B0B2B8]', text: 'text-[#505050]', border: 'border-[#B0B2B8]' },
      'Pausado': { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300' },
    };
    return statusMap[status] || statusMap['Pendiente'];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-6"></div>
                  <div className="space-y-3">
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <div className="text-red-600 text-lg font-medium mb-2">Error al cargar proyectos</div>
            <div className="text-red-500">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="w-full">
        {/* Header */}
        <div className="mb-8">
          <CustomHeading level={1} className="text-3xl font-bold text-gray-900 mb-2">
            Mis Proyectos
          </CustomHeading>
          <p className="text-gray-600">Gestiona y visualiza todos tus proyectos asignados</p>
        </div>

        {/* Search Section */}
        <div className="mb-8">
          <div className="max-w-lg">
            <SearchComponent
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              placeholder="Buscar por nombre, estado, país, supervisor..."
              showIcon={true}
              showClearButton={true}
            />
          </div>
          
          {/* Indicador de resultados de búsqueda */}
          {searchTerm && (
            <div className="mt-4 text-sm text-gray-600">
              {filteredProjects.length > 0 ? (
                <span>
                  Se encontraron <span className="font-semibold text-[#194167]">{filteredProjects.length}</span> 
                  {filteredProjects.length === 1 ? ' proyecto' : ' proyectos'} 
                  para "<span className="font-medium">{searchTerm}</span>"
                </span>
              ) : (
                <span className="text-amber-600">
                  No se encontraron proyectos para "<span className="font-medium">{searchTerm}</span>"
                </span>
              )}
            </div>
          )}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => {
              const statusColors = getStatusColor(project.status);
              
              return (
                <div
                  key={project._id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group border border-gray-100 overflow-hidden hover:-translate-y-1"
                  onClick={() => handleCardClick(project._id)}
                >
                  {/* Project Header with gradient */}
                  <div className="relative p-6 pb-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-b border-blue-100">
                    <div className="absolute top-4 right-4">
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold border-2 ${statusColors.bg} ${statusColors.text} ${statusColors.border} backdrop-blur-sm`}>
                        {project.status || 'Pendiente'}
                      </div>
                    </div>
                    
                    {/* Project Name */}
                    <div className="pr-20">
                      <h2 className="text-xl font-bold text-[#194167] transition-colors duration-200 mb-2 leading-tight">
                        {project.proyectName || project.name || 'Proyecto sin nombre'}
                      </h2>
                      
                      {project.description && (
                        <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                          {project.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="p-6 space-y-4">
                    {/* Country & Supervisor Row */}
                    <div className="grid grid-cols-1 gap-4">
                      {/* Country */}
                      {project.country && (
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                            <svg className="w-5 h-5 text-[#667085]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">País</p>
                            <p className="text-gray-900 font-medium">{project.country.name}</p>
                          </div>
                        </div>
                      )}

                      {/* Supervisor */}
                      {project.supervisor && (
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                            <svg className="w-5 h-5 text-[#667085]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Supervisor</p>
                            <p className="text-gray-900 font-medium truncate">{project.supervisor.fullName}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Dates Section */}
                    <div className="border-t border-gray-100 pt-4">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                            <svg className="w-5 h-5 text-[#667085]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Inicio</p>
                            <p className="text-gray-900 font-medium">{formatDate(project.startDate)}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                            <svg className="w-5 h-5 text-[#667085]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Fin</p>
                            <p className="text-gray-900 font-medium">{formatDate(project.finishDate)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Footer */}
                  <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-blue-50 border-t border-gray-100 transition-all duration-300">
                    <div className="flex items-center justify-center text-sm text-gray-700 font-semibold">
                      <span className="hover:text-blue-700 transition-colors duration-200">Ver Detalles</span>
                      <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full">
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron proyectos</h3>
                <p className="text-gray-500">
                  {searchTerm 
                    ? 'Intenta con otros términos de búsqueda' 
                    : 'No tienes proyectos asignados en este momento'
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}