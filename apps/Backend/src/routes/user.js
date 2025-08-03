import express from 'express';
import userController from '../controllers/UserController.js';

const router = express.Router();

// Ruta para marcar a un usuario como no nuevo
router.post('/mark-not-new', userController.markUserAsNotNew);

export default router;
