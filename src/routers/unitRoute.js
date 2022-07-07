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
  .post(unitController.addUnit)
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

router.get("/reviews", unitController.getAllReviews);

router
  .route("/reviews")
  .get(unitController.getAllReviews)
  .post(unitController.addReview);

module.exports = router;
