const express = require('express')
const { param } = require('express-validator')
const validationMW = require('../middlewares/validationMW')
const agentController = require('../controllers/agentController')
const { authMW, adminOnly, adminAndUser } = require('../middlewares/authMW')
const {
    validateId,
    pageValidations,
} = require('../middlewares/validations/generalValidations')
const {
    addAgentValidations,
    updateAgentUnitsValidations,
} = require('../middlewares/validations/agentValidations')

const router = express.Router()
// console.log(authMW);
router
    .route('/agents')
    // .get(authMW, adminOnly, agentController.getAllAgents)
    .get(pageValidations, validationMW, agentController.getAgentsByPage)
    .post(addAgentValidations, validationMW, agentController.createAgent)
// .put(
//     [
//         body('id').isMongoId().withMessage('id should be isMongoId '),
//         body('unitID')
//             .isMongoId()
//             .withMessage('unitID isMongoId should be isMongoId'),
//     ],
//     validationMW,
//     agentController.updateAgent
// )
// .put(
//     authMW,
//     adminOnly,
//     [
//         body('id').isMongoId().withMessage('id should be isMongoId '),
//         body('unitID')
//             .isMongoId()
//             .withMessage('unitID isMongoId should be isMongoId'),
//     ],
//     validationMW,
//     agentController.updateAgent
// )

router
    .route('/agents/:id')
    .get(validateId('agent', param), validationMW, agentController.getAgentByID)
    .delete(
        validateId('agent', param),
        validationMW,
        agentController.deleteAgent
    )

router
    .route('/agents/agentUnits')
    // .get(
    //     [param('id').isMongoId().withMessage('favorite id should be objectID')],
    //     validationMW,
    //     agentController.updateAgentUnits
    // )
    .put(
        updateAgentUnitsValidations,
        validationMW,
        agentController.updateAgentUnits
    )

router
    .route('/agents/agentUnits/:id')
    .get(
        [param('id').isMongoId().withMessage('favorite id should be objectID')],
        validationMW,
        agentController.updateAgentUnits
    )

    .delete(
        validateId('agent', param),
        validationMW,
        agentController.RemoveAgentUnits
    )

module.exports = router
