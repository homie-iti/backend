const express = require('express')

const router = express.Router()

const {
    forgetPassword,
    resetPassword,
} = require('../controllers/forgetPasswordController')
const validationMW = require('../middlewares/validationMW')

router.put('/forgetPassword', forgetPassword)
router.put('/resetPassword', resetPassword)

module.exports = router
