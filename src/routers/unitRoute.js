const express = require("express");
const router = express.Router();
const { body, param, query } = require("express-validator");

const unitController = require("../controllers/unitController");

const validationMW = require("./../middlewares/validationMW");
const {
  addUnitValidations,
  updateUnitValidations,
} = require("./../middlewares/unitValidations");

const uploadImage = require("./../middlewares/uploadImagesMW");

router
  .route("/units")
  .get(unitController.getAllUnits)
  .post(unitController.createUnit)
  .put(updateUnitValidations, validationMW, unitController.updateUnitData);

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

router
  .route("/units/images")
  .put(unitController.updateUnitImages)
  .delete(unitController.deleteUnitImages);

router.post(
  "/units/cover/:id",
  [param("id").isMongoId().withMessage("Unit Id Must Be ObjectId")],
  validationMW,
  uploadImage("units/cover").single("cover"),
  unitController.uploadCoverImage
);

router.post(
  "/units/images/:id",
  [param("id").isMongoId().withMessage("Unit Id Must Be ObjectId")],
  validationMW,
  uploadImage("units/unitsImages").array("unitImages", 5),
  unitController.uploadUnitImages
);

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
