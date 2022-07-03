const express = require("express");
const router = express.Router();
const { body, param, query } = require('express-validator');
const recommendationsController = require("../controllers/recommednationsController");



router.route(`/recommendations/cities`)
    .get(recommendationsController.getCities)


router.route(`/recommendations/citiesNumber=Number`)
    .get(recommendationsController.getCities)





module.exports = router;