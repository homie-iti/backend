<<<<<<<< HEAD:src/routers/validations/userValidations.js
const { body } = require('express-validator')
========
const { body, param } = require('express-validator')

>>>>>>>> origin/main:src/middlewares/validations/usersValidations.js

const userPostValidation = [
    // body("id").isMongoId().withMessage("user id should be a number"),
    body('fullName')
        .isAlpha('en-US', { ignore: ' ' })
        .withMessage('user name should be characters'),
    body('age').isNumeric({ min: 18 }).withMessage('userAge is not valid'),
    body('gender')
        .isIn(['male', 'female'])
        .withMessage('user gender is not valid'),
    body('address').isObject().withMessage('userAddress is not valid'),
    body('email').isEmail().withMessage('userEmail is not valid'),
    body('phone')
        .isAlphanumeric()
        .withMessage('userPhone should be characters'),
    body('password')
        .isString({ min: 8 })
        .isLength({ min: 8 })
        .withMessage('password cannot be less than 8 characters'),
    // body("national_id ").isNumeric().withMessage("user national_id  is not valid"),
]

const userUpdateValidation = [
    // body("id").isMongoId().withMessage("user id should be a number"),
    body('fullName')
        .optional()
        .isAlpha('en-US', { ignore: ' ' })
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
    //  body("national_id ").isNumeric().withMessage("user national_id  is not valid"),
    body('address.city')
        .optional()
        .isAlpha('en-US', { ignore: ' ' })
        .withMessage('city is not valid'),
    // body("address.street").exists({ checkFalsy: true }).withMessage("street is not valid"),
    // body("address.building").exists({ checkFalsy: true }).withMessage("building is not valid"),
]

module.exports = {
<<<<<<<< HEAD:src/routers/validations/userValidations.js
========

    userDeleteValidation,
>>>>>>>> origin/main:src/middlewares/validations/usersValidations.js
    userUpdateValidation,
    userPostValidation,
}
