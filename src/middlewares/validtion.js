const { body } = require("express-validator");


const helpQuestionPostValidtion = [
    // body("id").isMongoId().withMessage(" helpQuestion id is not valid"),
    //  body("question").isAlpha().withMessage("Question should be characters"),
    //  body("answer").optional().isAlpha({ ignore: " " }).withMessage("Answer should be characters"),

    body("question").isString().withMessage("Question should be characters"),
    body("answer").optional().isString().withMessage("Answer should be characters")

]
const helpQuestionUpdateValidtion = [
    // body("id").isMongoId().withMessage("helpQuestion id is not valid "),
    body("question").isString().withMessage("Question name should be characters"),
    body("answer").optional().isString().withMessage("Answer name should be characters"),
]

const helpQuestionDeleteValidtion = [

    body("id").isMongoId().withMessage("helpQuestion id is not valid "),
]

const userPostValidtion = [
    //body("id").isMongoId().withMessage("user id should be a number"),
    body("fullName").isAlpha('en-US', { ignore: " " }).withMessage("user name should be characters"),
    body("age").isNumeric({ min: 18 }).withMessage("user age is not valid"),
    body("gender").isIn(['male', 'female']).withMessage("user gender is not valid"),
    body("address").isObject().withMessage("user address is not valid"),
    body("email").isEmail().withMessage("user email is not valid"),
    body("phone").isAlphanumeric().withMessage("userPhone should be characters"),
    body("password").isString({ min: 8 }).isLength({ min: 8 }).withMessage("password cannot be less than 8 characters"),
    //body("national_id ").isNumeric().withMessage("user national_id  is not valid"),
]


const userUpdateValidation = [
    // body("id").isMongoId().withMessage("user id should be a number"),
    body("fullName").isAlpha('en-US', { ignore: " " }).withMessage("user name should be characters"),
    body("age").isNumeric({ min: 18 }).withMessage("user age is not valid"),
    body("gender").isIn(['male', 'female']).withMessage("user gender is not valid"),
    body("address").optional().isObject().withMessage("user address is not valid"),
    body("email").isEmail().withMessage("user email is not valid"),
    body("phone").isAlphanumeric().withMessage("userPhone should be characters"),
    body("password").isString({ min: 8 }).isLength({ min: 8 }).withMessage("password cannot be less than 8 characters"),
    //  body("national_id ").isNumeric().withMessage("user national_id  is not valid"),
    body("address.city").optional().isAlpha('en-US', { ignore: " " }).withMessage("city is not valid"),
    //body("address.street").exists({ checkFalsy: true }).withMessage("street is not valid"),
    // body("address.building").exists({ checkFalsy: true }).withMessage("building is not valid"),
]

const userDeleteValidtion = [
    // body("id").isMongoId().withMessage("user id is not valid "),
]
module.exports = {
    helpQuestionPostValidtion,
    helpQuestionUpdateValidtion,
    helpQuestionDeleteValidtion,
    userDeleteValidtion,
    userUpdateValidation,
    userPostValidtion,

}