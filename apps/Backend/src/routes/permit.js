import express from "express";
import PermitController from "../controllers/PermitController.js";
import { validateAuthToken } from "../middleware/validateAuthToken.js";

const router = express.Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(validateAuthToken(['employee', 'supervisor', 'portfolio', 'admin']));

router.route("/")
.get(PermitController.getPermit)
.post(PermitController.insertPermit)

router.route("/:id")
.put(PermitController.updatePermit)
.delete(PermitController.deletePermit)

// Rutas adicionales que ya están en el controlador
router.route("/state/:state")
.get(PermitController.getPermitsByState)

router.route("/stats")
.get(PermitController.getPermitStats)

export default router