const { body } = require('express-validator')

const addUnitValidations = [
    body('landlordId').isMongoId().withMessage('Unit Id Must Be ObjectId'),
    body('cityId').isMongoId().withMessage('Unit Id Must Be ObjectId'),
    body('estateType')
        .isIn(['studio', 'shared-room', 'single-room', 'apartment'])
        .withMessage(
            'EstateType Must Be (Studio||Shared-Room||Single-Room||Apartment)'
        ),
    body('allowedGender')
        .isIn(['female', 'male', 'any'])
        .withMessage('allowedGender Must Be (female||male||any)'),

    body('address').isObject().withMessage('Unit Address should be object '),
    body('address.city')
        .isAlpha()
        .withMessage('Unit City should be characters'),

    body('address.streetName')
        .optional()
        .isAlphanumeric()
        .withMessage('Unit Street '),

    body('address.buildingNumber')
        .optional()
        .isNumeric()
        .withMessage('Unit Building Number should be number'),

    body('unitInfo').isObject().withMessage('unitInfo should be object '),
    body('unitInfo.description')
        .isAlpha('en-US', { ignore: 's-.,;?' })
        .withMessage('unitInfo.description should be characters'),

    body('unitInfo.rooms')
        .isNumeric()
        .withMessage('unitInfo.rooms should be number'),

    body('unitInfo.bathrooms')
        .isNumeric()
        .withMessage('unitInfo.bathrooms should be number'),
    body('unitInfo.floor')
        .isNumeric()
        .withMessage('unitInfo.floor should be number'),

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
    body('cover').isURL().withMessage('Unit Cover must be image url.'),
]

const updateUnitValidations = [
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
