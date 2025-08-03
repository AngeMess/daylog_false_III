import express from "express";
import loginController from "../controllers/LoginController.js"

const router = express.Router();

router.route("/").post(loginController.login);
router.route("/verify-token").post(loginController.verifyToken);
router.post('/unlock-account', loginController.unlockAccount); // Solo para admins


export default router;