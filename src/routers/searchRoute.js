const express = require('express')
const { body, param, query } = require('express-validator')
const search = require('../controllers/searchController')

const validationMW = require('../middlewares/validationMW')

const router = express.Router()

router
    .route('/search')
    .get(
        [
            query('cityname')
                .isAlpha('en-US', { ignore: 's-.,;?' })
                .withMessage('cityname should be string'),
        ],
        validationMW,
        search.getCityByName
    )

module.exports = router
