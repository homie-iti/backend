const express = require('express')
const { body, param } = require('express-validator')

const router = express.Router()
const validationMW = require('../middlewares/validationMW')
const paymentController = require('../controllers/paymentController')

router.post('/book-unit/:id', paymentController.bookUnit)
router.put('/confirm-booking/:id', paymentController.confirmBookingUnit)

router.put('/cancel-booking/:id', paymentController.cancelBookingUnit)

module.exports = router
