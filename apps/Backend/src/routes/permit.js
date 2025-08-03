import express from "express";
import PermitController from "../controllers/PermitController.js";

const router = express.Router();


router.route("/")
.get(PermitController.getPermit)
.post(PermitController.insertPermit)

router.route("/:id")
.put(PermitController.updatePermit)
.delete(PermitController.deletePermit)

export default router