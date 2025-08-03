import WorkTeamModel from "../models/WorkTeam.js";
import EmployeeModel from '../models/Employee.js';

const WorkTeamController = {};

// Obtener equipos de trabajo
WorkTeamController.getWorkTeams = async (req, res) => {
    try {
        // SOLUCIÓN: Se modifica la consulta para traer TODOS los equipos.
        // Usamos $or para pedir explícitamente los equipos activos, inactivos
        // o aquellos que no tengan el campo 'isActive', asegurando que nada se oculte.
        const workTeams = await WorkTeamModel.find({
            $or: [
                { isActive: true },
                { isActive: false },
                { isActive: { $exists: true, $in: [null] } }, // Incluye si es null
                { isActive: { $exists: false } } // Incluye si el campo no existe
            ]
        })
            .populate("supervisor")
            .populate("mainAreaArea")
            .populate({
                path: "employees.id",
                select: "fullName cuscaId email position country",
                populate: {
                    path: "country",
                    select: "name",
                },
            });
        res.json(workTeams);
    } catch (error) {
        console.error('Error al obtener equipos de trabajo:', error);
        res.status(500).json({ message: 'Error al obtener equipos de trabajo', error: error.message });
    }
};

// Insertar nuevo equipo de trabajo
WorkTeamController.insertWorkTeam = async (req, res) => {
    try {
        const { name, supervisor, code, teamType, mainAreaArea, employees, isActive } = req.body;

        console.log('=== DEBUG CREATE WORKTEAM ===');
        console.log('Datos completos recibidos:', JSON.stringify(req.body, null, 2));
        console.log('isActive recibido:', isActive);

        // Validación de isActive
        let activeStatus;
        if (isActive === true || isActive === 'true' || isActive === 1) {
            activeStatus = true;
        } else if (isActive === false || isActive === 'false' || isActive === 0) {
            activeStatus = false;
        } else {
            activeStatus = true;
        }

        console.log('isActive procesado:', activeStatus);

        const workTeamData = {
            name,
            supervisor,
            code,
            teamType,
            mainAreaArea,
            employees,
            isActive: activeStatus
        };

        console.log('Datos a guardar:', JSON.stringify(workTeamData, null, 2));

        const newWorkTeam = new WorkTeamModel(workTeamData);
        console.log('Objeto antes de guardar:', JSON.stringify(newWorkTeam.toObject(), null, 2));

        const savedWorkTeam = await newWorkTeam.save();

        console.log('Objeto guardado:', JSON.stringify(savedWorkTeam.toObject(), null, 2));
        console.log('isActive en BD:', savedWorkTeam.isActive);
        console.log('=== FIN DEBUG ===');

        res.status(201).json({
            message: "WorkTeam saved successfully",
            data: savedWorkTeam
        });
    } catch (error) {
        console.error('Error al crear equipo de trabajo:', error);
        // Check for duplicate key error (MongoDB error code 11000)
        // This assumes you have `unique: true` set on the 'name' field in your WorkTeam schema.
        if (error.code === 11000 && error.keyPattern && error.keyPattern.name) {
            return res.status(409).json({ // 409 Conflict indicates a conflict with current state of the resource
                message: 'Ya existe un equipo con este nombre',
                error: 'Duplicate team name'
            });
        }
        res.status(500).json({
            message: 'Error al crear equipo de trabajo',
            error: error.message
        });
    }
};

// Actualizar equipo de trabajo
WorkTeamController.updateWorkTeam = async (req, res) => {
    try {
        const { name, supervisor, code, teamType, mainAreaArea, employees, isActive } = req.body;

        console.log('=== DEBUG UPDATE WORKTEAM ===');
        console.log('ID a actualizar:', req.params.id);
        console.log('Datos de actualización:', JSON.stringify(req.body, null, 2));

        let activeStatus;
        if (isActive === true || isActive === 'true' || isActive === 1) {
            activeStatus = true;
        } else if (isActive === false || isActive === 'false' || isActive === 0) {
            activeStatus = false;
        } else {
            activeStatus = true;
        }

        const updateData = {
            name,
            supervisor,
            code,
            teamType,
            mainAreaArea,
            employees,
            isActive: activeStatus
        };

        console.log('Datos a actualizar:', JSON.stringify(updateData, null, 2));

        const updatedWorkTeam = await WorkTeamModel.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedWorkTeam) {
            return res.status(404).json({ message: "WorkTeam no encontrado" });
        }

        console.log('WorkTeam actualizado:', JSON.stringify(updatedWorkTeam.toObject(), null, 2));
        console.log('isActive actualizado:', updatedWorkTeam.isActive);
        console.log('=== FIN DEBUG UPDATE ===');

        res.json({
            message: "WorkTeam updated successfully",
            data: updatedWorkTeam
        });
    } catch (error) {
        console.error('Error al actualizar equipo de trabajo:', error);
        // Also check for duplicate key error on update if 'name' is unique
        if (error.code === 11000 && error.keyPattern && error.keyPattern.name) {
            return res.status(409).json({
                message: 'Ya existe un equipo con este nombre',
                error: 'Duplicate team name'
            });
        }
        res.status(500).json({
            message: 'Error al actualizar equipo de trabajo',
            error: error.message
        });
    }
};

// Eliminar equipo de trabajo
WorkTeamController.deleteWorkTeam = async (req, res) => {
    try {
        const deletedWorkTeam = await WorkTeamModel.findByIdAndDelete(req.params.id);

        if (!deletedWorkTeam) {
            return res.status(404).json({ message: "WorkTeam no encontrado" });
        }

        res.json({
            message: "WorkTeam deleted successfully",
            data: deletedWorkTeam
        });
    } catch (error) {
        console.error('Error al eliminar equipo de trabajo:', error);
        res.status(500).json({
            message: 'Error al eliminar equipo de trabajo',
            error: error.message
        });
    }
};

// Obtener equipos de trabajo por empleado (Versión ÚNICA y CORRECTA)
WorkTeamController.getWorkTeamsByEmployee = async (req, res) => {
    try {
        const { employeeId } = req.params;

        const workTeams = await WorkTeamModel.find({
            'employees.id': employeeId
        })
        .populate('supervisor', 'fullName cuscaId')
        .populate({
            path: 'employees.id',
            select: 'fullName cuscaId email position country',
            populate: {
                path: 'country',
                select: 'name',
            },
        })
        .populate({
            path: 'mainAreaArea',
            populate: [
                { path: 'mainArea', select: 'name' },
                { path: 'area', select: 'name' }
            ]
        });

        res.status(200).json(workTeams);
    } catch (error) {
        console.error('Error al obtener equipos de trabajo por empleado:', error);
        res.status(500).json({
            message: 'Error al obtener equipos de trabajo por empleado',
            error: error.message
        });
    }
};

// Método para obtener workteams por cuscaId del empleado
WorkTeamController.getWorkTeamsByEmployeeCusca = async (req, res) => {
  try {
    const { cuscaId } = req.params;

    if (!cuscaId) {
      return res.status(400).json({ message: "Se requiere el cuscaId del empleado." });
    }

    console.log("DEBUG: Buscando workteams para employeeCuscaId:", cuscaId);

    // Primero buscar el empleado por cuscaId para obtener su _id
    const employee = await EmployeeModel.findOne({ 
      cuscaId: cuscaId,
      eliminated: { $ne: true }
    });

    if (!employee) {
      console.log("DEBUG: No se encontró empleado con cuscaId:", cuscaId);
      return res.status(404).json({ message: "Empleado no encontrado." });
    }

    console.log("DEBUG: Empleado encontrado:", employee._id);

    // Buscar workteams que contengan a este empleado
    const workTeams = await WorkTeamModel.find({
      'employees.id': employee._id,
      eliminated: { $ne: true }
    })
    .populate('employees.id', 'fullName cuscaId email')
    .populate('supervisor', 'fullName cuscaId');

    console.log("DEBUG: WorkTeams encontrados:", workTeams.length);

    res.status(200).json(workTeams);
  } catch (error) {
    console.error("Error al obtener equipos de trabajo por cuscaId del empleado:", error);
    res.status(500).json({ 
      message: "Error al obtener equipos de trabajo por empleado", 
      error: error.message 
    });
  }
};

export default WorkTeamController;