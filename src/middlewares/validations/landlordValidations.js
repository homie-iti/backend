const { body, param } = require('express-validator')

const addLandlordValidations = [
    body('_id').isMongoId().withMessage('landlord id should be MongoId'),
    body('landlordUnits')
        .isArray()
        .withMessage('landlord Units should be an Array'),
]

const updateLandlordValidations = [
    body('id').isMongoId().withMessage('landlord id should be MongoId'),
    body('landlordUnits')
        .isMongoId()
        .withMessage('landlord Units should be MongoId'),
]

const removeLandlordUnitsValidations = [
    param('id').isMongoId().withMessage('landlord id should be objectID'),
    body('landlordUnits')
        .isMongoId()
        .withMessage('landlord Units should be MongoId'),
]

module.exports = {
    addLandlordValidations,
    updateLandlordValidations,
    removeLandlordUnitsValidations,
}
