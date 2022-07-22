const express = require('express')
const { body, param, query } = require('express-validator')
const search = require('../controllers/searchController')

const validationMW = require('../middlewares/validationMW')

const router = express.Router()

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
