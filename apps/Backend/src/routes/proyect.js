import express from 'express';
import ProyectController from '../controllers/ProyectController.js';

const router = express.Router();

// Nueva ruta para obtener proyectos por WorkTeam IDs
router.post("/by-workteams", async (req, res) => {
  console.log("[BY-WORKTEAMS] Entrada a la ruta");
  console.log("[BY-WORKTEAMS] Body recibido:", req.body);

  try {
    // Aquí es donde llamas al método del controlador
    await ProyectController.getProyectsByWorkTeams(req, res);
  } catch (error) {
    console.error("[BY-WORKTEAMS] Error en la ruta:", error);
    res.status(500).json({
      message: "Error interno del servidor",
      error: error.message
    });
  }
});

// RUTAS DEL DASHBOARD
router.get('/stats/dashboard', ProyectController.getDashboardStats);
router.get('/stats/supervisors', ProyectController.getSupervisorStats);
router.get('/stats/chart-data', ProyectController.getProjectsChartData);

// Ruta para obtener proyectos por supervisor CuscaID
router.get("/proyects/supervisor/:supervisorCuscaId", ProyectController.getProyectsBySupervisor);

// RUTAS GENERALES (con parámetros dinámicos al final)
router.get('/', ProyectController.getProyect);
router.get('/:id', ProyectController.getProyectById);
router.post('/', ProyectController.insertProyect);
router.put('/:id', ProyectController.updateProyect);
router.delete('/:id', ProyectController.deleteProyect);
router.patch('/:id/soft-delete', ProyectController.softDeleteProyect);

export default router;