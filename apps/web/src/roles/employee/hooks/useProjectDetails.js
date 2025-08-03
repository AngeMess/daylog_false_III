// src/hooks/useProjectDetails.jsx
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../../context/authContext'; // Ajusta la ruta si es necesario
import axios from 'axios'; // Importa axios

const BASE_BACKEND_URL = 'http://localhost:3000';

// Función auxiliar para formatear fechas
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    try {
        return new Date(dateString).toLocaleDateString('es-ES', options);
    } catch (e) {
        console.error("Error al formatear fecha:", dateString, e);
        return 'Fecha inválida';
    }
};

export function useProjectDetails(projectId) {
    const { user } = useAuth(); // Get user from auth context
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
    const [activityFormData, setActivityFormData] = useState({
        name: '',
        date: '',
        startHour: 8, // Valor por defecto
        startMinute: 0, // Valor por defecto
        finishHour: 17, // Valor por defecto
        finishMinute: 0, // Valor por defecto
        compensatory: false,
        employee: '', // Will be set automatically for non-admins
        description: '',
        state: 'Pendiente'
    });

    // Sincronizar el ID del empleado y el compensatorio por defecto cuando el usuario cambia
    useEffect(() => {
        if (user) {
            setActivityFormData(prev => ({
                ...prev,
                employee: user.role === 'admin' ? '' : user.employeeId || '', // Pre-fill if not admin, otherwise let admin choose
                compensatory: user.role === 'admin' ? prev.compensatory : false, // Solo el admin puede cambiar esto por defecto
            }));
        }
    }, [user]);

    // Función para manejar cambios en el formulario de actividad
    const handleActivityInputChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        setActivityFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    }, []);

    // Función para reiniciar el formulario de actividad
    const resetActivityForm = useCallback(() => {
        setActivityFormData({
            name: '',
            date: '',
            startHour: 8,
            startMinute: 0,
            finishHour: 17,
            finishMinute: 0,
            compensatory: false,
            employee: user?.role === 'admin' ? '' : user?.employeeId || '',
            description: '',
            state: 'Pendiente'
        });
    }, [user]);


    // Función para recargar los detalles del proyecto
    const refetchProjectDetails = useCallback(async () => {
        if (!projectId) return;

        try {
            const response = await axios.get(`${BASE_BACKEND_URL}/api/proyect/${projectId}`, {
                withCredentials: true,
            });

            if (response.status === 200) {
                setProject(response.data);
                console.log("Datos del proyecto recargados:", response.data);
            }
        } catch (error) {
            console.error('Error al recargar proyecto:', error);
            toast.error('Error al recargar el proyecto.');
        }
    }, [projectId]);


    // Efecto para cargar los detalles del proyecto al inicio o cuando el ID del proyecto cambia
    useEffect(() => {
        const fetchProjectDetails = async () => {
            if (!projectId) {
                setLoading(false);
                return;
            }
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(`${BASE_BACKEND_URL}/api/proyect/${projectId}`, {
                    withCredentials: true,
                });

                if (response.status !== 200) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }

                setProject(response.data);
                console.log("Datos del proyecto cargados:", response.data); // Log para verificar fechas
            } catch (err) {
                setError(err.message);
                toast.error(`Error al cargar detalles del proyecto: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchProjectDetails();
    }, [projectId]);


    // Función para manejar el envío del formulario de actividad
    const handleActivitySubmit = async () => {
        if (!user || !projectId) {
            toast.error('Datos de usuario o proyecto no disponibles.');
            return;
        }

        const employeeIdToUse = user.role === 'admin' ? activityFormData.employee : user.employeeId;

        if (!employeeIdToUse) {
            toast.error('ID de empleado no disponible para la actividad.');
            return;
        }

        try {
            const newActivity = {
                name: activityFormData.name,
                date: activityFormData.date, // Asegúrate de que esto sea una fecha válida (e.g., ISO string)
                startHour: activityFormData.startHour,
                startMinute: activityFormData.startMinute,
                finishHour: activityFormData.finishHour,
                finishMinute: activityFormData.finishMinute,
                compensatory: activityFormData.compensatory,
                validated: false, // Por defecto para nuevas actividades
                proyect: projectId,
                employee: employeeIdToUse,
                visible: true, // Por defecto para nuevas actividades
                description: activityFormData.description,
                state: activityFormData.state,
            };

            const response = await axios.post(`${BASE_BACKEND_URL}/api/activity`, newActivity, {
                withCredentials: true,
            });

            if (response.status !== 201) { // 201 Created es un buen código para creación exitosa
                throw new Error(response.data.error || 'Error al crear actividad');
            }

            toast.success('Actividad creada exitosamente!');
            setIsActivityModalOpen(false); // Cierra el modal
            resetActivityForm(); // Reinicia el formulario
            refetchProjectDetails(); // Recarga los detalles del proyecto para actualizar las actividades
        } catch (error) {
            console.error('Error al crear actividad:', error);
            // Mostrar un mensaje de error más específico si el backend lo proporciona
            const errorMessage = error.response?.data?.error || error.message || 'Error al crear la actividad';
            toast.error(`Error al crear actividad: ${errorMessage}`);
        }
    };


    // Función para obtener empleados del equipo de trabajo del proyecto
    const getTeamEmployees = useCallback(() => {
        if (!project?.workTeam?.employees) return [];
        return project.workTeam.employees.filter(emp => emp && emp._id);
    }, [project]);


    return {
        project,
        loading,
        error,
        isActivityModalOpen,
        setIsActivityModalOpen,
        activityFormData,
        handleActivityInputChange,
        handleActivitySubmit,
        resetActivityForm,
        refetchProjectDetails,
        getTeamEmployees,
        loggedInEmployeeId: user?.employeeId,
        isAdmin: user?.role === 'admin',
        formatDate // Exporta la función de formateo de fechas
    };
}