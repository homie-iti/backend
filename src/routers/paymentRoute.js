const express = require('express')
const { param } = require('express-validator')

const router = express.Router()
const validationMW = require('../middlewares/validationMW')
const { validateId } = require('../middlewares/validations/generalValidations')
const paymentController = require('../controllers/paymentController')

router.post(
    '/book-unit/:id',
    validateId('unit'),
    validationMW,
    paymentController.bookUnit
)
router.put(
    '/confirm-booking/:id',
    validateId('contract'),
    validationMW,
    paymentController.confirmBookingUnit
)

router.put(
    '/cancel-booking/:id',
    validateId('contract'),
    validationMW,
    paymentController.cancelBookingUnit
)

module.exports = router
