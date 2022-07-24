const express = require('express')
const { body, param, query } = require('express-validator')

const signupController = require('../controllers/searchController')
const validationMW = require('../middlewares/validationMW')

const router = express.Router()

router.route('/signup').post(
    [
        body('firstName')
            .exists()
            .withMessage("firstName field isn't provided")
            .isAlpha()
            .withMessage("firstName value isn't valid"),
        body('middleName')
            .exists()
            .withMessage("middleName field isn't provided")
            .isAlpha()
            .withMessage("middleName value isn't valid"),
        body('lastName')
            .exists()
            .withMessage("lastName field isn't provided")
            .isAlpha()
            .withMessage("lastName value isn't valid"),
        body('gender')
            .exists()
            .withMessage("lastName field isn't provided")
            .isIn(['male', 'female'])
            .withMessage("lastName value isn't valid"),
        body('age')
            .exists()
            .withMessage("age field isn't provided")
            .isNumeric()
            .isInt()
            .withMessage("age value isn't valid"),
        body('password')
            .exists()
            .withMessage("password field isn't provided")
            .isString()
            .withMessage("password value isn't valid"),
        body('email')
            .exists()
            .withMessage("email field isn't provided")
            .isEmail()
            .withMessage("email value isn't valid"),
        body('phone')
            .withMessage("phone field isn't provided")
            // .optional()
            .isNumeric()
            .withMessage("phone value isn't valid"),
        body('nationalId')
            .withMessage("nationalId field isn't provided")
            // .optional()
            .isNumeric()
            .withMessage("nationalId value isn't valid"),
    ],
    validationMW,
    signupController.signup
)

router
    .route('/signup/check-availability')
    .post(
        [
            body('email')
                .optional()
                .isEmail()
                .withMessage("email field isn't valid"),
            body('phone')
                .optional()
                .isNumeric()
                .withMessage("phone field isn't a number"),
            body('nationalId')
                .optional()
                .isNumeric()
                .withMessage("nationalId field isn't a number"),
        ],
        validationMW,
        signupController.checkAvailability
    )

module.exports = router
