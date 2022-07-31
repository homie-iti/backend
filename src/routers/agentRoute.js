const express = require('express')
const { body, param, query } = require('express-validator')
const validationMW = require('../middlewares/validationMW')
const agentController = require('../controllers/agentController')
const { authMW, adminOnly, adminAndUser } = require('../middlewares/authMW')

const router = express.Router()
// console.log(authMW);
router
    .route('/agents')
    // .get(authMW, adminOnly, agentController.getAllAgents)
    .get(
        [
            query('page')
                .optional()
                .isNumeric()
                .withMessage('Page number should number'),
        ],
        validationMW,
        agentController.getAgentsByPage
    )
    .post(
        [
            body('id').isMongoId().withMessage('id should be isMongoId '),
            // body('unitID')
            //     .isMongoId()
            //     .withMessage('unitID isMongoId should be isMongoId'),
        ],
        validationMW,
        agentController.createAgent
    )
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
    .get(
        [param('id').isMongoId().withMessage('agent id should be objectID')],
        validationMW,
        agentController.getAgentByID
    )
    .delete(
        [param('id').isMongoId().withMessage('agent id should be objectID')],
        validationMW,
        agentController.deleteAgent
    )

router
    .route('/agents/agentUnits')
    .get(
        [param('id').isMongoId().withMessage('favorite id should be objectID')],
        validationMW,
        agentController.updateAgentUnits
    )
    .put(
        [
            body('id').isMongoId().withMessage('agent id should be MongoId'),
            // body('agentUnits')
            //     .isMongoId()
            //     .withMessage('agent Units should be MongoId'),
        ],
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
        [param('id').isMongoId().withMessage('favorite id should be objectID')],
        validationMW,
        agentController.RemoveAgentUnits
    )

module.exports = router
