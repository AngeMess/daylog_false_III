import express from "express";
import ActivityController from "../controllers/ActivityController.js";

const router = express.Router();


router.route("/")
.get(ActivityController.getActivity)
.post(ActivityController.insertActivity)

router.route("/:id")
.put(ActivityController.updateActivity)
.delete(ActivityController.deleteActivity)

router.route("/project/:projectId/employee-counts").get(ActivityController.getEmployeeCountsByProject)

export default router