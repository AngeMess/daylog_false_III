import express from "express";
import CountryController from "../controllers/CountryController.js";

const router = express.Router();


router.route("/")
.get(CountryController.getCountry)
.post(CountryController.insertCountry)

router.route("/:id")
.put(CountryController.updateCountry)
.delete(CountryController.deleteCountry)

export default router