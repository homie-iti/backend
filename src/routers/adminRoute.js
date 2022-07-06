const express = require("express");
const validationMW = require("../middlewares/validationMW");
const adminController = require("../controllers/adminController");
const { body, param, query } = require("express-validator");
const router = express.Router();

router
  .route("/admin")
  .get(adminController.getAllAdmins)
  .post(
    // [
    //   body("id").isMongoId().withMessage("admin id should be MongoId"),
    //   body("fullname")
    //     .isString()
    //     .withMessage("admin name should be characters"),
    //   body("age").isNumeric().withMessage("age should be number"),
    //   body("password")
    //     .isString()
    //     .withMessage("admin password should be string"),
    //   body("phone").isNumeric().withMessage("admin phone should be number"),
    //   body("national_id")
    //     .isNumeric()
    //     .withMessage("admin national ID should be number"),
    //   body("image").isString().withMessage("admin image should be string"),
    //   body("email").isString().withMessage("admin email should be string"),
    //   body("address").isObject().withMessage("admin address should be object"),
    // ],
    // validationMW,
    adminController.createAdmin
  )
  .put(
    // [
    //   body("id").isMongoId().withMessage("admin id should be MongoId"),
    //   body("fullname")
    //     .isString()
    //     .withMessage("student name should be characters"),
    //   body("age").isNumeric().withMessage("age should be number"),
    //   body("password")
    //     .isString()
    //     .withMessage("admin password should be string"),
    //   body("phone").isNumeric().withMessage("admin phone should be number"),
    //   body("nationalID")
    //     .isNumeric()
    //     .withMessage("admin national ID should be number"),
    //   body("image").isString().withMessage("admin image should be string"),
    //   body("email").isString().withMessage("admin email should be string"),
    //   body("address").isObject().withMessage("admin address should be object"),
    // ],
    // validationMW,
    adminController.updateAdmin
  );

router
  .route("/admin/:id")
  .get(
    [param("id").isMongoId().withMessage("admin id should be objectID")],
    validationMW,
    adminController.getAdminByID
  )
  .delete(
    [param("id").isMongoId().withMessage("admin id should be objectID")],
    validationMW,
    adminController.deleteAdmin
  );

module.exports = router;
