const AreasController = {};

import AreasModel from "../models/Area.js";

// GET - Obtener todas las áreas
AreasController.getAreas = async (req, res) => {
    try {
        // Lógica de negocio
        const areas = await AreasModel.find();
        
        // Respuesta exitosa (200)
        res.status(200).json(areas);
    } catch (error) {
        // Manejo de errores internos (500)
        console.log("Error al obtener áreas:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// POST - Insertar área(s)
AreasController.insertAreas = async (req, res) => {
    try {
        const data = req.body;

            // Validaciones para inserción única
            const { name } = data;
            if (!name) {
                return res.status(400).json({ message: "El nombre es requerido" });
            }
            if (name.trim().length < 1) {
                return res.status(400).json({ message: "El nombre debe tener al menos 1 carácter" });
            }
            
            // Lógica de negocio para un solo documento
            const newArea = new AreasModel({ name: name.trim() });
            await newArea.save();
            
            // Respuesta exitosa (200)
            res.status(200).json({ message: "Área guardada correctamente" });
        
    } catch (error) {
        // Manejo de errores internos (500)
        console.log("Error al insertar área(s):", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// PUT - Actualizar área
AreasController.updateAreas = async (req, res) => {
    try {
        const { name } = req.body;
        const { id } = req.params;

        // Validaciones (retornan 400 si fallan)
        if (!id) {
            return res.status(400).json({ message: "El ID es requerido" });
        }
        if (!name) {
            return res.status(400).json({ message: "El nombre es requerido" });
        }
        if (name.trim().length < 1) {
            return res.status(400).json({ message: "El nombre debe tener al menos 1 carácter" });
        }

        // Lógica de negocio
        const updatedArea = await AreasModel.findByIdAndUpdate(
            id, 
            { name: name.trim() }, 
            { new: true }
        );

        if (!updatedArea) {
            return res.status(400).json({ message: "Área no encontrada" });
        }

        // Respuesta exitosa (200)
        res.status(200).json({ message: "Área actualizada correctamente" });
    } catch (error) {
        // Manejo de errores internos (500)
        console.log("Error al actualizar área:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// DELETE - Eliminar área
AreasController.deleteAreas = async (req, res) => {
    try {
        const { id } = req.params;

        // Validaciones (retornan 400 si fallan)
        if (!id) {
            return res.status(400).json({ message: "El ID es requerido" });
        }

        // Lógica de negocio
        const deletedArea = await AreasModel.findByIdAndDelete(id);

        if (!deletedArea) {
            return res.status(400).json({ message: "Área no encontrada" });
        }

        // Respuesta exitosa (200)
        res.status(200).json({ message: "Área eliminada correctamente" });
    } catch (error) {
        // Manejo de errores internos (500)
        console.log("Error al eliminar área:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export default AreasController;