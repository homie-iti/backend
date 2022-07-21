 const express = require("express");
 const router = express.Router();

const validationMW = require("../middlewares/validationMW");
const { userPostValidation, userUpdateValidation, userDeleteValidation } = require("../middlewares/validtion")
const userController = require("./../controllers/userController");
const upload=require('../middlewares/uploadImagesMW')


router.route("/users")

  .get(userController.getAllUsers)


  .post(userPostValidation, validationMW, userController.createUser)

  .put(userUpdateValidation, validationMW, userController.updateUser)

  .delete(userController.deleteManyUser)


router.route("/user/profileImage/:id")
  .post(upload("users/profileImage").single("profile"),
  userController.uploadUserImage);
 


 router.route("/users/:id") 
 
 .get(userController.getUserById)

  .delete(userDeleteValidation, validationMW, userController.deleteUser)


router.route("/users/myFavourite/:id")
    .get(userController.getAllFavUnits)
    .put(userController.updateFavUnit)



router.route("/users/myFavourite/:id/unit")
    .delete(userController.removeFavUnit)


  

 module.exports = router;
