const express = require("express");
const search = require("../controller/searchController");
const router = express.Router();

router
  .route("/search/:id")
  .get(
    [param("id").isMongoId().withMessage("city id should be objectID")],
    [param("name").isString().withMessage("city name should be character")],
    search.getCityByID
  );

module.exports = router;
