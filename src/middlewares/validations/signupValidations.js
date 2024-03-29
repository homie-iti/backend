const { body, param } = require('express-validator')

const checkAvailabilityValidations = [
    body().custom((value, { req, loc, path }) => {
        // console.log(value)

        const bodyKeysArr = Object.keys(value)
        // console.log(bodyKeysArr)
        let errMessage

        if (bodyKeysArr.length === 0)
            errMessage = "You didn't enter fields to check"
        else if (bodyKeysArr.length !== 1)
            errMessage = 'Enter one field to check'
        else if (!['nationalId', 'phone', 'email'].includes(bodyKeysArr[0]))
            errMessage = 'You can only validate  nationalId, phone or email'
        else errMessage = ''

        if (errMessage) throw new Error(errMessage)
        else return value
    }),
    body('email').optional().isEmail().withMessage("email field isn't valid"),
    body('phone')
        .optional()
        .isNumeric()
        .withMessage("phone field isn't a number"),
    body('nationalId')
        .optional()
        .isNumeric()
        .withMessage("nationalId field isn't a number"),
]

const signUpValidations = [
    body('firstName')
        .exists()
        .withMessage("firstName field isn't provided")
        .isAlpha('en-US', { ignore: 's-.,;?' })
        .withMessage("firstName value isn't valid"),
    body('middleName')
        .exists()
        .withMessage("middleName field isn't provided")
        .isAlpha('en-US', { ignore: 's-.,;?' })
        .withMessage("middleName value isn't valid"),
    body('lastName')
        .exists()
        .withMessage("lastName field isn't provided")
        .isAlpha('en-US', { ignore: 's-.,;?' })
        .withMessage("lastName value isn't valid"),
    body('gender')
        .exists()
        .withMessage("gender field isn't provided")
        .isIn(['male', 'female'])
        .withMessage("gender value isn't valid"),
    body('age')
        .exists()
        .withMessage("age field isn't provided")
        .isNumeric()
        .isInt()
        .withMessage("age value isn't valid"),
    body('confirmPassword')
        .exists()
        .withMessage("confirmPassword field isn't provided")
        .isString()
        .withMessage("confirmPassword value isn't valid"),
    body('password')
        .exists()
        .withMessage("password field isn't provided")
        .isString()
        .withMessage("password value isn't valid")
        .custom((value, { req, loc, path }) => {
            if (value !== req.body.confirmPassword) {
                // trow error if passwords do not match
                throw new Error("Passwords don't match")
            } else {
                return value
            }
        }),
    body('email')
        .exists()
        .withMessage("email field isn't provided")
        .isEmail()
        .withMessage("email value isn't valid"),
    body('phone')
        .exists()
        .withMessage("phone field isn't provided")
        // .optional()
        .isNumeric()
        .withMessage("phone value isn't valid"),
    body('nationalId')
        .exists()
        .withMessage("nationalId field isn't provided")
        // .optional()
        .isNumeric()
        .withMessage("nationalId value isn't valid"),
]

const activateAccountValidations = [
    param('slug')
        .exists()
        .withMessage("account slug isn't provided")
        .isMongoId()
        .withMessage("account slug isn't valid"),
]
module.exports = {
    checkAvailabilityValidations,
    signUpValidations,
    activateAccountValidations,
}
