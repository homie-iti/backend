const { query, param } = require('express-validator')

function validateId(model) {
    return [
        param('id')
            .exists()
            .withMessage(`${model} id is required`)
            .isMongoId()
            .withMessage(`${model} id must be an objectId`),
    ]
}

const pageValidations = [
    query('page')
        .optional()
        .isNumeric()
        .withMessage('Page number should number'),
]
module.exports = { validateId, pageValidations }
