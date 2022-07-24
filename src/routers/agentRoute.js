const express = require('express')
const { body, param, query } = require('express-validator')
const validationMW = require('../middlewares/validationMW')
const agentController = require('../controllers/agentController')
const { adminOnly, adminAndUser } = require('../middlewares/authMW')

const router = express.Router()

router
    .route('/agent')
    .get(adminOnly, agentController.getAllAgents)
    .post(
        adminOnly,
        [
            body('id').isMongoId().withMessage('id should be isMongoId '),
            body('unitID')
                .isMongoId()
                .withMessage('unitID isMongoId should be isMongoId'),
        ],
        validationMW,
        agentController.createAgent
    )
    .put(
        adminOnly,
        [
            body('id').isMongoId().withMessage('id should be isMongoId '),
            body('unitID')
                .isMongoId()
                .withMessage('unitID isMongoId should be isMongoId'),
        ],
        validationMW,
        agentController.updateAgent
    )

router
    .route('/agent/:id')
    .get(
        adminAndUser,
        [param('id').isMongoId().withMessage('agent id should be objectID')],
        validationMW,
        agentController.getAgentByID
    )
    .delete(
        adminAndUser,
        [param('id').isMongoId().withMessage('agent id should be objectID')],
        validationMW,
        agentController.deleteAgent
    )

router
    .route('/agent/agentUnits')
    .get(
        adminAndUser,
        [param('id').isMongoId().withMessage('favorite id should be objectID')],
        validationMW,
        agentController.updateAgentUnits
    )
    .put(
        adminAndUser,
        [
            body('id').isMongoId().withMessage('agent id should be MongoId'),
            body('agentUnits')
                .isMongoId()
                .withMessage('agent Units should be MongoId'),
        ],
        validationMW,
        agentController.updateAgentUnits
    )

router
    .route('/agent/agentUnits/:id')
    .get(
        adminAndUser,
        [param('id').isMongoId().withMessage('favorite id should be objectID')],
        validationMW,
        agentController.updateAgentUnits
    )

    .delete(
        adminAndUser,
        [param('id').isMongoId().withMessage('favorite id should be objectID')],
        validationMW,
        agentController.RemoveAgentUnits
    )

module.exports = router
