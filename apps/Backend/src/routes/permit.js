import express from "express";
import PermitController from "../controllers/PermitController.js";
import { validateAuthToken } from "../middleware/validateAuthToken.js";

const router = express.Router();

// Aplicar middleware de autenticación a todas las rutas de permisos
// Los empleados pueden gestionar sus propios permisos
router.use(validateAuthToken(['employee', 'supervisor', 'admin']));

router.route("/")
.get(PermitController.getPermit)
.post(PermitController.insertPermit)

router.route("/:id")
.put(PermitController.updatePermit)
.delete(PermitController.deletePermit)

export default router