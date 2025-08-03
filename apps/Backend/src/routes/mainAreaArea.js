import { Router } from 'express';
import {
  getMainAreaAreas,
  getMainAreaAreasByMainArea,
  createMainAreaArea,
  createMainAreaAreas,
  updateMainAreaArea,
  deleteMainAreaArea,
  deleteMainAreaAreas,
  checkRelationExists
} from '../controllers/MainAreaAreaControllers.js'; // Ajusta la ruta según tu estructura

const router = Router();

// Rutas GET
router.get('/', getMainAreaAreas); // Obtener todas las relaciones
router.get('/main-area/:mainAreaId', getMainAreaAreasByMainArea); // Obtener por área madre
router.get('/check/:mainAreaId/:areaId', checkRelationExists); // Verificar si existe relación

// Rutas POST
router.post('/', createMainAreaArea); // Crear una relación
router.post('/bulk', createMainAreaAreas); // Crear múltiples relaciones (PRINCIPAL para tu caso)

// Rutas PUT
router.put('/:id', updateMainAreaArea); // Actualizar una relación

// Rutas DELETE
router.delete('/:id', deleteMainAreaArea); // Eliminar una relación
router.delete('/bulk-delete', deleteMainAreaAreas); // Eliminar múltiples relaciones

export default router;