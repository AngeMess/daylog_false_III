// src/roles/employee/pages/ProjectDetail/ProjectsDetails.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';

// Componentes UI
import { Button } from '../../../../components/Buttons';
import {
    ArrowLeft, Calendar, User, Globe, Users, Plus, Layers, Info, Clock, CheckCircle2,
    AlertTriangle, XCircle, Search, FileText, LayoutList
} from 'lucide-react';
import ActivityModal from '../../components/ActivityModal';
import ProjectEmployeesTable from '../../components/ProjectEmployeesTable';

import CustomSubtitle from '../../../../components/Titles/Subtitle';

import { useAuth } from '../../../../context/authContext';
import { useProjectDetails } from '../../hooks/useProjectDetails'; // Importa el nuevo hook

export default function ProjectsDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, cuscaId } = useAuth(); 

    // Usar el nuevo hook para obtener los datos y funciones relacionadas
    const {
        project,
        loading,
        error,
        isActivityModalOpen,
        setIsActivityModalOpen,
        activityFormData,
        handleActivityInputChange,
        handleActivitySubmit,
        getTeamEmployees,
        formatDate 
        // loggedInEmployeeId y isAdmin ya no se extraen si no se pasan al modal
    } = useProjectDetails(id);

   // const getStatusStyles = (status) => { /* ... (código existente) ... */ };
    //const getStatusIcon = (status) => { /* ... (código existente) ... */ };
    //const getPriorityStyles = (priority) => { /* ... (código existente) ... */ };
    //const formatDate = (dateString) => { /* ... (código existente) ... */ };

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen bg-gray-100">Cargando detalles del proyecto...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center min-h-screen bg-red-100 text-red-800">Error: {error}</div>;
    }

    if (!project) {
        return <div className="flex justify-center items-center min-h-screen bg-gray-100">Proyecto no encontrado.</div>;
    }

    const employeesInTeam = project.workTeam?.employees.map(e => e.id).filter(Boolean) || [];

    const employeeActivitiesData = employeesInTeam.map(employee => {
        const activitiesCount = project.activities?.filter(
            activity => activity.assignedTo?._id === employee._id
        ).length || 0;

        return {
            fullName: employee.fullName,
            cuscaId: employee.cuscaId,
            email: employee.email,
            actividades: activitiesCount,
            employeeId: employee._id
        };
    });

    // Obtener empleados del equipo para el modal (aunque ya no se usen en el modal, el hook aún los podría proveer)
    const teamEmployees = getTeamEmployees();

    return (
        <div className="p-6 w-full min-h-screen flex flex-col">
            <div className="flex items-center mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
                >
                    <ArrowLeft size={24} className="text-gray-600" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-[#01426A]">
                        Proyecto: {project.code || project.name}
                    </h1>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white rounded-xl p-6 shadow-sm mb-6"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">{project.proyectName}</h2>
                                <p className="text-gray-500">Código: {project.code}</p>
                            </div>
                            
                            <Button variant="btn_primary" onClick={() => setIsActivityModalOpen(true)}>
                                                            <Plus size={18} />
                                                            Añadir Actividad
                                                        </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-2">Fechas</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <Calendar size={18} className="text-gray-400 mr-2" />
                                        <div>
                                            <p className="text-sm text-gray-500">Fecha de inicio</p>
                                            <p className="font-medium">{formatDate(project.startDate)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <Calendar size={18} className="text-gray-400 mr-2" />
                                        <div>
                                            <p className="text-sm text-gray-500">Fecha de finalización</p>
                                            <p className="font-medium">{formatDate(project.finishDate)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-2">Responsables</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <User size={18} className="text-gray-400 mr-2" />
                                        <div>
                                            <p className="text-sm text-gray-500">Supervisor</p>
                                            <p className="font-medium">{project.supervisor?.fullName || 'No asignado'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <Users size={18} className="text-gray-400 mr-2" />
                                        <div>
                                            <p className="text-sm text-gray-500">Equipo de trabajo</p>
                                            <p className="font-medium">{project.workTeam?.name || 'No asignado'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-2">Ubicación</h3>
                                <div className="flex items-center">
                                    <Globe size={18} className="text-gray-400 mr-2" />
                                    <div>
                                        <p className="text-sm text-gray-500">País</p>
                                        <p className="font-medium">{project.country?.name || 'No especificado'}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-2">Área</h3>
                                <div className="flex items-center">
                                    <Layers size={18} className="text-gray-400 mr-2" />
                                    <div>
                                        <p className="text-sm text-gray-500">Área principal</p>
                                        <p className="font-medium">
                                            {project.mainAreaArea ?
                                                `${project.mainAreaArea.mainArea?.name || ''} - ${project.mainAreaArea.area?.name || ''}` :
                                                'No especificada'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Motion.div>

                    <Motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-white rounded-xl p-6 shadow-sm"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <CustomSubtitle text="Empleados asignados" />
                        </div>
                        <ProjectEmployeesTable employeeActivities={employeeActivitiesData} />
                    </Motion.div>
                </div>

                <div>
                    <Motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="bg-white rounded-xl p-6 shadow-sm mb-6"
                    >
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Estadísticas</h3>
                        <div className="space-y-4 mt-4">
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-500">Total actividades</p>
                                <p className="text-2xl font-bold text-gray-800">
                                    {project.activities ? project.activities.length : 0}
                                </p>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-500">Empleados asignados</p>
                                <p className="text-2xl font-bold text-gray-800">
                                    {employeesInTeam.length}
                                </p>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-500">Visibilidad</p>
                                <p className="text-xl font-bold text-gray-800">
                                    {project.visible ? 'Visible' : 'Oculto'}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {project.visible
                                        ? 'El proyecto es visible para todos los empleados.'
                                        : 'El proyecto está oculto para los empleados.'}
                                </p>
                            </div>
                        </div>
                    </Motion.div>
                </div>
            </div>

            <ActivityModal
                isOpen={isActivityModalOpen}
                onClose={() => setIsActivityModalOpen(false)}
                formData={activityFormData}
                onInputChange={handleActivityInputChange}
                onSubmit={handleActivitySubmit}
                isEditing={false}
                // employees ya no es necesario pasarlo al modal
                // loggedInEmployeeId ya no es necesario pasarlo al modal
                // isAdmin ya no es necesario pasarlo al modal
            />
        </div>
    );
}