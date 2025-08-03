import Employee from "../models/Employee.js";
import jsonwebtoken from "jsonwebtoken";
import { config } from "../config.js";
import MainAreaArea from "../models/MainArea-Area.js";
import bcrypt from 'bcryptjs';

const employeeController = {};

// Método para obtener un empleado por ID
employeeController.getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id)
            .populate({
                path: 'mainAreaArea',
                populate: [
                    { path: 'area' },
                    { path: 'mainArea' }
                ]
            })
            .populate('country')
            .populate({
                path: 'inmediateBoss',
                select: 'fullName cuscaId email'
            })
            .populate({
                path: 'subManager',
                select: 'fullName cuscaId email'
            });

        if (!employee) {
            return res.status(404).json({ message: 'Empleado no encontrado' });
        }

        res.status(200).json(employee);
    } catch (error) {
        console.error('Error al obtener el empleado:', error);
        res.status(500).json({ message: 'Error al obtener el empleado', error: error.message });
    }
};

// Método para obtener un empleado por cuscaId
employeeController.getEmployeeByCuscaId = async (req, res) => {
    try {
        const employee = await Employee.findOne({ cuscaId: req.params.cuscaId })
            .populate({
                path: 'mainAreaArea',
                populate: [
                    { path: 'area' },
                    { path: 'mainArea' }
                ]
            })
            .populate('country')
            .populate({
                path: 'inmediateBoss',
                select: 'fullName cuscaId email'
            })
            .populate({
                path: 'subManager',
                select: 'fullName cuscaId email'
            });

        if (!employee) {
            return res.status(404).json({ message: `No se encontró ningún empleado con cuscaId ${req.params.cuscaId}` });
        }

        res.json(employee);
    } catch (error) {
        console.error('Error al obtener empleado por cuscaId:', error);
        res.status(500).json({ message: 'Error al obtener el empleado', error: error.message });
    }
};

// Método existente de getEmployee (con filtro de empleados activos)
employeeController.getEmployee = async (req, res) => {
    try {
        // Construir el filtro basado en los parámetros de la consulta
        let filter = {};
        
        // FILTRO CRÍTICO: Si se solicita filtrar por cuscaId
        if (req.query.cuscaId) {
            console.log(`Filtrando empleado por cuscaId exacto: ${req.query.cuscaId}`);
            filter.cuscaId = req.query.cuscaId; // Filtro exacto por cuscaId
            
            // Si se solicita coincidencia exacta
            if (req.query.exactMatch === 'true') {
                console.log(`🔍 Búsqueda exacta activada para cuscaId: ${req.query.cuscaId}`);
            }
        } else {
            console.log(`⚠️ Solicitud sin filtro de cuscaId`);
        }
        
        // Si se solicita filtrar por rol (Supervisor, Admin, Empleado, Portafolio)
        if (req.query.rol) {
            console.log(`📃 Filtrando por rol: ${req.query.rol}`);
            filter.daylogRol = req.query.rol;
        }

        // NUEVO: Filtro para empleados activos solamente
        // Solo aplicar si no estamos buscando por cuscaId específico
        if (req.query.activeOnly === 'true' && !req.query.cuscaId) {
            console.log(` Filtrando solo empleados activos`);
            filter.isActive = true;
        }
        
        // Aplicar el filtro a la consulta
        console.log(`🔎 Filtros aplicados:`, filter);
        const employees = await Employee.find(filter)
            .populate({
                path: 'mainAreaArea',
                populate: [
                    { path: 'area' },
                    { path: 'mainArea' }
                ]
            })
            .populate("country")
            .populate({
                path: 'inmediateBoss',
                select: 'fullName cuscaId email'
            })
            .populate({
                path: 'subManager',
                select: 'fullName cuscaId email'
            });
        
        console.log(` Resultados encontrados: ${employees.length} empleados`);
        if (employees.length > 0 && req.query.cuscaId) {
            console.log(` Empleado encontrado con cuscaId ${req.query.cuscaId}: ${employees[0].fullName}`);
            return res.json(employees[0]); // Devolver solo el empleado encontrado
        } else if (employees.length === 0 && req.query.cuscaId) {
            console.log(` No se encontró ningún empleado con cuscaId ${req.query.cuscaId}`);
            return res.status(404).json({
                message: `No se encontró ningún empleado con cuscaId ${req.query.cuscaId}`
            });
        } else {
            return res.status(200).json(employees); // Si no se busca por cuscaId, devolver todos los empleados encontrados
        }
    } catch (error) {
        console.error('Error al obtener empleados:', error);
        return res.status(500).json({ 
            message: 'Error al obtener empleados', 
            error: error.message 
        });
    }
}

// NUEVO: Función para contar sesiones realmente activas basada en tokens válidos
employeeController.getActiveSessionsCount = async (req, res) => {
    try {
        console.log('🔍 DEBUG - Iniciando conteo de sesiones activas...');
        
        // Obtener todos los empleados activos que han hecho login recientemente
        const recentLoginThreshold = new Date(Date.now() - 24 * 60 * 60 * 1000); // Últimas 24 horas
        
        const recentlyActiveEmployees = await Employee.find({
            isActive: true,
            lastLogin: { $gte: recentLoginThreshold }
        }).select('cuscaId fullName lastLogin');

        console.log(` Empleados con login reciente (últimas 24h): ${recentlyActiveEmployees.length}`);

        // Si quieres un conteo más preciso, puedes usar este método alternativo:
        // Contar empleados activos que se han logueado en las últimas 2 horas (sesiones muy activas)
        const veryRecentThreshold = new Date(Date.now() - 2 * 60 * 60 * 1000); // Últimas 2 horas
        
        const veryActiveEmployees = await Employee.countDocuments({
            isActive: true,
            lastLogin: { $gte: veryRecentThreshold }
        });

        console.log(`Empleados muy activos (últimas 2h): ${veryActiveEmployees}`);
        
        res.json({
            activeSessionsLast24h: recentlyActiveEmployees.length,
            activeSessionsLast2h: veryActiveEmployees,
            message: "Conteo de sesiones activas obtenido exitosamente",
            details: {
                last24Hours: recentlyActiveEmployees.length,
                last2Hours: veryActiveEmployees,
                threshold24h: recentLoginThreshold.toISOString(),
                threshold2h: veryRecentThreshold.toISOString()
            }
        });

    } catch (error) {
        console.error(` Error al contar sesiones activas: ${error.message}`, error);
        res.status(500).json({ 
            message: 'Error al contar sesiones activas', 
            error: error.message,
            activeSessionsLast24h: 0,
            activeSessionsLast2h: 0
        });
    }
}

//  NUEVO: Función más avanzada para verificar tokens activos en tiempo real
employeeController.getValidTokensCount = async (req, res) => {
    try {
        console.log(' DEBUG - Verificando tokens activos en tiempo real...');
        
        // Obtener todos los empleados activos
        const activeEmployees = await Employee.find({ isActive: true }).select('_id cuscaId');
        
        let validTokensCount = 0;
        const validUsers = [];
        
        // Nota: Esta es una implementación conceptual
        // En un sistema real, tendrías que mantener un registro de tokens activos
        // Por ahora, simulamos con empleados que se han logueado recientemente
        
        const recentLoginThreshold = new Date(Date.now() - 60 * 60 * 1000); // Última hora
        
        const employeesWithValidSessions = await Employee.find({
            isActive: true,
            lastLogin: { $gte: recentLoginThreshold }
        }).select('cuscaId fullName lastLogin');

        validTokensCount = employeesWithValidSessions.length;

        console.log(` Tokens/sesiones válidas encontradas: ${validTokensCount}`);
        
        res.json({
            validTokensCount: validTokensCount,
            message: "Conteo de tokens válidos obtenido exitosamente",
            details: {
                totalActiveEmployees: activeEmployees.length,
                employeesWithValidSessions: validTokensCount,
                threshold: recentLoginThreshold.toISOString(),
                validUsers: employeesWithValidSessions.map(emp => ({
                    cuscaId: emp.cuscaId,
                    fullName: emp.fullName,
                    lastLogin: emp.lastLogin
                }))
            }
        });

    } catch (error) {
        console.error(` Error al contar tokens válidos: ${error.message}`, error);
        res.status(500).json({ 
            message: 'Error al contar tokens válidos', 
            error: error.message,
            validTokensCount: 0 
        });
    }
}

//  NUEVO: Función para obtener estadísticas completas de usuarios
employeeController.getUserStats = async (req, res) => {
    try {
        console.log(' DEBUG - Obteniendo estadísticas completas de usuarios...');
        
        const now = new Date();
        const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const last2h = new Date(now.getTime() - 2 * 60 * 60 * 1000);
        const last30min = new Date(now.getTime() - 30 * 60 * 1000);

        // Conteos paralelos para mejor performance
        const [
            totalEmployees,
            activeEmployees,
            inactiveEmployees,
            sessionsLast24h,
            sessionsLast2h,
            sessionsLast30min
        ] = await Promise.all([
            Employee.countDocuments({}),
            Employee.countDocuments({ isActive: true }),
            Employee.countDocuments({ isActive: false }),
            Employee.countDocuments({ isActive: true, lastLogin: { $gte: last24h } }),
            Employee.countDocuments({ isActive: true, lastLogin: { $gte: last2h } }),
            Employee.countDocuments({ isActive: true, lastLogin: { $gte: last30min } })
        ]);

        const stats = {
            totalEmployees,
            activeEmployees,
            inactiveEmployees,
            activeSessions: {
                last24Hours: sessionsLast24h,
                last2Hours: sessionsLast2h,
                last30Minutes: sessionsLast30min
            },
            percentages: {
                activeEmployees: ((activeEmployees / totalEmployees) * 100).toFixed(2),
                sessionsLast24h: ((sessionsLast24h / activeEmployees) * 100).toFixed(2),
                sessionsLast2h: ((sessionsLast2h / activeEmployees) * 100).toFixed(2)
            },
            timestamp: now.toISOString()
        };

        console.log('Estadísticas calculadas:', stats);
        
        res.json({
            success: true,
            message: "Estadísticas obtenidas exitosamente",
            data: stats
        });

    } catch (error) {
        console.error(` Error al obtener estadísticas: ${error.message}`, error);
        res.status(500).json({ 
            success: false,
            message: 'Error al obtener estadísticas de usuarios', 
            error: error.message
        });
    }
}

employeeController.updateEmployee = async (req,res) => {
    const {cuscaId, fullName, email, inmediateBoss, subManager, password, country, daylogRol, position,   mainAreaArea, isActive, isBoss, 
     isManager,     compensatoryHours,extraWeeklyHours,weeklyHours} = req.body;
     const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id,{cuscaId, fullName, email, inmediateBoss, subManager, password, country, daylogRol, position, mainAreaArea,isActive, isBoss, 
     isManager, compensatoryHours,extraWeeklyHours,weeklyHours},{new:true})
     res.json ({message: "Employee updated"});
}

employeeController.deleteEmployee = async (req,res) => {
    await Employee.findByIdAndDelete(req.params.id);
    res.json({message: "Employee deleted"});
}

// NUEVO MÉTODO: Verificar la contraseña del empleado
employeeController.verifyPassword = async (req, res) => {
    const { cuscaId, password } = req.body;

    console.log('BACKEND DEBUG: Solicitud recibida para verificar contraseña.');
    console.log('BACKEND DEBUG: CuscaID recibido:', cuscaId);
    console.log('BACKEND DEBUG: Contraseña recibida (parcialmente oculta):', password ? password.substring(0, 3) + '...' : 'No password');

    if (!cuscaId || !password) {
        console.warn('BACKEND DEBUG: Falta CuscaID o contraseña en la solicitud.');
        return res.status(400).json({ message: 'Se requiere CuscaID y contraseña.', isValid: false });
    }

    try {
        const employee = await Employee.findOne({ cuscaId: cuscaId });
        console.log('BACKEND DEBUG: Empleado encontrado por CuscaID:', employee ? employee.fullName : 'Ninguno');

        if (!employee) {
            console.warn(`BACKEND DEBUG: Intento de verificación para CuscaID no encontrado: ${cuscaId}`);
            return res.status(404).json({ message: 'Empleado no encontrado.', isValid: false });
        }

        let isMatch = false;
        // Intentar comparar con bcrypt (hash)
        if (employee.password && employee.password.length >= 40) { // longitud típica hash bcrypt 60
            isMatch = await bcrypt.compare(password, employee.password);
        }
        // Fallback: la contraseña almacenada podría estar en texto plano (caso legacy)
        if (!isMatch && password === employee.password) {
            isMatch = true;
        }
        console.log('BACKEND DEBUG: Resultado de bcrypt.compare (isMatch):', isMatch);

        if (isMatch) {
            console.log(`BACKEND DEBUG: Contraseña verificada correctamente para CuscaID: ${cuscaId}`);
            console.log('BACKEND DEBUG: Respuesta enviada:', { isValid: true, message: 'Contraseña correcta.' });
            return res.json({ message: 'Contraseña correcta.', isValid: true });
        } else {
            console.warn(`BACKEND DEBUG: Contraseña incorrecta para CuscaID: ${cuscaId}`);
            console.log('BACKEND DEBUG: Respuesta enviada:', { isValid: false, message: 'Contraseña incorrecta.' });
            return res.status(401).json({ message: 'Contraseña incorrecta.', isValid: false });
        }
    } catch (error) {
        console.error(`BACKEND DEBUG: Error al verificar la contraseña para CuscaID ${cuscaId}: ${error.message}`, error);
        return res.status(500).json({ message: 'Error interno del servidor al verificar la contraseña.', isValid: false });
    }
};

// NUEVO MÉTODO: Cambiar la contraseña del empleado
employeeController.changePassword = async (req, res) => {
    const { cuscaId, currentPassword, newPassword } = req.body;

    console.log('BACKEND DEBUG: [changePassword] CuscaID recibido:', cuscaId);
    console.log('BACKEND DEBUG: [changePassword] currentPassword recibido (parcial):', currentPassword ? currentPassword.substring(0,3)+'...' : 'No password');

    if (!cuscaId || !currentPassword || !newPassword) {
        console.warn('BACKEND DEBUG: Faltan datos en la solicitud de cambio de contraseña.');
        return res.status(200).json({ 
            success: false, 
            message: 'Se requiere CuscaID, contraseña actual y nueva contraseña.'
        });
    }

    try {
        const employee = await Employee.findOne({ cuscaId: cuscaId });
        
        if (!employee) {
            console.warn(`BACKEND DEBUG: Intento de cambio de contraseña para CuscaID no encontrado: ${cuscaId}`);
            return res.status(200).json({ 
                success: false, 
                message: 'Empleado no encontrado.'
            });
        }

        // Mostrar la contraseña almacenada (parcialmente)
        console.log('BACKEND DEBUG: [changePassword] Password almacenado (parcial):', employee.password ? employee.password.substring(0,6)+'...' : 'No password');
        let isMatch = false;
        if (employee.password && employee.password.length >= 40) {
            isMatch = await bcrypt.compare(currentPassword, employee.password);
            console.log('BACKEND DEBUG: [changePassword] bcrypt.compare result:', isMatch);
        }
        if (!isMatch && currentPassword === employee.password) {
            isMatch = true;
            console.log('BACKEND DEBUG: [changePassword] Comparación texto plano result: true');
        }
        
        if (!isMatch) {
            console.warn(`BACKEND DEBUG: Contraseña actual incorrecta para CuscaID: ${cuscaId}`);
            return res.status(200).json({ 
                success: false, 
                message: 'La contraseña actual es incorrecta.'
            });
        }

        // Generar hash para la nueva contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Actualizar la contraseña
        employee.password = hashedPassword;
        await employee.save();

        console.log(`BACKEND DEBUG: Contraseña cambiada exitosamente para CuscaID: ${cuscaId}`);
        return res.status(200).json({ 
            success: true, 
            message: 'Contraseña cambiada exitosamente.'
        });
    } catch (error) {
        console.error(`BACKEND DEBUG: Error al cambiar la contraseña para CuscaID ${cuscaId}: ${error.message}`, error);
        return res.status(200).json({ 
            success: false, 
            message: 'Error interno del servidor al cambiar la contraseña.'
        });
    }
};

export default employeeController;
