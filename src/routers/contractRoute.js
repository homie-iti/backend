const express = require("express");
const router = express.Router();
const { body, param, query } = require("express-validator");

const contractController = require("./../controllers/contractController");
const validationMW = require("./../middlewares/validationMW");
const {
  createContractValidations,
  updateContractValidations,
} = require("./../middlewares/contractValidations");

router.get(
  "/contracts/unit/:id",
  [param("id").isMongoId().withMessage("Unit Id Must Be ObjectId")],
  validationMW,
  contractController.getUnitContracts
);

router.get(
  "/contracts/landlord/:id",
  [param("id").isMongoId().withMessage("Unit Id Must Be ObjectId")],
  validationMW,
  contractController.getLandlordContracts
);

// router.get("/landlords", contractController.getAllLandlords);

router
  .route("/contracts")
  .get(contractController.getAllContracts)
  .post(createContractValidations, validationMW, contractController.addContract)
  .put(
    updateContractValidations,
    validationMW,
    contractController.updateContractData
  );

router.delete(
  "/unit/contract/:id",
  [param("id").isMongoId().withMessage("Unit Id Must Be ObjectId")],
  validationMW,
  contractController.deleteUnitContract
);

module.exports = router;
