const { body } = require('express-validator')

const addAgentValidations = [
    body('_id').isMongoId().withMessage('agent id must be objectId'),
    body('agentUnits.*.unitId')
        .isMongoId()
        .withMessage('unitId must be objectId'),
    body('agentUnits.*.numberOfRenting')
        .isNumeric()
        .withMessage('numberOfRenting must be number '),
]

const updateAgentUnitsValidations = [
    body('_id').isMongoId().withMessage('agent id should be isMongoId '),
    body('agentUnits.*.unitId')
        .isMongoId()
        .withMessage('unitId must be objectId'),
    body('agentUnits.*.numberOfRenting')
        .optional()
        .isNumeric()
        .withMessage('numberOfRenting must be number '),
]

module.exports = {
    addAgentValidations,
    updateAgentUnitsValidations,
}
