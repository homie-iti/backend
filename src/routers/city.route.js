const express = require("express");
const router = express.Router();
const { body, param, query } = require("express-validator");

const cityController = require("../controllers/city.controller.js");

router.route("/cities").get(cityController.getAllCities);
router.route("/cities/:id").get(cityController.getCityUnits);

module.exports = router;
