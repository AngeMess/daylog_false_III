const CountryController = {};
import CountryModel from "../models/Country.js";
import mongoose from "mongoose";

// Función auxiliar para validar ObjectId
const isValidObjectId = (id) => {
    return mongoose.Types.ObjectId.isValid(id);
};

// Función auxiliar para validar datos del país
const validateCountryData = (name, saturation) => {
    const errors = [];
    
    // Validar nombre
    if (!name) {
        errors.push("El nombre del país es requerido");
    } else if (typeof name !== 'string') {
        errors.push("El nombre debe ser una cadena de texto");
    } else if (name.trim().length === 0) {
        errors.push("El nombre no puede estar vacío");
    } else if (name.length > 20) {
        errors.push("El nombre no puede exceder los 20 caracteres");
    }
    
    // Validar saturación
    if (!saturation) {
        errors.push("El nivel de saturación es requerido");
    } else if (!['Alta', 'Normal', 'Baja'].includes(saturation)) {
        errors.push("El nivel de saturación solo puede ser: Alta, Normal o Baja");
    }
    
    return errors;
};

CountryController.getCountry = async (req, res) => {
    try {
        const countries = await CountryModel.find();
        res.status(200).json({
            success: true,
            data: countries,
            count: countries.length
        });
    } catch (error) {
        console.error('Error al obtener países:', error);
        res.status(500).json({
            success: false,
            message: "Error interno del servidor al obtener países",
            error: error.message
        });
    }
};

CountryController.insertCountry = async (req, res) => {
    try {
        const { name, saturation } = req.body;
        
        // Validar datos de entrada
        const validationErrors = validateCountryData(name, saturation);
        if (validationErrors.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Errores de validación",
                errors: validationErrors
            });
        }
        
        // Verificar si ya existe un país con el mismo nombre
        const existingCountry = await CountryModel.findOne({ 
            name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } 
        });
        
        if (existingCountry) {
            return res.status(409).json({
                success: false,
                message: "Ya existe un país con ese nombre"
            });
        }
        
        // Crear nuevo país
        const newCountry = new CountryModel({
            name: name.trim(),
            saturation
        });
        
        const savedCountry = await newCountry.save();
        
        res.status(201).json({
            success: true,
            message: "País creado exitosamente",
            data: savedCountry
        });
        
    } catch (error) {
        console.error('Error al crear país:', error);
        
        // Manejar errores específicos de MongoDB
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Ya existe un país con ese nombre"
            });
        }
        
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: "Errores de validación",
                errors: validationErrors
            });
        }
        
        res.status(500).json({
            success: false,
            message: "Error interno del servidor al crear país",
            error: error.message
        });
    }
};

CountryController.updateCountry = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, saturation } = req.body;
        
        // Validar ID
        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "ID de país inválido"
            });
        }
        
        // Validar que el país existe
        const existingCountry = await CountryModel.findById(id);
        if (!existingCountry) {
            return res.status(404).json({
                success: false,
                message: "País no encontrado"
            });
        }
        
        // Validar datos de entrada
        const validationErrors = validateCountryData(name, saturation);
        if (validationErrors.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Errores de validación",
                errors: validationErrors
            });
        }
        
        // Verificar si ya existe otro país con el mismo nombre
        const duplicateCountry = await CountryModel.findOne({ 
            name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
            _id: { $ne: id }
        });
        
        if (duplicateCountry) {
            return res.status(409).json({
                success: false,
                message: "Ya existe otro país con ese nombre"
            });
        }
        
        // Actualizar país
        const updatedCountry = await CountryModel.findByIdAndUpdate(
            id,
            { 
                name: name.trim(), 
                saturation 
            },
            { 
                new: true, 
                runValidators: true 
            }
        );
        
        res.status(200).json({
            success: true,
            message: "País actualizado exitosamente",
            data: updatedCountry
        });
        
    } catch (error) {
        console.error('Error al actualizar país:', error);
        
        // Manejar errores específicos de MongoDB
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Ya existe otro país con ese nombre"
            });
        }
        
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: "Errores de validación",
                errors: validationErrors
            });
        }
        
        res.status(500).json({
            success: false,
            message: "Error interno del servidor al actualizar país",
            error: error.message
        });
    }
};

CountryController.deleteCountry = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validar ID
        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "ID de país inválido"
            });
        }
        
        // Verificar que el país existe y eliminarlo
        const deletedCountry = await CountryModel.findByIdAndDelete(id);
        
        if (!deletedCountry) {
            return res.status(404).json({
                success: false,
                message: "País no encontrado"
            });
        }
        
        res.status(200).json({
            success: true,
            message: "País eliminado exitosamente",
            data: deletedCountry
        });
        
    } catch (error) {
        console.error('Error al eliminar país:', error);
        res.status(500).json({
            success: false,
            message: "Error interno del servidor al eliminar país",
            error: error.message
        });
    }
};

export default CountryController;