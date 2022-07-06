const express = require("express");
const router = express.Router();
const { body, param, query } = require("express-validator");

const unitController = require("./../controllers/unit.controller");
// const validationMW = require("./../middlewares/validationMW");

router.route("/units").get(unitController.getAllUnits);

router.route("/units/:id").get(unitController.getUnitById);

router.get("/units/reviews/:id", unitController.getUnitReviews);

module.exports = router;
