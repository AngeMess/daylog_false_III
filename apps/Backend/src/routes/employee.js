import express from 'express';
import employeeController from '../controllers/EmployeeController.js';

const router = express.Router();

// ⚠️ IMPORTANTE: Las rutas específicas deben ir ANTES que las rutas con parámetros

// 🔥 RUTAS ESPECÍFICAS PRIMERO (antes de /:id)
router.get('/active-sessions-count', employeeController.getActiveSessionsCount);
router.get('/employees/active-sessions', employeeController.getActiveSessionsCount);
router.get('/employees/valid-tokens', employeeController.getValidTokensCount);
router.get('/stats', employeeController.getUserStats); // Si tienes esta ruta
router.post('/verify-password', employeeController.verifyPassword);
router.post('/change-password', employeeController.changePassword);

// 📋 RUTAS CON PARÁMETROS ESPECÍFICOS
router.get('/cusca/:cuscaId', employeeController.getEmployeeByCuscaId);

// 🔄 RUTAS GENERALES Y CON PARÁMETROS AL FINAL
router.get('/', employeeController.getEmployee);
router.get('/:id', employeeController.getEmployeeById);
router.put('/:id', employeeController.updateEmployee);
router.delete('/:id', employeeController.deleteEmployee);

export default router;