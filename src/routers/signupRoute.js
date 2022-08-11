const express = require('express')
const signupController = require('../controllers/signupController')
const validationMW = require('../middlewares/validationMW')
const {
    checkAvailabilityValidations,
    signUpValidations,
    activateAccountValidations,
} = require('../middlewares/validations/signupValidations')
const { accountCreationLimiter } = require('../middlewares/rateLimitMW')

const router = express.Router()

router
    .route('/signup/check-availability')
    .post(
        checkAvailabilityValidations,
        validationMW,
        signupController.checkAvailability
    )

router
    .route('/signup')
    .post(
        signUpValidations,
        validationMW,
        accountCreationLimiter,
        signupController.signup
    )

router
    .route('/activate-account/:slug')
    .get(
        activateAccountValidations,
        validationMW,
        signupController.activateAccount
    )

module.exports = router
