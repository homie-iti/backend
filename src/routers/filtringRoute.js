const express = require('express')
const router = express.Router()
const { body, param, query } = require('express-validator')
const filtringsController = require('../controllers/filtringController')

// Homie?furniture=furnished&furniture=unfurnished&gender=male&gender=female&priceMax=130600&priceMin=19200
// &estateType="studio", "shared-room", "single-room", "apartment"&unitInfo=rooms bathroom  floor

router.route(`/Homie`).get(filtringsController.filteredUnit)

module.exports = router
