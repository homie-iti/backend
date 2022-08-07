const express = require('express')

const router = express.Router()
const { param } = require('express-validator')

const validationMW = require('../middlewares/validationMW')
const {
    userPostValidation,
    userUpdateValidation,
} = require( '../middlewares/validations/usersValidations' )

const {
    validateId,
    pageValidations,
} = require('../middlewares/validations/generalValidations')
const userController = require('../controllers/userController')
const upload = require('../middlewares/uploadImagesMW')

router
    .route('/users')
    .get(
        pageValidations,
        validationMW,
        userController.getUsersByPage
    )
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
        validateId('user', param),
        validationMW,
        upload('users/profileImage').single('profile'),
        userController.uploadUserImage
    )
    .put(userController.updateUserImage)

router
    .route('/users/:id')

    .get(validateId('user', param), validationMW, userController.getUserById)

    .delete(validateId('user', param), validationMW, userController.deleteUser)

router
    .route('/users/myFavourite/:id')
    .get(validateId('user', param), validationMW, userController.getAllFavUnits)
    .put(validateId('user', param), validationMW, userController.updateFavUnit)

router
    .route('/users/myFavourite/:id/unit')
    .delete(
        validateId('user', param),
        validationMW,
        userController.removeFavUnit
    )

module.exports = router
