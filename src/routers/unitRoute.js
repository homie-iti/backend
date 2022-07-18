const express = require("express");
const router = express.Router();
const { body, param, query } = require("express-validator");

const {
  getAllUnits,
  getUnitById,
  getAllReviews,
  getUnitReviews,
  addReview,
  createUnit,
  updateUnitData,
  updateUnitImages,
  deleteUnitImages,
  deleteUnit,
  uploadCoverImage,
  uploadUnitImages,
} = require("../controllers/unitController");

const validationMW = require("./../middlewares/validationMW");
const {
  addUnitValidations,
  updateUnitValidations,
} = require("./../middlewares/unitValidations");

const uploadImage = require("./../middlewares/uploadImagesMW");

router
  .route("/units")
  .get(getAllUnits)
  .post(createUnit)
  .put(updateUnitValidations, validationMW, updateUnitData);

router
  .route("/units/:id")
  .get(
    [param("id").isMongoId().withMessage("Unit Id Must Be ObjectId")],
    validationMW,
    getUnitById
  )
  .delete(
    [param("id").isMongoId().withMessage("Unit Id Must Be ObjectId")],
    validationMW,
    deleteUnit
  );

router.route( "/units/images" )
  .put( updateUnitImages )
  .delete( deleteUnitImages );

router.post(
  "/units/cover/:id",
  [param("id").isMongoId().withMessage("Unit Id Must Be ObjectId")],
  validationMW,
  uploadImage("units/cover").single("cover"),
  uploadCoverImage
);

router.post(
  "/units/images/:id",
  [param("id").isMongoId().withMessage("Unit Id Must Be ObjectId")],
  validationMW,
  uploadImage("units/unitImages").array("unitImages", 5),
  uploadUnitImages
);

router.get(
  "/units/reviews/:id",
  [param("id").isMongoId().withMessage("Unit Id Must Be ObjectId")],
  validationMW,
  getUnitReviews
);

router.route("/reviews").get(getAllReviews).post(addReview);

module.exports = router;
