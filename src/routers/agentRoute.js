const express = require('express')
const validationMW = require('../middlewares/validationMW')
const agentController = require('../controllers/agentController')
const { body, param, query } = require('express-validator')
const router = express.Router()

router
    .route('/agent')
    .get(adminOnly, agentController.getAllAgents)
    .post(
        adminOnly,
        [
            body('id').isMongoId().withMessage('agent id should be MongoId'),
            body('fullname')
                .isString()
                .withMessage('agent name should be characters'),
            body('age').isNumeric().withMessage('age should be number'),
            body('password')
                .isString()
                .withMessage('agent password should be string'),
            body('gender')
                .isString()
                .withMessage('agent gender should be string'),
            body('phone')
                .isNumeric()
                .withMessage('agent phone should be number'),
            body('national_id')
                .isNumeric()
                .withMessage('agent national ID should be number'),
            body('image')
                .isString()
                .withMessage('agent image should be string'),
            body('email')
                .isString()
                .withMessage('agent email should be string'),
            body('address')
                .isObject()
                .withMessage('agent address should be object'),
        ],
        validationMW,
        agentController.createAgent
    )
    .put(
        adminOnly,
        [
            body('id').isMongoId().withMessage('agent id should be MongoId'),
            body('fullname')
                .isString()
                .withMessage('agent name should be characters'),
            body('age').isNumeric().withMessage('age should be number'),
            body('password')
                .isString()
                .withMessage('agent password should be string'),
            body('gender')
                .isString()
                .withMessage('agent gender should be string'),
            body('phone')
                .isNumeric()
                .withMessage('agent phone should be number'),
            body('nationalID')
                .isNumeric()
                .withMessage('agent national ID should be number'),
            body('image')
                .isString()
                .withMessage('agent image should be string'),
            body('email')
                .isString()
                .withMessage('agent email should be string'),
            body('address')
                .isObject()
                .withMessage('agent address should be object'),
        ],
        validationMW,
        agentController.updateAgent
    )

router
    .route('/agent/:id')
    .get(
        adminAndOwner,
        [param('id').isMongoId().withMessage('agent id should be objectID')],
        validationMW,
        agentController.getAgentByID
    )
    .delete(
        adminAndOwner,
        [param('id').isMongoId().withMessage('agent id should be objectID')],
        validationMW,
        agentController.deleteAgent
    )

router
    .route('/agent/agentUnits')
    .get(
        adminAndOwner,
        [param('id').isMongoId().withMessage('favorite id should be objectID')],
        validationMW,
        agentController.updateAgentUnits
    )
    .put(
        adminAndOwner,
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
        adminAndOwner,
        [param('id').isMongoId().withMessage('favorite id should be objectID')],
        validationMW,
        agentController.updateAgentUnits
    )

    .delete(
        adminAndOwner,
        [param('id').isMongoId().withMessage('favorite id should be objectID')],
        validationMW,
        agentController.RemoveAgentUnits
    )

module.exports = router
