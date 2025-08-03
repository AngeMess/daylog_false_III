const ActivityController = {};
import ActivityModel from "../models/Activity.js";
import EmployeeModel from "../models/Employee.js"; // 🔥 NUEVO: Importar modelo Employee
import mongoose from "mongoose";

// ========== MÉTODOS EXISTENTES (sin cambios) ==========

// Obtener todas las actividades
ActivityController.getActivity = async(req, res) => {
    try {
        const activities = await ActivityModel.find()
            .populate('Proyect', 'name')
            .populate('employee', 'fullName cuscaId');
        
        res.status(200).json(activities);
    } catch (error) {
        console.error("Error al obtener actividades:", error);
        res.status(500).json({ 
            message: "Error interno del servidor al obtener actividades", 
            error: error.message 
        });
    }
}

// Insertar nueva actividad
ActivityController.insertActivity = async(req, res) => {
    try {
        const {
            name, 
            date, 
            startHour, 
            startMinute, 
            finishHour, 
            finishMinute, 
            compensatory, 
            validated, 
            proyect, 
            employee, 
            visible, 
            description, 
            state
        } = req.body;

        // Validación de campos requeridos
        if (!name || !date || startHour === undefined || startMinute === undefined || 
            finishHour === undefined || finishMinute === undefined || 
            compensatory === undefined || !proyect || !employee || 
            visible === undefined || !description || !state) {
            return res.status(400).json({ 
                message: "Todos los campos son obligatorios" 
            });
        }

        // Validación de ObjectIds
        if (!mongoose.Types.ObjectId.isValid(proyect)) {
            return res.status(400).json({ 
                message: "ID de proyecto inválido" 
            });
        }

        if (!mongoose.Types.ObjectId.isValid(employee)) {
            return res.status(400).json({ 
                message: "ID de empleado inválido" 
            });
        }

        // Validación de rangos de horas
        if (startHour < 1 || startHour > 24 || finishHour < 1 || finishHour > 24) {
            return res.status(400).json({ 
                message: "Las horas deben estar entre 1 y 24" 
            });
        }

        // Validación de minutos (solo 0 y 30)
        if (![0, 30].includes(startMinute) || ![0, 30].includes(finishMinute)) {
            return res.status(400).json({ 
                message: "Los minutos solo pueden ser 0 o 30" 
            });
        }

        // Validación de tiempo: la hora de fin debe ser posterior a la de inicio
        const startTime = startHour + (startMinute / 60);
        const finishTime = finishHour + (finishMinute / 60);
        
        if (finishTime <= startTime) {
            return res.status(400).json({ 
                message: "La hora de finalización debe ser posterior a la hora de inicio" 
            });
        }

        // Calcular duración automáticamente
        const duration = finishTime - startTime;

        // Validación de longitud de descripción
        if (description.length < 50 || description.length > 350) {
            return res.status(400).json({ 
                message: "La descripción debe tener entre 50 y 350 caracteres" 
            });
        }

        // Validación de estado
        const validStates = ["Pendiente", "En progreso", "Finalizada"];
        if (!validStates.includes(state)) {
            return res.status(400).json({ 
                message: "El estado solo puede ser: Pendiente, En progreso o Finalizada" 
            });
        }

        // Crear nueva actividad
        const newActivity = new ActivityModel({
            name, 
            date, 
            startHour, 
            startMinute, 
            finishHour, 
            finishMinute,
            duration,
            compensatory, 
            validated, 
            Proyect: proyect,
            employee, 
            visible, 
            description, 
            state
        });

        await newActivity.save();

        // 🔥 NUEVO: Actualizar horas semanales del empleado automáticamente
        await updateEmployeeWeeklyHours(employee);

        res.status(200).json({ message: "Actividad guardada exitosamente" });

    } catch (error) {
        console.error("Error al insertar actividad:", error);
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                message: "Error de validación", 
                errors: Object.values(error.errors).map(err => err.message)
            });
        }

        if (error.code === 11000) {
            return res.status(400).json({ 
                message: "Ya existe una actividad con ese nombre" 
            });
        }

        res.status(500).json({ 
            message: "Error interno del servidor al guardar actividad", 
            error: error.message 
        });
    }
}

// Actualizar actividad existente
ActivityController.updateActivity = async(req, res) => {
    try {
        const { id } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ 
                message: "ID de actividad inválido" 
            });
        }

        const {
            name, 
            date, 
            startHour, 
            startMinute, 
            finishHour, 
            finishMinute, 
            compensatory, 
            validated, 
            proyect, 
            employee, 
            visible, 
            description, 
            state
        } = req.body;

        const existingActivity = await ActivityModel.findById(id);
        if (!existingActivity) {
            return res.status(400).json({ 
                message: "Actividad no encontrada" 
            });
        }

        // Validaciones similares al insert (solo para campos que se proporcionan)
        if (proyect && !mongoose.Types.ObjectId.isValid(proyect)) {
            return res.status(400).json({ 
                message: "ID de proyecto inválido" 
            });
        }

        if (employee && !mongoose.Types.ObjectId.isValid(employee)) {
            return res.status(400).json({ 
                message: "ID de empleado inválido" 
            });
        }

        if (startHour !== undefined && (startHour < 1 || startHour > 24)) {
            return res.status(400).json({ 
                message: "La hora de inicio debe estar entre 1 y 24" 
            });
        }

        if (finishHour !== undefined && (finishHour < 1 || finishHour > 24)) {
            return res.status(400).json({ 
                message: "La hora de finalización debe estar entre 1 y 24" 
            });
        }

        if (startMinute !== undefined && ![0, 30].includes(startMinute)) {
            return res.status(400).json({ 
                message: "Los minutos de inicio solo pueden ser 0 o 30" 
            });
        }

        if (finishMinute !== undefined && ![0, 30].includes(finishMinute)) {
            return res.status(400).json({ 
                message: "Los minutos de finalización solo pueden ser 0 o 30" 
            });
        }

        if (description && (description.length < 50 || description.length > 350)) {
            return res.status(400).json({ 
                message: "La descripción debe tener entre 50 y 350 caracteres" 
            });
        }

        if (state && !["Pendiente", "En progreso", "Finalizada"].includes(state)) {
            return res.status(400).json({ 
                message: "El estado solo puede ser: Pendiente, En progreso o Finalizada" 
            });
        }

        // Validar coherencia de tiempo si se proporcionan ambas horas
        const newStartHour = startHour !== undefined ? startHour : existingActivity.startHour;
        const newStartMinute = startMinute !== undefined ? startMinute : existingActivity.startMinute;
        const newFinishHour = finishHour !== undefined ? finishHour : existingActivity.finishHour;
        const newFinishMinute = finishMinute !== undefined ? finishMinute : existingActivity.finishMinute;

        const startTime = newStartHour + (newStartMinute / 60);
        const finishTime = newFinishHour + (newFinishMinute / 60);
        
        if (finishTime <= startTime) {
            return res.status(400).json({ 
                message: "La hora de finalización debe ser posterior a la hora de inicio" 
            });
        }

        // Calcular nueva duración
        const duration = finishTime - startTime;

        // Preparar objeto de actualización
        const updateData = { 
            ...req.body,
            duration
        };

        if (updateData.nname) {
            updateData.name = updateData.nname;
            delete updateData.nname;
        }

        if (proyect) {
            updateData.Proyect = proyect;
            delete updateData.proyect;
        }

        const updatedActivity = await ActivityModel.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true, runValidators: true }
        );

        // 🔥 NUEVO: Actualizar horas semanales del empleado después de actualizar
        const employeeId = employee || existingActivity.employee;
        await updateEmployeeWeeklyHours(employeeId);

        res.status(200).json({ 
            message: "Actividad actualizada exitosamente",
            activity: updatedActivity 
        });

    } catch (error) {
        console.error("Error al actualizar actividad:", error);
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                message: "Error de validación", 
                errors: Object.values(error.errors).map(err => err.message)
            });
        }

        if (error.code === 11000) {
            return res.status(400).json({ 
                message: "Ya existe una actividad con ese nombre" 
            });
        }

        res.status(500).json({ 
            message: "Error interno del servidor al actualizar actividad", 
            error: error.message 
        });
    }
}

// Eliminar actividad
ActivityController.deleteActivity = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ 
                message: "ID de actividad inválido" 
            });
        }

        const activity = await ActivityModel.findById(id);
        if (!activity) {
            return res.status(400).json({ 
                message: "Actividad no encontrada" 
            });
        }

        await ActivityModel.findByIdAndDelete(id);

        // 🔥 NUEVO: Actualizar horas semanales del empleado después de eliminar
        await updateEmployeeWeeklyHours(activity.employee);

        res.status(200).json({ message: "Actividad eliminada exitosamente" });

    } catch (error) {
        console.error("Error al eliminar actividad:", error);
        res.status(500).json({ 
            message: "Error interno del servidor al eliminar actividad", 
            error: error.message 
        });
    }
}

// ========== NUEVOS ENDPOINTS PARA GESTIÓN DE HORAS ==========

// 🔥 NUEVO: Obtener horas diarias de un empleado (día actual)
ActivityController.getDailyHours = async (req, res) => {
    try {
        const { employeeId } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(employeeId)) {
            return res.status(400).json({ 
                message: "ID de empleado inválido" 
            });
        }

        // Obtener fecha actual (solo día, sin hora)
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

        // Buscar actividades del empleado para hoy
        const activities = await ActivityModel.find({
            employee: new mongoose.Types.ObjectId(employeeId),
            date: { $gte: startOfDay, $lte: endOfDay },
            visible: true
        }).populate('Proyect', 'name');

        // Calcular total de horas del día
        const totalHours = activities.reduce((sum, activity) => sum + (activity.duration || 0), 0);

        // Separar horas normales y compensatorias
        const compensatoryHours = activities
            .filter(activity => activity.compensatory)
            .reduce((sum, activity) => sum + (activity.duration || 0), 0);
        
        const regularHours = totalHours - compensatoryHours;

        res.status(200).json({
            employeeId,
            date: startOfDay.toISOString().split('T')[0],
            dayOfWeek: today.getDay() === 0 ? 7 : today.getDay(),
            totalHours: Math.round(totalHours * 100) / 100,
            regularHours: Math.round(regularHours * 100) / 100,
            compensatoryHours: Math.round(compensatoryHours * 100) / 100,
            activitiesCount: activities.length,
            activities: activities.map(activity => ({
                id: activity._id,
                name: activity.name,
                duration: activity.duration,
                project: activity.Proyect?.name || 'Sin proyecto',
                compensatory: activity.compensatory,
                state: activity.state
            }))
        });

    } catch (error) {
        console.error("Error al obtener horas diarias:", error);
        res.status(500).json({ 
            message: "Error interno del servidor al obtener horas diarias", 
            error: error.message 
        });
    }
};

// 🔥 NUEVO: Obtener horas semanales de un empleado (semana actual)
ActivityController.getWeeklyHours = async (req, res) => {
    try {
        const { employeeId } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(employeeId)) {
            return res.status(400).json({ 
                message: "ID de empleado inválido" 
            });
        }

        // Calcular semana actual (lunes a domingo)
        const today = new Date();
        const startOfWeek = getStartOfWeek(today);
        const endOfWeek = getEndOfWeek(today);

        // Buscar actividades de la semana
        const activities = await ActivityModel.find({
            employee: new mongoose.Types.ObjectId(employeeId),
            date: { $gte: startOfWeek, $lte: endOfWeek },
            visible: true
        }).populate('Proyect', 'name').sort({ date: 1 });

        // Calcular total de horas semanales
        const totalWeeklyHours = activities.reduce((sum, activity) => sum + (activity.duration || 0), 0);

        // 🔥 CLASIFICAR HORAS SEGÚN LAS REGLAS DE NEGOCIO
        let normalHours = 0;
        let extraHours = 0; 
        let compensatoryHours = 0;

        if (totalWeeklyHours <= 40) {
            normalHours = totalWeeklyHours;
        } else if (totalWeeklyHours <= 44) {
            normalHours = 40;
            extraHours = totalWeeklyHours - 40;
        } else {
            normalHours = 40;
            extraHours = 4;
            compensatoryHours = totalWeeklyHours - 44;
        }

        // 🔥 ACTUALIZAR CAMPOS DEL EMPLEADO
        await EmployeeModel.findByIdAndUpdate(employeeId, {
            weeklyHours: Math.round(totalWeeklyHours * 100) / 100,
            extraWeeklyHours: Math.round(extraHours * 100) / 100,
            compensatoryHours: Math.round(compensatoryHours * 100) / 100
        });

    } catch (error) {
        console.error("Error al actualizar horas semanales del empleado:", error);
    }
}

// Funciones helper existentes
function getStartOfWeek(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Lunes como primer día
    return new Date(d.setDate(diff));
}

function getEndOfWeek(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? 0 : 7); // Domingo como último día
    return new Date(d.setDate(diff));
}

function getDayName(date) {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return days[new Date(date).getDay()];
}

function getMonthName(monthIndex) {
    const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return months[monthIndex];
}

// 🔥 NUEVA FUNCIÓN HELPER: Agrupar actividades por día
function groupActivitiesByDay(activities) {
    const dailyGroups = {};
    const weekDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    
    // Inicializar todos los días con 0 horas
    weekDays.forEach(day => {
        dailyGroups[day] = {
            dayName: day,
            totalHours: 0,
            activities: [],
            activitiesCount: 0
        };
    });

    // Agrupar actividades por día
    activities.forEach(activity => {
        const dayName = getDayName(activity.date);
        if (dailyGroups[dayName]) {
            dailyGroups[dayName].totalHours += activity.duration || 0;
            dailyGroups[dayName].activities.push({
                id: activity._id,
                name: activity.name,
                duration: activity.duration,
                project: activity.Proyect?.name || 'Sin proyecto',
                compensatory: activity.compensatory,
                state: activity.state
            });
            dailyGroups[dayName].activitiesCount++;
        }
    });

    // Redondear totales y convertir a array
    return weekDays.map(day => ({
        ...dailyGroups[day],
        totalHours: Math.round(dailyGroups[day].totalHours * 100) / 100
    }));
}

// 🔥 NUEVA FUNCIÓN HELPER: Agrupar actividades por semana del mes
function groupActivitiesByWeek(activities, startOfMonth) {
    const weeks = [];
    const currentDate = new Date(startOfMonth);
    
    // Determinar las semanas del mes
    while (currentDate.getMonth() === startOfMonth.getMonth()) {
        const weekStart = getStartOfWeek(new Date(currentDate));
        const weekEnd = getEndOfWeek(new Date(currentDate));
        
        // Filtrar actividades de esta semana
        const weekActivities = activities.filter(activity => {
            const activityDate = new Date(activity.date);
            return activityDate >= weekStart && activityDate <= weekEnd;
        });

        const weekTotalHours = weekActivities.reduce((sum, activity) => sum + (activity.duration || 0), 0);

        weeks.push({
            weekNumber: weeks.length + 1,
            weekRange: {
                start: weekStart.toISOString().split('T')[0],
                end: weekEnd.toISOString().split('T')[0]
            },
            totalHours: Math.round(weekTotalHours * 100) / 100,
            activitiesCount: weekActivities.length,
            dailyBreakdown: groupActivitiesByDay(weekActivities)
        });

        // Avanzar a la siguiente semana
        currentDate.setDate(currentDate.getDate() + 7);
    }

    return weeks;
}

// 🔥 FUNCIÓN HELPER: Calcular estadísticas de empleado (reutilizada de código existente)
function calculateEmployeeStats(activities) {
    let totalHours = 0;
    let compensatoryHours = 0;
    let regularHours = 0;
    let completedActivities = 0;
    let pendingActivities = 0;
    let inProgressActivities = 0;

    activities.forEach(activity => {
        const hours = activity.duration || 0;
        totalHours += hours;

        if (activity.compensatory) {
            compensatoryHours += hours;
        } else {
            regularHours += hours;
        }

        switch (activity.state) {
            case 'Finalizada':
                completedActivities++;
                break;
            case 'Pendiente':
                pendingActivities++;
                break;
            case 'En progreso':
                inProgressActivities++;
                break;
        }
    });

    const standardWeeklyHours = 40;
    const extraHours = Math.max(0, regularHours - standardWeeklyHours);

    return {
        totalHours: Math.round(totalHours * 100) / 100,
        regularHours: Math.round(regularHours * 100) / 100,
        compensatoryHours: Math.round(compensatoryHours * 100) / 100,
        extraHours: Math.round(extraHours * 100) / 100,
        totalActivities: activities.length,
        completedActivities,
        pendingActivities,
        inProgressActivities,
        completionRate: activities.length > 0 ? 
            Math.round((completedActivities / activities.length) * 100) : 0
    };
}

// 🔥 FUNCIÓN HELPER: Procesar datos semanales (reutilizada de código existente)
function processWeeklyData(activities) {
    const weekDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    const dailyHours = {};
    
    weekDays.forEach(day => {
        dailyHours[day] = 0;
    });

    activities.forEach(activity => {
        const dayName = getDayName(activity.date);
        dailyHours[dayName] += activity.duration || 0;
    });

    return weekDays.map(day => ({
        day,
        hours: Math.round(dailyHours[day] * 100) / 100
    }));
}

// Mantener métodos existentes del dashboard
ActivityController.getWeeklyHoursChart = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const { startDate, endDate } = req.query;

        if (!mongoose.Types.ObjectId.isValid(employeeId)) {
            return res.status(400).json({ 
                message: "ID de empleado inválido" 
            });
        }

        const start = startDate ? new Date(startDate) : getStartOfWeek(new Date());
        const end = endDate ? new Date(endDate) : getEndOfWeek(new Date());

        const activities = await ActivityModel.find({
            employee: new mongoose.Types.ObjectId(employeeId),
            date: {
                $gte: start,
                $lte: end
            },
            visible: true
        }).sort({ date: 1 });

        const dailyHours = {};
        const weekDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
        
        weekDays.forEach(day => {
            dailyHours[day] = 0;
        });

        activities.forEach(activity => {
            const dayName = getDayName(activity.date);
            dailyHours[dayName] += activity.duration || 0;
        });

        const chartData = weekDays.map(day => ({
            day,
            hours: Math.round(dailyHours[day] * 100) / 100
        }));

        res.status(200).json({
            employeeId,
            weekRange: {
                start: start.toISOString().split('T')[0],
                end: end.toISOString().split('T')[0]
            },
            chartData,
            totalHours: Object.values(dailyHours).reduce((sum, hours) => sum + hours, 0)
        });

    } catch (error) {
        console.error("Error al obtener horas semanales para gráfico:", error);
        res.status(500).json({ 
            message: "Error interno del servidor al obtener horas semanales", 
            error: error.message 
        });
    }
};

ActivityController.getDashboardData = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const { month, year } = req.query;

        if (!mongoose.Types.ObjectId.isValid(employeeId)) {
            return res.status(400).json({ 
                message: "ID de empleado inválido" 
            });
        }

        const currentDate = new Date();
        const targetMonth = month ? parseInt(month) - 1 : currentDate.getMonth();
        const targetYear = year ? parseInt(year) : currentDate.getFullYear();
        
        const startOfMonth = new Date(targetYear, targetMonth, 1);
        const endOfMonth = new Date(targetYear, targetMonth + 1, 0);

        const activities = await ActivityModel.find({
            employee: new mongoose.Types.ObjectId(employeeId),
            date: {
                $gte: startOfMonth,
                $lte: endOfMonth
            },
            visible: true
        }).populate('Proyect', 'name');

        const stats = calculateEmployeeStats(activities);

        const weekStart = getStartOfWeek(new Date());
        const weekEnd = getEndOfWeek(new Date());
        
        const weeklyActivities = activities.filter(activity => {
            const activityDate = new Date(activity.date);
            return activityDate >= weekStart && activityDate <= weekEnd;
        });

        const weeklyData = processWeeklyData(weeklyActivities);

        res.status(200).json({
            employeeId,
            period: {
                month: targetMonth + 1,
                year: targetYear,
                monthName: getMonthName(targetMonth)
            },
            stats,
            weeklyChart: weeklyData,
            recentActivities: activities
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 5)
                .map(activity => ({
                    id: activity._id,
                    name: activity.name,
                    date: activity.date,
                    duration: activity.duration,
                    project: activity.Proyect?.name || 'Sin proyecto',
                    state: activity.state
                }))
        });

    } catch (error) {
        console.error("Error al obtener datos del dashboard:", error);
        res.status(500).json({ 
            message: "Error interno del servidor al obtener datos del dashboard", 
            error: error.message 
        });
    }
};

 
// 🔥 NUEVO: Obtener horas mensuales de un empleado (mes actual)
ActivityController.getMonthlyHours = async (req, res) => {
    try {
        const { employeeId } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(employeeId)) {
            return res.status(400).json({ 
                message: "ID de empleado inválido" 
            });
        }

        // Calcular mes actual
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        // Buscar actividades del mes
        const activities = await ActivityModel.find({
            employee: new mongoose.Types.ObjectId(employeeId),
            date: { $gte: startOfMonth, $lte: endOfMonth },
            visible: true
        }).populate('Proyect', 'name').sort({ date: 1 });

        // Calcular totales mensuales
        const totalMonthlyHours = activities.reduce((sum, activity) => sum + (activity.duration || 0), 0);
        
        const compensatoryHours = activities
            .filter(activity => activity.compensatory)
            .reduce((sum, activity) => sum + (activity.duration || 0), 0);
        
        const regularHours = totalMonthlyHours - compensatoryHours;

        // Agrupar actividades por semana del mes
        const weeklyBreakdown = groupActivitiesByWeek(activities, startOfMonth);

        // Estadísticas por estado
        const stateStats = {
            pending: activities.filter(a => a.state === 'Pendiente').length,
            inProgress: activities.filter(a => a.state === 'En progreso').length,
            completed: activities.filter(a => a.state === 'Finalizada').length
        };

        res.status(200).json({
            employeeId,
            monthRange: {
                month: today.getMonth() + 1,
                year: today.getFullYear(),
                monthName: getMonthName(today.getMonth()),
                start: startOfMonth.toISOString().split('T')[0],
                end: endOfMonth.toISOString().split('T')[0]
            },
            monthlyTotals: {
                totalMonthlyHours: Math.round(totalMonthlyHours * 100) / 100,
                regularHours: Math.round(regularHours * 100) / 100,
                compensatoryHours: Math.round(compensatoryHours * 100) / 100,
                averageHoursPerDay: totalMonthlyHours > 0 ? Math.round((totalMonthlyHours / today.getDate()) * 100) / 100 : 0
            },
            weeklyBreakdown,
            stateStats,
            totalActivities: activities.length
        });

    } catch (error) {
        console.error("Error al obtener horas mensuales:", error);
        res.status(500).json({ 
            message: "Error interno del servidor al obtener horas mensuales", 
            error: error.message 
        });
    }
};

// 🔥 NUEVO: Resetear horas mensuales (ejecutar el día 1 de cada mes)
ActivityController.resetMonthlyHours = async (req, res) => {
    try {
        const today = new Date();
        
        // Verificar si es día 1 del mes (opcional, se puede quitar para testing)
        // if (today.getDate() !== 1) {
        //     return res.status(400).json({ 
        //         message: "Este endpoint solo debe ejecutarse el día 1 de cada mes" 
        //     });
        // }

        // Resetear campos de horas de todos los empleados activos
        const result = await EmployeeModel.updateMany(
            { isActive: true },
            {
                $set: {
                    weeklyHours: 0,
                    extraWeeklyHours: 0,
                    compensatoryHours: 0
                }
            }
        );

        res.status(200).json({
            message: "Horas mensuales reseteadas exitosamente",
            date: today.toISOString().split('T')[0],
            employeesUpdated: result.modifiedCount,
            matchedEmployees: result.matchedCount
        });

    } catch (error) {
        console.error("Error al resetear horas mensuales:", error);
        res.status(500).json({ 
            message: "Error interno del servidor al resetear horas mensuales", 
            error: error.message 
        });
    }
};

// ========== MÉTODOS EXISTENTES (continuación) ==========

ActivityController.getEmployeeCountsByProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        
        console.log('🔍 Backend: Obteniendo conteo de actividades para proyecto:', projectId);
        
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            console.error('❌ Backend: ID de proyecto inválido:', projectId);
            return res.status(400).json({ 
                message: "ID de proyecto inválido" 
            });
        }

        console.log('🔍 Backend: Ejecutando agregación para proyecto:', projectId);
        
        const counts = await ActivityModel.aggregate([
            {
                $match: {
                    Proyect: new mongoose.Types.ObjectId(projectId)
                }
            },
            {
                $group: {
                    _id: "$employee",
                    actividades: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: "employees",
                    localField: "_id",
                    foreignField: "_id",
                    as: "employee"
                }
            },
            { $unwind: "$employee" },
            {
                $project: {
                    _id: 0,
                    employeeId: "$employee._id",
                    fullName: "$employee.fullName",
                    cuscaId: "$employee.cuscaId",
                    actividades: 1
                }
            },
            {
                $sort: { fullName: 1 }
            }
        ]);

        console.log('✅ Backend: Conteo de actividades obtenido:', counts);
        console.log('📊 Backend: Total de empleados con actividades:', counts.length);

        res.status(200).json(counts);

    } catch (error) {
        console.error("❌ Backend: Error al contar actividades:", error);
        res.status(500).json({ 
            message: "Error interno del servidor al obtener conteo de actividades", 
            error: error.message 
        });
    }
};


// ========== FUNCIONES HELPER ==========

// 🔥 FUNCIÓN HELPER: Actualizar horas semanales del empleado automáticamente
async function updateEmployeeWeeklyHours(employeeId) {
    try {
        const today = new Date();
        const startOfWeek = getStartOfWeek(today);
        const endOfWeek = getEndOfWeek(today);

        const activities = await ActivityModel.find({
            employee: new mongoose.Types.ObjectId(employeeId),
            date: { $gte: startOfWeek, $lte: endOfWeek },
            visible: true
        });

        const totalWeeklyHours = activities.reduce((sum, activity) => sum + (activity.duration || 0), 0);

        let normalHours = 0;
        let extraHours = 0; 
        let compensatoryHours = 0;

        if (totalWeeklyHours <= 40) {
            normalHours = totalWeeklyHours;
        } else if (totalWeeklyHours <= 44) {
            normalHours = 40;
            extraHours = totalWeeklyHours - 40;
        } else {
            normalHours = 40;
            extraHours = 4;
            compensatoryHours = totalWeeklyHours - 44;
        }

        await EmployeeModel.findByIdAndUpdate(employeeId, {
            weeklyHours: Math.round(totalWeeklyHours * 100) / 100,
            extraWeeklyHours: Math.round(extraHours * 100) / 100,
            compensatoryHours: Math.round(compensatoryHours * 100) / 100
        });

        console.log(`✅ Horas actualizadas para empleado ${employeeId}:`, {
            totalWeeklyHours: Math.round(totalWeeklyHours * 100) / 100,
            extraWeeklyHours: Math.round(extraHours * 100) / 100,
            compensatoryHours: Math.round(compensatoryHours * 100) / 100
        });

    } catch (error) {
        console.error(`❌ Error al actualizar horas semanales del empleado ${employeeId}:`, error);
        // No lanzamos el error para que no afecte la operación principal
        // pero sí lo registramos para debugging
    }
}

export default ActivityController;
