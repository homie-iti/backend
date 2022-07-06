const express = require("express");
const router = express.Router();
const { body, param, query } = require("express-validator");

const contractController = require("./../controllers/contractController");
const validationMW = require("./../middlewares/validationMW");

router.get("/landlord/contracts/:id", contractController.getLandlordContracts);

router.get( "/landlords", contractController.getAllLandlords );

module.exports = router;
