const express = require('express')
const router = express.Router()
const { body, param, query } = require('express-validator')
const filtringsController = require('../controllers/filtringandsortingController')

router.route(`/Homie`).get(filtringsController.filteredUnit)


router.route(`/Homie/:id`)
    .get(filtringsController.filteredUnit)





module.exports = router;
