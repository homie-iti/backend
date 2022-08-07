const express = require('express')

const router = express.Router()
const { query } = require('express-validator')

const validationMW = require('../middlewares/validationMW')
const {
    userPostValidation,
    userUpdateValidation,
    userDeleteValidation,
} = require('../middlewares/validations/usersValidations')
const userController = require('../controllers/userController')
const upload = require('../middlewares/uploadImagesMW')

router
    .route('/users')
    .get(
        [
            query('page')
                .optional()
                .isNumeric()
                .withMessage('Page number should number'),
        ],
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
        upload('users/profileImage').single('profile'),
        userController.uploadUserImage
    )
    .put(userController.updateUserImage)

router
    .route('/users/:id')

    .get(userController.getUserById)

    .delete(userDeleteValidation, validationMW, userController.deleteUser)

router
    .route('/users/myFavourite/:id')
    .get(userController.getAllFavUnits)
    .put(userController.updateFavUnit)

router.route('/users/myFavourite/:id/unit').delete(userController.removeFavUnit)

module.exports = router
