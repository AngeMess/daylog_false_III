import express from "express";
import regiterEmployeeController from "../controllers/RegisterEmployeeController.js"

const router = express.Router();


router.route("/")
.post(regiterEmployeeController.register)


export default router