const express = require("express");
const validationMW = require("../middlewares/validationMW");
const landlordController = require("../controllers/landlordController");
const { body, param, query } = require("express-validator");
const router = express.Router();

router.route("/landlord")
    .get(landlordController.getAllLandLord)
    .post(
        [
            body("id").isMongoId().withMessage("landlord id should be MongoId"),
            body("landlordUnits").isArray().withMessage("landlord Units should be an Array")
        ],
        validationMW,
        landlordController.CreateLandLord
    )

    .put(
        [
            body("id").isMongoId().withMessage("landlord id should be MongoId"),
            body("landlordUnits").isArray().withMessage("landlord Units should be an Array")
        ],
        validationMW,
        landlordController.updateLandlordUnits
    )
    .delete(
        [
            body("id").isMongoId().withMessage("landlord id should be MongoId"),
            body("landlordUnits").isArray().withMessage("landlord Units should be an Array")
        ],
        validationMW,
        landlordController.RemoveLandlordUnits
    )



router.route("/landlord/:id")
    .get(
        [param("id").isMongoId().withMessage("landlord id should be objectID")],
        validationMW,
        landlordController.getLandLordById
    )
    .delete(
        [param("id").isMongoId().withMessage("landlord id should be objectID")],
        validationMW,
        landlordController.deleteLandlordById
    );


module.exports = router;