import MainAreasModel from "../models/MainArea.js";

const MainAreaController = {};

MainAreaController.getMainArea = async (req, res) => {
    try {
        const MainAreas = await MainAreasModel.find();
        res.status(200).json(MainAreas);
    } catch (error) {
        console.log("Error al obtener MainAreas:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

MainAreaController.insertMainArea = async (req, res) => {
    try {
        const { name } = req.body;
        
        // Validar que el nombre esté presente
        if (!name) {
            return res.status(400).json({ message: "El nombre es requerido" });
        }
        
        // Validar que el nombre tenga al menos 1 carácter
        if (name.trim().length < 1) {
            return res.status(400).json({ message: "El nombre debe tener al menos 1 carácter" });
        }
        
        const newMainArea = new MainAreasModel({ name: name.trim() });
        await newMainArea.save();
        
        res.status(200).json({ message: "MainArea saved" });
    } catch (error) {
        console.log("Error al insertar MainArea:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

MainAreaController.updateMainArea = async (req, res) => {
    try {
        const { name } = req.body;
        const { id } = req.params;
        
        // Validar que el ID esté presente
        if (!id) {
            return res.status(400).json({ message: "ID es requerido" });
        }
        
        // Validar que el nombre esté presente
        if (!name) {
            return res.status(400).json({ message: "El nombre es requerido" });
        }
        
        // Validar que el nombre tenga al menos 1 carácter
        if (name.trim().length < 1) {
            return res.status(400).json({ message: "El nombre debe tener al menos 1 carácter" });
        }
        
        const updatedMainArea = await MainAreasModel.findByIdAndUpdate(
            id, 
            { name: name.trim() }, 
            { new: true }
        );
        
        // Verificar si se encontró el MainArea
        if (!updatedMainArea) {
            return res.status(400).json({ message: "MainArea no encontrado" });
        }
        
        res.status(200).json({ message: "MainArea updated" });
    } catch (error) {
        console.log("Error al actualizar MainArea:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

MainAreaController.deleteMainArea = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validar que el ID esté presente
        if (!id) {
            return res.status(400).json({ message: "ID es requerido" });
        }
        
        const deletedMainArea = await MainAreasModel.findByIdAndDelete(id);
        
        // Verificar si se encontró el MainArea
        if (!deletedMainArea) {
            return res.status(400).json({ message: "MainArea no encontrado" });
        }
        
        res.status(200).json({ message: "MainArea deleted" });
    } catch (error) {
        console.log("Error al eliminar MainArea:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export default MainAreaController;