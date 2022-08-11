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

    .delete(userController.deleteManyUser)

router
    .route('/users/profileImage/:id')
    .post(
        validateId('user'),
        validationMW,
        upload('users/profileImage').single('profile'),
        userController.uploadUserImage
    )
    .put(
        validateId('user'),
        validationMW,
        upload('users/profileImage').single('profile'),
        userController.updateUserImage
    )

router
    .route('/users/:id')

    .get(validateId('user'), validationMW, userController.getUserById)

    .delete(validateId('user'), validationMW, userController.deleteUser)

    .put(
        validateId('user'),
        userUpdateValidation,
        validationMW,
        userController.updateUser
    )

router
    .route('/users/myFavourite/:id')
    .get(validateId('user'), validationMW, userController.getAllFavUnits)
    .put(validateId('user'), validationMW, userController.updateFavUnit)

router
    .route('/users/myFavourite/:id/unit')
    .delete(validateId('user'), validationMW, userController.removeFavUnit)

module.exports = router
