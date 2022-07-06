const express = require("express");
const router = express.Router();
const { body, param, query } = require("express-validator");

const unitController = require("../controllers/unitController");
const validationMW = require("./../middlewares/validationMW");
const {
  addUnitValidations,
  updateUnitValidations,
} = require("./../middlewares/unitValidations");

router
  .route("/units")
  .get(unitController.getAllUnits)
  .put(updateUnitValidations, validationMW, unitController.updateUnitData);

router
  .route("/units/:id")
  .get(
    [param("id").isMongoId().withMessage("Unit Id Must Be ObjectId")],
    validationMW,
    unitController.getUnitById
  );

router.get(
  "/units/reviews/:id",
  [param("id").isMongoId().withMessage("Unit Id Must Be ObjectId")],
  validationMW,
  unitController.getUnitReviews
);

module.exports = router;
