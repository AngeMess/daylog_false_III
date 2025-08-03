import MainAreaArea from '../models/MainArea-Area.js'; // Ajusta la ruta según tu estructura

// Obtener todas las relaciones
export const getMainAreaAreas = async (req, res) => {
  try {
    const relations = await MainAreaArea.find()
      .populate('mainArea', 'name')
      .populate('area', 'name')
      .sort({ createdAt: -1 });
    
    res.status(200).json(relations);
  } catch (error) {
    console.error('Error al obtener relaciones:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

// Obtener relaciones por área madre
export const getMainAreaAreasByMainArea = async (req, res) => {
  try {
    const { mainAreaId } = req.params;
    
    const relations = await MainAreaArea.find({ mainArea: mainAreaId })
      .populate('mainArea', 'name')
      .populate('area', 'name')
      .sort({ createdAt: -1 });
    
    res.status(200).json(relations);
  } catch (error) {
    console.error('Error al obtener relaciones por área madre:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

// Crear múltiples relaciones (bulk insert)
export const createMainAreaAreas = async (req, res) => {
  try {
    const { relations } = req.body;
    
    if (!relations || !Array.isArray(relations) || relations.length === 0) {
      return res.status(400).json({ message: 'Se requiere un array de relaciones válido' });
    }

    // Validar que cada relación tenga los campos requeridos
    for (const relation of relations) {
      if (!relation.mainArea || !relation.area) {
        return res.status(400).json({ 
          message: 'Cada relación debe tener mainArea y area' 
        });
      }
    }

    // Verificar si alguna relación ya existe
    const existingRelations = [];
    for (const relation of relations) {
      const existing = await MainAreaArea.findOne({
        mainArea: relation.mainArea,
        area: relation.area
      });
      if (existing) {
        existingRelations.push(existing);
      }
    }

    if (existingRelations.length > 0) {
      return res.status(409).json({ 
        message: 'Algunas relaciones ya existen',
        existingRelations 
      });
    }

    // Crear las relaciones
    const createdRelations = await MainAreaArea.insertMany(relations);
    
    // Populate los datos para la respuesta
    const populatedRelations = await MainAreaArea.find({
      _id: { $in: createdRelations.map(r => r._id) }
    })
    .populate('mainArea', 'name')
    .populate('area', 'name');

    res.status(201).json({
      message: `Se crearon ${createdRelations.length} relaciones exitosamente`,
      createdRelations: populatedRelations,
      count: createdRelations.length
    });
  } catch (error) {
    console.error('Error al crear relaciones múltiples:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

// Crear una sola relación
export const createMainAreaArea = async (req, res) => {
  try {
    const { mainArea, area, amountEmployees = 0 } = req.body;
    
    if (!mainArea || !area) {
      return res.status(400).json({ message: 'Se requieren mainArea y area' });
    }

    // Verificar si la relación ya existe
    const existingRelation = await MainAreaArea.findOne({ mainArea, area });
    if (existingRelation) {
      return res.status(409).json({ 
        message: 'La relación ya existe',
        existingRelation 
      });
    }

    const newRelation = new MainAreaArea({
      mainArea,
      area,
      amountEmployees
    });

    const savedRelation = await newRelation.save();
    
    // Populate para la respuesta
    const populatedRelation = await MainAreaArea.findById(savedRelation._id)
      .populate('mainArea', 'name')
      .populate('area', 'name');

    res.status(201).json(populatedRelation);
  } catch (error) {
    console.error('Error al crear relación:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

// Actualizar una relación
export const updateMainAreaArea = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedRelation = await MainAreaArea.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
    .populate('mainArea', 'name')
    .populate('area', 'name');

    if (!updatedRelation) {
      return res.status(404).json({ message: 'Relación no encontrada' });
    }

    res.status(200).json(updatedRelation);
  } catch (error) {
    console.error('Error al actualizar relación:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

// Eliminar una relación
export const deleteMainAreaArea = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedRelation = await MainAreaArea.findByIdAndDelete(id);

    if (!deletedRelation) {
      return res.status(404).json({ message: 'Relación no encontrada' });
    }

    res.status(200).json({ 
      message: 'Relación eliminada exitosamente',
      deletedRelation 
    });
  } catch (error) {
    console.error('Error al eliminar relación:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

// Eliminar múltiples relaciones
export const deleteMainAreaAreas = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'Se requiere un array de IDs válido' });
    }

    const result = await MainAreaArea.deleteMany({ _id: { $in: ids } });

    res.status(200).json({
      message: `Se eliminaron ${result.deletedCount} relaciones exitosamente`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error al eliminar relaciones múltiples:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

// Verificar si existe una relación
export const checkRelationExists = async (req, res) => {
  try {
    const { mainAreaId, areaId } = req.params;

    const relation = await MainAreaArea.findOne({
      mainArea: mainAreaId,
      area: areaId
    });

    res.status(200).json({
      exists: !!relation,
      relation: relation || null
    });
  } catch (error) {
    console.error('Error al verificar relación:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};