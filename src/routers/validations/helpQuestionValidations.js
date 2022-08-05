const { body, param } = require('express-validator')

const helpQuestionPostValidation = [
    // body("id").isMongoId().withMessage(" helpQuestion id is not valid"),
    //  body("question").isAlpha().withMessage("Question should be characters"),
    //  body("answer").optional().isAlpha({ ignore: " " }).withMessage("Answer should be characters"),

    body('question').isString().withMessage('Question should be characters'),
    body('answer')
        .optional()
        .isString()
        .withMessage('Answer should be characters'),
]
const helpQuestionUpdateValidation = [
    // body("id").isMongoId().withMessage("helpQuestion id is not valid "),
    body('question')
        .isString()
        .withMessage('Question name should be characters'),
    body('answer')
        .optional()
        .isString()
        .withMessage('Answer name should be characters'),
]



module.exports = {
    helpQuestionPostValidation,
    helpQuestionUpdateValidation
}
