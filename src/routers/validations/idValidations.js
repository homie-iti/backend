function validateId(model, type) {
    return [
        type('id')
            .exists()
            .withMessage(`${model} id is required`)
            .isMongoId()
            .withMessage(`${model} id must be an objectId`),
    ]
}

module.exports = validateId
