import express from "express";
import AreaController from "../controllers/AreaController.js";

const router = express.Router();


router.route("/")
.get(AreaController.getAreas)
.post(AreaController.insertAreas)

router.route("/:id")
.put(AreaController.updateAreas)
.delete(AreaController.deleteAreas)

export default router