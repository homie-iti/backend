const { body } = require("express-validator");


module.exports.helpQuestionPostValidtion=[
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