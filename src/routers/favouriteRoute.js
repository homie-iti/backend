const express = require('express')

const router = express.Router()
const { body, param, query } = require('express-validator')
const favouriteController = require('../controllers/favouriteController')

router
    .route('/myFavourite/:id')
    .get(favouriteController.getAllFavUnits)
    .put(favouriteController.updateFavUnit)

router.route('/myFavourite/:id/unit').delete(favouriteController.removeFavUnit)

module.exports = router
