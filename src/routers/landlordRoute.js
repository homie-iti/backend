const express = require('express')
const { body, param, query } = require('express-validator')
const validationMW = require('../middlewares/validationMW')
const landlordController = require('../controllers/landlordController')

const router = express.Router()

router
    .route('/landlords')
    .get(landlordController.getAllLandLord)
    .post(
        [
            body('_id')
                .isMongoId()
                .withMessage('landlord id should be MongoId'),
            body('landlordUnits')
                .isArray()
                .withMessage('landlord Units should be an Array'),
        ],
        validationMW,
        landlordController.CreateLandLord
    )

    .put(
        [
            body('id').isMongoId().withMessage('landlord id should be MongoId'),
            body('landlordUnits')
                .isMongoId()
                .withMessage('landlord Units should be MongoId'),
        ],
        validationMW,
        landlordController.updateLandlordUnits
    )

router
    .route('/landlords/:id')
    .get(
        [param('id').isMongoId().withMessage('landlord id should be objectID')],
        validationMW,
        landlordController.getLandLordById
    )
    .delete(
        [param('id').isMongoId().withMessage('landlord id should be objectID')],
        validationMW,
        landlordController.deleteLandlordById
    )

router.route('/landlords/:id/units').delete(
    [param('id').isMongoId().withMessage('landlord id should be objectID')],
    body('landlordUnits')
        .isMongoId()
        .withMessage('landlord Units should be MongoId'),

    validationMW,
    landlordController.RemoveLandlordUnits
)

module.exports = router
