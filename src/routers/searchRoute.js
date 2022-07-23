const express = require("express");
const search = require("../controllers/searchController");

const { body, param, query } = require("express-validator");
const validationMW = require("../middlewares/validationMW");
const router = express.Router();

router.route("/search").get(
  [query("cityname").isAlpha().withMessage("cityname should be string")],
  validationMW,
  search.getCityByName
);

module.exports = router;
