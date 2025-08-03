// src/routes/workTeams.js

import express from 'express';
import WorkTeamController from '../controllers/WorkTeamController.js'; // Asegúrate de que la ruta sea correcta
import WorkTeamModel from "../models/WorkTeam.js"; // Se mantiene por si se usa en otras rutas directamente, pero no para la principal

const router = express.Router();

// Ruta GET para obtener TODOS los work teams (habilitados y deshabilitados)
// Ahora llama directamente al controlador que ya tiene la lógica de filtro.
router.get('/', WorkTeamController.getWorkTeams);

// Ruta para obtener un work team específico por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const workTeam = await WorkTeamModel
      .findById(id)
      .populate('supervisor', 'fullName cuscaId')
      .populate({
        path: 'employees.id',
        select: 'fullName cuscaId email position country',
        populate: {
          path: 'country',
          select: 'name'
        }
      })
      .populate({
        path: 'mainAreaArea',
        populate: [
          { path: 'mainArea', select: 'name' },
          { path: 'area', select: 'name' }
        ]
      });

    if (!workTeam) {
      return res.status(404).json({ message: 'Equipo de trabajo no encontrado' });
    }

    res.status(200).json(workTeam);
  } catch (error) {
    console.error('Error al obtener workTeam por ID:', error);
    res.status(500).json({
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// Ruta POST para crear work team
router.post('/', WorkTeamController.insertWorkTeam);

// Ruta PUT para actualizar un work team existente
router.put('/:id', WorkTeamController.updateWorkTeam);

// Ruta DELETE para eliminar un work team
router.delete('/:id', WorkTeamController.deleteWorkTeam);

// Ruta para obtener equipos de trabajo por empleado (ya usa el controlador)
router.get('/employee/:employeeId', WorkTeamController.getWorkTeamsByEmployee);

router.get('/employee-by-cusca/:cuscaId', WorkTeamController.getWorkTeamsByEmployeeCusca);

export default router;