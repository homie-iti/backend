const { body } = require("express-validator");


module.exports.helpQuestionPostValidtion = [
    body("id").isMongoId().withMessage(" helpQuestion id is not valid"),
    body("question").isAlpha().withMessage("Question should be characters"),
    body("answer").optional().isAlpha().withMessage("Answer should be characters"),

]

module.exports.helpQuestionUpdateValidtion = [
    body("id").isMongoId().withMessage("helpQuestion id is not valid "),
    body("question").isAlpha().withMessage("Question name should be characters"),
    body("answer").optional().isAlpha().withMessage("Answer name should be characters"),
]

module.exports.helpQuestionDeleteValidtion = [

    body("id").isMongoId().withMessage("helpQuestion id is not valid "),
]

module.exports.userPostValidtion = [
    body("id").isMongoId().withMessage("user id should be a number"),
    body("fullName").optional().isAlpha('en-US', { ignore: " " }).withMessage("user name should be characters"),
    body("age").optional().isNumeric({ min: 18 }).withMessage("user age is not valid"),
    body("gender").optional().isIn(['male', 'female']).withMessage("user gender is not valid"),
    body("address").optional().isObject().withMessage("user address is not valid"),
    body("email").optional().isEmail().withMessage("user email is not valid"),
    body("phone").isAlpha().withMessage("userPhone should be characters"),
    body("password").optional().isString({ min: 8 }).isLength({ min: 8 }).withMessage("password cannot be less than 8 characters"),
    body("national_id ").isNumeric().withMessage("user national_id  is not valid"),
]


module.exports.userUpdateValidation = [
    body("id").isMongoId().withMessage("user id should be a number"),
    body("fullName").optional().isAlpha('en-US', { ignore: " " }).withMessage("user name should be characters"),
    body("age").optional().isNumeric({ min: 18 }).withMessage("user age is not valid"),
    body("gender").optional().isIn(['male', 'female']).withMessage("user gender is not valid"),
    body("address").optional().isObject().withMessage("user address is not valid"),
    body("email").optional().isEmail().withMessage("user email is not valid"),
    body("phone").isAlpha().withMessage("userPhone should be characters"),
    body("password").optional().isString({ min: 8 }).isLength({ min: 8 }).withMessage("password cannot be less than 8 characters"),
    body("national_id ").isNumeric().withMessage("user national_id  is not valid"),
    body("address.city").optional().isAlpha('en-US', { ignore: " " }).withMessage("city is not valid"),
    body("address.street").optional().exists({ checkFalsy: true }).withMessage("street is not valid"),
    body("address.building").optional().exists({ checkFalsy: true }).withMessage("building is not valid"),
]

module.exports.userDeleteValidtion = [
    body("id").isMongoId().withMessage("user id is not valid "),
]