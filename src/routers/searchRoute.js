const express = require('express')
const { body, param, query } = require('express-validator')
const search = require('../controllers/searchController')

const validationMW = require('../middlewares/validationMW')

<<<<<<< HEAD
const router = express.Router()
=======
router.route("/search").get(
  [query("cityname").isAlpha().withMessage("cityname should be string")],
  validationMW,
  search.getCityByName
);
>>>>>>> rad-filterAndSort

router.route('/search/:name').get(
    [
        param('name')
            .matches(/^[A-Za-z\s]+$/)
            .withMessage('city name should be character'),
    ],
    validationMW,
    search.getCityByName
)

module.exports = router
