const express = require('express')
const { body, param, query } = require('express-validator')
const search = require('../controllers/searchController')
const router = express.Router()

const validationMW = require('../middlewares/validationMW')

router.route("/search").get(
  [query("cityname").isAlpha().withMessage("cityname should be string")],
  validationMW,
  search.getCityByName
);



module.exports = router
