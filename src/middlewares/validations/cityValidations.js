const { body, param } = require('express-validator')

const addCityValidations = [
    body('name')
        .exists()
        .withMessage('city name is required')
        .isAlphanumeric()
        .withMessage('city name can only contain characters and number'),
    body('cover').optional().isURL().withMessage('city cover must be a url'),
]

const updateCityValidations = [
    param('id')
        .exists()
        .withMessage('city id is required')
        .isMongoId()
        .withMessage('city id must be a mongo id'),
    body('')
        // .optional()
        // .withMessage('units are required')
        .isArray()
        .withMessage('body must be an array')
        .not()
        .isEmpty()
        .withMessage("body array can't be empty"),
]

const addUnitToCityValidations = [
    param('id')
        .exists()
        .withMessage('city id is required')
        .isMongoId()
        .withMessage('city id must be a mongo id'),
    body('units')
        .exists()
        .withMessage('units are required')
        .isArray()
        .withMessage('units must be an array')
        .not()
        .isEmpty()
        .withMessage("units array can't be empty"),
    body('units.*')
        .isMongoId()
        .withMessage('unit id in units field must be a mongo id'),
]

const deleteUnitFromCityValidations = [
    param('id')
        .exists()
        .withMessage('city id is required')
        .isMongoId()
        .withMessage('city id must be a mongo id'),
    body('units')
        .exists()
        .withMessage('units are required')
        .isArray()
        .withMessage('units must be an array')
        .not()
        .isEmpty()
        .withMessage("units array can't be empty"),
    body('units.*')
        .isMongoId()
        .withMessage('unit id in units field must be a mongo id'),
]

module.exports = {
    addCityValidations,
    updateCityValidations,
    addUnitToCityValidations,
    deleteUnitFromCityValidations,
}
