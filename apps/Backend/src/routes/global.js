import express from "express";
import GlobalController from "../controllers/GlobalController.js";

const router = express.Router();

router.get("/stats", GlobalController.getGlobalStats);

export default router; 