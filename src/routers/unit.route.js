const express = require("express");
const router = express.Router();
const { body, param, query } = require("express-validator");

const unitController = require("./../controllers/unit.controller");

router.route( "/units" )
      .get( unitController.getAllUnits );




module.exports = router;
