const express = require('express')

const router = express.Router()
const validationMW = require('../middlewares/validationMW')
const { validateId } = require('../middlewares/validations/generalValidations')
const favoriteController = require('../controllers/favouriteController')

router
    .route('/users/:userId/favorites')
    .get(favoriteController.getUserFavUnits)
    .post(favoriteController.addUnitToFavorite)

router
    .route('/users/:userId/favorites/:unitId')
    .delete(favoriteController.deleteUnitFromFavorites)

module.exports = router
