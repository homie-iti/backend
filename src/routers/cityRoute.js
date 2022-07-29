const express = require('express')

const router = express.Router()
const { body, param, query } = require('express-validator')
const validateMW = require('../middlewares/validationMW')

const cityController = require('../controllers/cityController')

router
    .route('/cities')
    .get(
        [query('page').isNumeric().withMessage('Page number should number')],
        validateMW,
        cityController.getCitiesByPage
    )
    .post(
        [
            body('name')
                .exists()
                .withMessage('city name is required')
                .isAlphanumeric()
                .withMessage(
                    'city name can only contain characters and number'
                ),
            body('cover')
                .optional()
                .isURL()
                .withMessage('city cover must be a url'),
        ],
        // classValidator.creationValidator,
        validateMW,
        cityController.createCity
    )
    .delete(
        [
            body('id')
                .exists()
                .withMessage('city id is required')
                .isMongoId()
                .withMessage('city id must be a mongo id'),
        ],
        // classValidator.idBodyValidator,
        validateMW,
        cityController.deleteCity
    )
// .put(
// 	classValidator.updatingValidator,
// 	validateMW,
// 	classController.updateClass
// )

router
    .route('/cities/:id')
    .get(validateMW, cityController.getCityById)
    .put(
        [
            param('id')
                .exists()
                .withMessage('city id is required')
                .isMongoId()
                .withMessage('city id must be a mongo id'),
            // TODO fix updating city attrs and add validations
            // body("*.cover")
            // 	.optional()
            // 	.isURL()
            // 	.withMessage("city cover must be a url"),
        ],
        // classValidator.idParamValidator,
        // classValidator.propParamValidator,
        validateMW,
        cityController.updateCityProperties
    )

router
    .route('/cities/:id/units')
    .post(
        [
            param('id')
                .exists()
                .withMessage('city id is required')
                .isMongoId()
                .withMessage('city id must be a mongo id'),
            body('units')
                .exists()
                .withMessage('units are required')
                .isArray()
                .withMessage('units must be an array')
                .not()
                .isEmpty()
                .withMessage("units array can't be empty"),
            body('units.*')
                .isMongoId()
                .withMessage('unit id in units field must be a mongo id'),
        ],
        validateMW,
        cityController.addUnitToCity
    )
    // .put(cityController.updateUnitsOfCity) // replace existing units
    .delete(
        [
            param('id')
                .exists()
                .withMessage('city id is required')
                .isMongoId()
                .withMessage('city id must be a mongo id'),
            body('units')
                .exists()
                .withMessage('units are required')
                .isArray()
                .withMessage('units must be an array')
                .not()
                .isEmpty()
                .withMessage("units array can't be empty"),
            body('units.*')
                .isMongoId()
                .withMessage('unit id in units field must be a mongo id'),
        ],
        validateMW,
        cityController.deleteUnitFromCity
    ) // adding unit to city
// 	.delete(
// 		classValidator.idParamValidator,
// 		childValidator.idBodyValidator,
// 		validateMW,
// 		classController.deleteChildFromClass
// 	);

router
    .route('/cities/:id/:prop')
    .get(validateMW, cityController.getCityProperty)

module.exports = router
