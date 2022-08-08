const express = require('express')

const router = express.Router()

const validationMW = require('../middlewares/validationMW')
const {
    userPostValidation,
    userUpdateValidation,
} = require('../middlewares/validations/usersValidations')

const {
    validateId,
    pageValidations,
} = require('../middlewares/validations/generalValidations')
const userController = require('../controllers/userController')
const upload = require('../middlewares/uploadImagesMW')

router
    .route('/users')
    .get(pageValidations, validationMW, userController.getUsersByPage)
    .post(
        userPostValidation,
        validationMW,
        upload('users/profileImage').single('profile'),
        userController.createUser
    )

    .put(userUpdateValidation, validationMW, userController.updateUser)

    .delete(userController.deleteManyUser)

router
    .route('/users/profileImage/:id')
    .post(
        validateId('user'),
        validationMW,
        upload('users/profileImage').single('profile'),
        userController.uploadUserImage
    )
    .put(userController.updateUserImage)

router
    .route('/users/:id')

    .get(validateId('user'), validationMW, userController.getUserById)

    .delete(validateId('user'), validationMW, userController.deleteUser)

router
    .route('/users/myFavourite/:id')
    .get(validateId('user'), validationMW, userController.getAllFavUnits)
    .put(validateId('user'), validationMW, userController.updateFavUnit)

router
    .route('/users/myFavourite/:id/unit')
    .delete(validateId('user'), validationMW, userController.removeFavUnit)

module.exports = router
