const express = require("express");
const router = express.Router();
const { body, param, query } = require('express-validator');
const filtringsController = require("../controllers/filtringandsortingController");



router.route(`/cities/:id`)
    .get(filtringsController.filteredUnit)





module.exports = router;