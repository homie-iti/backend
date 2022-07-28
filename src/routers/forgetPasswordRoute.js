const express = require('express')
const { body } = require('express-validator')

const router = express.Router()

const {
    forgetPassword,
    resetPassword,
} = require('../controllers/forgetPasswordController')
const validationMW = require('../middlewares/validationMW')

router.put(
    '/forgetPassword',
    [body('email').isEmail().withMessage('Please enter valid email')],
    validationMW,
    forgetPassword
)
router.put(
    '/resetPassword',
    [
        body('newPassword')
            .isStrongPassword()
            .withMessage('Please enter strong password')
            .isLength({ min: 8 })
            .withMessage('Password should be at least 6 characters..'),
    ],
    validationMW,
    resetPassword
)

module.exports = router
