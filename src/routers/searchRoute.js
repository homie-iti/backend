const express = require("express");
const search = require("../controllers/searchController");

const { body, param, query } = require("express-validator");
const validationMW = require("../middlewares/validationMW");
const router = express.Router();

router
  .route("/search/:cityName")
  .get(
    [param("cityName").isAlpha().withMessage("city name should be character")],
    validationMW,
    search.getCityByName
  );

module.exports = router;
