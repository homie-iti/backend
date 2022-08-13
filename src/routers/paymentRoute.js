const express = require('express')

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
router.get(
    '/confirm-booking/:id',
    validateId('contract'),
    validationMW,
    paymentController.confirmBookingUnit
)

router.get(
    '/cancel-booking/:id',
    validateId('contract'),
    validationMW,
    paymentController.cancelBookingUnit
)

module.exports = router
