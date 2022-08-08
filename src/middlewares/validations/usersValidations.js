const { body } = require('express-validator')

const userPostValidation = [
    body('fullName')
        .isAlpha('en-US', { ignore: 's' })
        .withMessage('user name should be characters')
        .isLength({ min: 3 })
        .withMessage('user name should be at least 3 characters'),

    body('age').isNumeric({ min: 18 }).withMessage('userAge is not valid'),

    body('gender')
        .isIn(['male', 'female'])
        .withMessage('user gender is not valid'),

    body('address').isObject().withMessage('Unit Address should be object '),
    body('address.city')
        .isAlpha('en-US', { ignore: 's-.,;?' })
        .withMessage('City should be characters'),

    body('address.streetName')
        .optional()
        .isAlphanumeric('en-US', { ignore: 's-.,;?' })
        .withMessage('StreetName should be characters'),

    body('address.buildingNumber')
        .optional()
        .isNumeric()
        .withMessage('buildingNumber should be number'),

    body('email').isEmail().withMessage('userEmail is not valid'),

    body('phone')
        .isAlphanumeric()
        .withMessage('userPhone should be characters'),

    body('password')
        .isString({ min: 8 })
        .isLength({ min: 8 })
        .withMessage('password cannot be less than 8 characters')
        .isStrongPassword()
        .withMessage('please enter strong password'),

    body('national_id')
        .isNumeric()
        .withMessage('user national_id  is not valid'),
]

const userUpdateValidation = [
    body('fullName')
        .optional()
        .isAlpha('en-US', { ignore: 's' })
        .withMessage('user name should be characters'),
    body('age')
        .isNumeric({ min: 18 })
        .withMessage('user age is not valid')
        .optional(),
    body('gender')
        .isIn(['male', 'female'])
        .withMessage('user gender is not valid')
        .optional(),
    body('address')
        .optional()
        .isObject()
        .withMessage('user address is not valid'),
    body('email').isEmail().withMessage('user email is not valid').optional(),
    body('phone')
        .isAlphanumeric()
        .withMessage('userPhone should be characters')
        .optional(),
    body('password')
        .isString({ min: 8 })
        .isLength({ min: 8 })
        .withMessage('password cannot be less than 8 characters')
        .optional(),
    body('address.city')
        .optional()
        .isAlpha('en-US', { ignore: 's-.,;?' })
        .withMessage('city is not valid'),
]

module.exports = {
    userUpdateValidation,
    userPostValidation,
}
