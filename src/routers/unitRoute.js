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
  .post(unitController.createUnit)
  .put(updateUnitValidations, validationMW, unitController.updateUnitData);

router.get("/cities", unitController.getAllcities);
router
  .route("/units/:id")
  .get(
    [param("id").isMongoId().withMessage("Unit Id Must Be ObjectId")],
    validationMW,
    unitController.getUnitById
  )
  .delete(
    [param("id").isMongoId().withMessage("Unit Id Must Be ObjectId")],
    validationMW,
    unitController.deleteUnit
  );

router.put("/units/images", unitController.updateUnitImages);

router.get(
  "/units/reviews/:id",
  [param("id").isMongoId().withMessage("Unit Id Must Be ObjectId")],
  validationMW,
  unitController.getUnitReviews
);

router
  .route("/reviews")
  .get(unitController.getAllReviews)
  .post(unitController.addReview);

module.exports = router;
