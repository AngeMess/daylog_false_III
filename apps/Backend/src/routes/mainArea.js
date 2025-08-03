import express from "express";
import MainAreaController from "../controllers/MainAreaController.js";

const router = express.Router();


router.route("/")
.get(MainAreaController.getMainArea)
.post(MainAreaController.insertMainArea)

router.route("/:id")
.put(MainAreaController.updateMainArea)
.delete(MainAreaController.deleteMainArea)

export default router