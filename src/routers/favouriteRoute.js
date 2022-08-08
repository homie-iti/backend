const express = require('express')

const router = express.Router()
const validationMW = require('../middlewares/validationMW')
const { validateId } = require('../middlewares/validations/generalValidations')
const favouriteController = require('../controllers/favouriteController')

router
    .route('/myFavourite/:id')
    .get(validateId('agent'), validationMW, favouriteController.getAllFavUnits)
    .put(validateId('agent'), validationMW, favouriteController.updateFavUnit)

router
    .route('/myFavourite/:id/unit')
    .delete(
        validateId('agent'),
        validationMW,
        favouriteController.removeFavUnit
    )

module.exports = router
