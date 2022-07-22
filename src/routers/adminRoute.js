const express = require("express");
const validationMW = require("../middlewares/validationMW");
const adminController = require("../controllers/adminController");
const { body, param, query } = require("express-validator");
const router = express.Router();

router
  .route("/admin")
  .get(adminOnly, adminController.getAllAdmins)
  .post(
    adminOnly,
    [
      body("age").isNumeric().withMessage("age should be number"),
      body("password")
        .isString()
        .withMessage("admin password should be string"),
      body("phone").isNumeric().withMessage("admin phone should be number"),
      body("national_id")
        .isNumeric()
        .withMessage("admin national ID should be number"),
      body("image").isString().withMessage("admin image should be string"),
      body("email").isString().withMessage("admin email should be string"),
    ],
    validationMW,
    adminController.createAdmin
  )
  .put(
    adminOnly,
    [
      body("id").isMongoId().withMessage("admin id should be MongoId"),
      body("age").isNumeric().withMessage("age should be number"),
      body("password")
        .isString()
        .withMessage("admin password should be string"),
      body("phone").isNumeric().withMessage("admin phone should be number"),
      body("image").isString().withMessage("admin image should be string"),
      body("email").isString().withMessage("admin email should be string"),
    ],
    validationMW,
    adminController.updateAdmin
  );

router
  .route("/admin/:id")
  .get(
    adminOnly,
    [param("id").isMongoId().withMessage("admin id should be objectID")],
    validationMW,
    adminController.getAdminByID
  )
  .delete(
    adminOnly,
    [param("id").isMongoId().withMessage("admin id should be objectID")],
    validationMW,
    adminController.deleteAdmin
  );

module.exports = router;
