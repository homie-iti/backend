const express = require("express");
const router = express.Router();
const { body, param, query } = require("express-validator");

const contractController = require("./../controllers/contractController");
const validationMW = require("./../middlewares/validationMW");

router.get("/unit/contracts/:id", contractController.getUnitContracts);

router.get("/landlord/contracts/:id", contractController.getLandlordContracts);

router.get("/landlords", contractController.getAllLandlords);

router
  .route("/contracts")
  .get(contractController.getAllContracts)
  .post(contractController.addContract);

module.exports = router;
