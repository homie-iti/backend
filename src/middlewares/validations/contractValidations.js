const { body, param } = require('express-validator')

const createContractValidations = [
    body('landlordId').isMongoId().withMessage('LandlordId should be ObjectId'),
    body('agentId').isMongoId().withMessage('AgentId should be ObjectId'),
    body('unitId').isMongoId().withMessage('CityId should be ObjectId'),
    body('rentalStart').isDate().withMessage('Rental Start Should Be Date.'),
    body('rentalEnd').isDate().withMessage('Rental End Should Be Date.'),
    body('paymentAmount')
        .optional()
        .isNumeric()
        .withMessage('paymentAmount Should be Number'),
    body('paymentMethod')
        .isIn(['paypal', 'bank', 'cash'])
        .withMessage('Payment Method Must Be (paypal||bank||cash)'),
    body('totalAmount').isNumeric().withMessage('Total Amount Must Be Number'),
    body('offerPercentage')
        .optional()
        .isNumeric()
        .withMessage('Offer Percentage Must Be Number'),
]

const updateContractValidations = [
    body('unitId').isMongoId().withMessage('CityId should be ObjectId'),
    body('rentalStart')
        .isDate()
        .withMessage('Rental Start Should Be Date.')
        .optional(),
    body('rentalEnd')
        .isDate()
        .withMessage('Rental Start Should Be Date.')
        .optional(),
    body('paymentAmount')
        .isNumeric()
        .withMessage('paymentAmount Should be Number')
        .optional(),
    body('paymentMethod')
        .isIn(['paypal', 'bank', 'cash'])
        .withMessage('Payment Method Must Be (paypal||bank||cash)')
        .optional(),
    body('totalAmount')
        .isNumeric()
        .withMessage('Total Amount Must Be Number')
        .optional(),
    body('offerPercentage')
        .isNumeric()
        .withMessage('Offer Percentage Must Be Number')
        .optional(),
]

const deleteUnitContractValidations = [
    param('contractId').isMongoId().withMessage('ContractId must be objectId.'),
    param('id').isMongoId().withMessage('UnitId must be objectId.'),
]
module.exports = {
    createContractValidations,
    updateContractValidations,
    deleteUnitContractValidations,
}
