const { body } = require('express-validator')

const helpQuestionPostValidation = [
    body('userId').isMongoId().withMessage(' userId must be objectId'),
    body('adminId').isMongoId().withMessage(' adminId must be objectId'),
    body('question')
        .isAlpha('en-US', { ignore: 's-.,;?' })
        .withMessage('Question should be characters'),
    body('answer')
        .optional()
        .isAlpha('en-US', { ignore: 's-.,;?' })
        .withMessage('Answer should be characters'),
]
const helpQuestionUpdateValidation = [
    body('userId').isMongoId().withMessage(' userId must be objectId'),
    body('adminId').isMongoId().withMessage(' adminId must be objectId'),
    body('question')
        .isAlpha('en-US', { ignore: 's-.,;?' })
        .withMessage('Question name should be characters'),
    body('answer')
        .optional()
        .isAlpha('en-US', { ignore: 's-.,;?' })
        .withMessage('Answer name should be characters'),
]

module.exports = {
    helpQuestionPostValidation,
    helpQuestionUpdateValidation,
}
