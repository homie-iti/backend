const { body, param, query } = require('express-validator')

let addUnitValidations = [
    body('estateType')
        .isIn(['studio', 'shared-room', 'single-room', 'apartment'])
        .withMessage(
            'EstateType Must Be (Studio||Shared-Room||Single-Room||Apartment)'
        ),

    body('address').isObject().withMessage('Unit Address should be object '),
    body('address.city')
        .isAlpha()
        .withMessage('Unit City should be characters'),

    body('address.streetName').optional().isAlpha().withMessage('Unit Street '),

    body('address.buildingNumber')
        .optional()
        .isNumeric()
        .withMessage('Unit Building Number should be number'),

    body('dailyPrice')
        .isNumeric()
        .withMessage('Unit Daily Price Must Be Number'),
    body('isAvailable')
        .isBoolean()
        .withMessage(
            'Unit Availability Must Be Added as true(available), false(unavailable)'
        ),
    body('isPetsAllowed')
        .isBoolean()
        .withMessage('Pets Allowed or Not-allowed Must Be Added ')
        .optional(),
]

let updateUnitValidations = [
    body('estateType')
        .isIn(['studio', 'shared-room', 'single-room', 'apartment'])
        .withMessage(
            'EstateType Must Be (Studio||Shared-Room||Single-Room||Apartment)'
        )
        .optional(),

    body('address')
        .isObject()
        .withMessage('Unit Address should be object ')
        .optional(),
    body('address.city')
        .isAlpha()
        .withMessage('Unit City should be characters')
        .optional(),

    body('address.streetName').optional().isAlpha().withMessage('Unit Street '),

    body('address.buildingNumber')
        .optional()
        .isNumeric()
        .withMessage('Unit Building Number should be number'),

    body('dailyPrice')
        .isNumeric()
        .withMessage('Unit Daily Price Must Be Number')
        .optional(),
    body('isAvailable')
        .isBoolean()
        .withMessage(
            'Unit Availability Must Be Added as true(available), false(unavailable)'
        )
        .optional(),
    body('isPetsAllowed')
        .isBoolean()
        .withMessage('Pets Allowed or Not-allowed Must Be Added ')
        .optional(),
]

module.exports = {
    addUnitValidations,
    updateUnitValidations,
}
