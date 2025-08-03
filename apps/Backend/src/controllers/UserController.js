import Employee from '../models/Employee.js';

// Controlador para operaciones generales de usuarios
const userController = {};

// Método para marcar a un usuario como no nuevo
userController.markUserAsNotNew = async (req, res) => {
    const { cuscaId } = req.body;

    console.log('BACKEND DEBUG: Solicitud recibida para marcar usuario como no nuevo.');
    console.log('BACKEND DEBUG: CuscaID recibido:', cuscaId);

    if (!cuscaId) {
        console.warn('BACKEND DEBUG: Falta CuscaID en la solicitud.');
        return res.status(400).json({ 
            success: false,
            message: 'Se requiere CuscaID para actualizar el estado del usuario.'
        });
    }

    try {
        // Buscar al empleado por CuscaID
        const employee = await Employee.findOne({ cuscaId: cuscaId });
        
        if (!employee) {
            console.warn(`BACKEND DEBUG: Empleado no encontrado para CuscaID: ${cuscaId}`);
            return res.status(404).json({ 
                success: false, 
                message: 'Empleado no encontrado.'
            });
        }

        // Actualizar la propiedad isNew a false
        employee.isNew = false;
        await employee.save();

        console.log(`BACKEND DEBUG: Usuario marcado como no nuevo exitosamente para CuscaID: ${cuscaId}`);
        return res.json({ 
            success: true, 
            message: 'Usuario marcado como no nuevo exitosamente.'
        });
    } catch (error) {
        console.error(`BACKEND DEBUG: Error al marcar usuario como no nuevo para CuscaID ${cuscaId}: ${error.message}`, error);
        return res.status(500).json({ 
            success: false, 
            message: 'Error interno del servidor al actualizar el estado del usuario.'
        });
    }
};

export default userController;
