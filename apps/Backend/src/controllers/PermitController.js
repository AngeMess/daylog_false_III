const PermitController = {};
import PermitModel from "../models/Permit.js";
import mongoose from "mongoose";

// Obtener todos los permisos
PermitController.getPermit = async(req, res) => {
    try {
        const permits = await PermitModel.find().sort({ createdAt: -1 }); // Ordenar por fecha de creación descendente
        res.status(200).json(permits);
    } catch (error) {
        console.error("Error al obtener permisos:", error);
        res.status(500).json({ 
            message: "Error interno del servidor al obtener permisos", 
            error: error.message 
        });
    }
}

// Insertar nuevo permiso
PermitController.insertPermit = async(req, res) => {
    try {
        const { date, motive, state, permitType } = req.body;

        // Obtén el id del empleado desde req.employeeId
        const idEmployee = req.employeeId;

        // Validación de campos requeridos
        if (!idEmployee || !date || !motive || !state || !permitType) {
            return res.status(400).json({ 
                message: "Todos los campos son obligatorios: date, motive, state, permitType" 
            });
        }

        // Validación de fecha
        const permitDate = new Date(date);
        if (isNaN(permitDate.getTime())) {
            return res.status(400).json({ 
                message: "La fecha proporcionada no es válida" 
            });
        }

        // Validación de fecha no puede ser en el pasado (opcional, dependiendo de los requerimientos)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (permitDate < today) {
            return res.status(400).json({ 
                message: "La fecha del permiso no puede ser en el pasado" 
            });
        }

        // Validación de longitud del motivo
        if (typeof motive !== 'string' || motive.trim().length === 0) {
            return res.status(400).json({ 
                message: "El motivo debe ser un texto válido" 
            });
        }

        if (motive.length > 350) {
            return res.status(400).json({ 
                message: "El motivo no puede exceder los 350 caracteres" 
            });
        }

        // Validación de estado
        const validStates = ["Aprobada", "Pendiente", "Denegada"];
        if (!validStates.includes(state)) {
            return res.status(400).json({ 
                message: "El estado solo puede ser: Aprobada, Pendiente o Denegada" 
            });
        }

        // Validación de tipo de permiso
        const validPermitTypes = [
            "Permiso por licencia sin sueldo",
            "Permiso por mudanza",
            "Permiso por emergencia personal",
            "Permiso por capacitación",
            "Permiso por vacaciones",
            "Permiso por duelo",
            "Permiso por Maternidad/Paternidad",
            "Permiso por motivos familiares",
            "Permiso por cita médica",
            "Permiso por enfermedad"
        ];

        if (!validPermitTypes.includes(permitType)) {
            return res.status(400).json({ 
                message: "Tipo de permiso inválido. Debe ser uno de los tipos permitidos",
                validTypes: validPermitTypes
            });
        }

        // Crear nuevo permiso
        const newPermit = new PermitModel({
            idEmployee,  // Aquí se pasa el ID del empleado automáticamente
            date: permitDate,
            motive: motive.trim(),
            state,
            permitType,
        });

        await newPermit.save();
        res.status(200).json({ 
            message: "Permiso guardado exitosamente",
            permit: newPermit
        });

    } catch (error) {
        console.error("Error al insertar permiso:", error);
        
        // Manejar errores de validación de Mongoose
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                message: "Error de validación", 
                errors: Object.values(error.errors).map(err => err.message)
            });
        }

        res.status(500).json({ 
            message: "Error interno del servidor al guardar permiso", 
            error: error.message 
        });
    }
}

// Actualizar permiso existente
PermitController.updatePermit = async(req, res) => {
    try {
        const { id } = req.params;
        const { date, motive, state, permitType } = req.body;

        // Validar ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ 
                message: "ID de permiso inválido" 
            });
        }

        // Verificar que el permiso existe
        const existingPermit = await PermitModel.findById(id);
        if (!existingPermit) {
            return res.status(400).json({ 
                message: "Permiso no encontrado" 
            });
        }

        // Validaciones para campos que se proporcionan
        if (date) {
            const permitDate = new Date(date);
            if (isNaN(permitDate.getTime())) {
                return res.status(400).json({ 
                    message: "La fecha proporcionada no es válida" 
                });
            }

            // Validación de fecha no puede ser en el pasado
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (permitDate < today && existingPermit.state === "Pendiente") {
                return res.status(400).json({ 
                    message: "No se puede cambiar a una fecha pasada para permisos pendientes" 
                });
            }
        }

        if (motive !== undefined) {
            if (typeof motive !== 'string' || motive.trim().length === 0) {
                return res.status(400).json({ 
                    message: "El motivo debe ser un texto válido" 
                });
            }

            if (motive.length > 350) {
                return res.status(400).json({ 
                    message: "El motivo no puede exceder los 350 caracteres" 
                });
            }
        }

        if (state && !["Aprobada", "Pendiente", "Denegada"].includes(state)) {
            return res.status(400).json({ 
                message: "El estado solo puede ser: Aprobada, Pendiente o Denegada" 
            });
        }

        if (permitType) {
            const validPermitTypes = [
                "Permiso por licencia sin sueldo",
                "Permiso por mudanza",
                "Permiso por emergencia personal",
                "Permiso por capacitación",
                "Permiso por vacaciones",
                "Permiso por duelo",
                "Permiso por Maternidad/Paternidad",
                "Permiso por motivos familiares",
                "Permiso por cita médica",
                "Permiso por enfermedad"
            ];

            if (!validPermitTypes.includes(permitType)) {
                return res.status(400).json({ 
                    message: "Tipo de permiso inválido",
                    validTypes: validPermitTypes
                });
            }
        }

        // Lógica de negocio: no permitir cambios en permisos ya aprobados o denegados (opcional)
        if (existingPermit.state !== "Pendiente" && (state || date || permitType)) {
            return res.status(400).json({ 
                message: "No se pueden modificar permisos que ya han sido aprobados o denegados. Solo se puede cambiar el motivo." 
            });
        }

        // Preparar datos de actualización
        const updateData = {};
        if (date) updateData.date = new Date(date);
        if (motive !== undefined) updateData.motive = motive.trim();
        if (state) updateData.state = state;
        if (permitType) updateData.permitType = permitType;

        const updatedPermit = await PermitModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        res.status(200).json({ 
            message: "Permiso actualizado exitosamente",
            permit: updatedPermit
        });

    } catch (error) {
        console.error("Error al actualizar permiso:", error);
        
        // Manejar errores de validación de Mongoose
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                message: "Error de validación", 
                errors: Object.values(error.errors).map(err => err.message)
            });
        }

        res.status(500).json({ 
            message: "Error interno del servidor al actualizar permiso", 
            error: error.message 
        });
    }
}

// Eliminar permiso
PermitController.deletePermit = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validar ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ 
                message: "ID de permiso inválido" 
            });
        }

        // Verificar que el permiso existe antes de eliminar
        const permit = await PermitModel.findById(id);
        if (!permit) {
            return res.status(400).json({ 
                message: "Permiso no encontrado" 
            });
        }

        // Lógica de negocio: no permitir eliminar permisos aprobados (opcional)
        if (permit.state === "Aprobada") {
            return res.status(400).json({ 
                message: "No se pueden eliminar permisos que ya han sido aprobados" 
            });
        }

        await PermitModel.findByIdAndDelete(id);
        res.status(200).json({ 
            message: "Permiso eliminado exitosamente",
            deletedPermit: {
                id: permit._id,
                permitType: permit.permitType,
                date: permit.date
            }
        });

    } catch (error) {
        console.error("Error al eliminar permiso:", error);
        res.status(500).json({ 
            message: "Error interno del servidor al eliminar permiso", 
            error: error.message 
        });
    }
}

// Método adicional: Obtener permisos por estado
PermitController.getPermitsByState = async (req, res) => {
    try {
        const { state } = req.params;
        
        // Validar estado
        const validStates = ["Aprobada", "Pendiente", "Denegada"];
        if (!validStates.includes(state)) {
            return res.status(400).json({ 
                message: "Estado inválido. Debe ser: Aprobada, Pendiente o Denegada" 
            });
        }

        const permits = await PermitModel.find({ state }).sort({ createdAt: -1 });
        
        res.status(200).json({
            message: `Permisos con estado: ${state}`,
            count: permits.length,
            permits
        });

    } catch (error) {
        console.error("Error al obtener permisos por estado:", error);
        res.status(500).json({ 
            message: "Error interno del servidor al obtener permisos por estado", 
            error: error.message 
        });
    }
}

// Método adicional: Obtener estadísticas de permisos
PermitController.getPermitStats = async (req, res) => {
    try {
        const stats = await PermitModel.aggregate([
            {
                $group: {
                    _id: "$state",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    state: "$_id",
                    count: 1,
                    _id: 0
                }
            }
        ]);

        const permitTypeStats = await PermitModel.aggregate([
            {
                $group: {
                    _id: "$permitType",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    permitType: "$_id",
                    count: 1,
                    _id: 0
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);

        res.status(200).json({
            message: "Estadísticas de permisos",
            stateStats: stats,
            permitTypeStats
        });

    } catch (error) {
        console.error("Error al obtener estadísticas de permisos:", error);
        res.status(500).json({ 
            message: "Error interno del servidor al obtener estadísticas", 
            error: error.message 
        });
    }
} 

export default PermitController;