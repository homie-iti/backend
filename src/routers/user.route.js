const express = require("express");
const router = express.Router();
const { body, param, query } = require("express-validator");

const userController = require("./../controllers/user.controller");

router.route("/users")

.get(userController.getAllUsers)


.post(
    //[

//     body("fullName").isAlpha().withMessage("Teacher name should be characters"),
//     body("email").isEmail().withMessage("Teacher email must be content email @ "),
//     body("password").isAlphanumeric().withMessage("teacher password must be contain number and alpha")
//       .isLength({ min: 6 }).withMessage("teacher =>length must be  6 letters"),

//   ],
//     validationMW,
userController.createUser)



router.route("/users/:id")
  .get(
    //body("_id").isMongoId().withMessage("teacherId must be ObjectID")
    // ,
    // validationMW
    // ,
    userController.getUserById)


    


module.exports = router;
