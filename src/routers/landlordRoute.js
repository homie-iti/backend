const express = require('express')
const validationMW = require('../middlewares/validationMW')
const {
    validateId,
    pageValidations,
} = require('../middlewares/validations/generalValidations')
const {
    addLandlordValidations,
    updateLandlordValidations,
    removeLandlordUnitsValidations,
} = require('../middlewares/validations/landlordValidations')
const landlordController = require('../controllers/landlordController')

const router = express.Router()

router
    .route('/landlords')
    .get(pageValidations, validationMW, landlordController.getLandlordsByPage)
    .post(
        addLandlordValidations,
        validationMW,
        landlordController.CreateLandLord
    )

    .put(
        updateLandlordValidations,
        validationMW,
        landlordController.updateLandlordUnits
    )

router
    .route('/landlords/:id')
    .get(
        validateId('landlord'),
        validationMW,
        landlordController.getLandLordById
    )
    .delete(
        validateId('landlord'),
        validationMW,
        landlordController.deleteLandlordById
    )

router
    .route('/landlords/:id/units')
    .delete(
        removeLandlordUnitsValidations,
        validationMW,
        landlordController.RemoveLandlordUnits
    )

module.exports = router
