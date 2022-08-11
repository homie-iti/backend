const { body } = require('express-validator')

const addAdminValidations = [
    body('fullName')
        .isAlpha('en-US', { ignore: 's' })
        .withMessage('user name should be characters'),
    body('age').isNumeric().withMessage('age should be number'),
    body('email').isString().withMessage('admin email should be string'),
    body('password').isString().withMessage('admin password should be string'),
    body('phone').isNumeric().withMessage('admin phone should be number'),
    body('national_id')
        .isNumeric()
        .withMessage('admin national ID should be number'),
]

const updateAdminValidations = [
    body('fullName')
        .isAlpha('en-US', { ignore: 's' })
        .withMessage('user name should be characters')
        .optional(),
    body('age').isNumeric().withMessage('age should be number').optional(),
    body('email')
        .isString()
        .withMessage('admin email should be string')
        .optional(),
    body('password')
        .isString()
        .withMessage('admin password should be string')
        .optional(),
    body('phone')
        .isNumeric()
        .withMessage('admin phone should be number')
        .optional(),
    body('national_id')
        .isNumeric()
        .withMessage('admin national ID should be number')
        .optional(),
]
module.exports = { addAdminValidations, updateAdminValidations }
