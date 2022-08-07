const express = require('express')

const router = express.Router()
const { param } = require('express-validator')
const validateMW = require('../middlewares/validationMW')
const { validateId } = require('../middlewares/validations/generalValidations')
const {
    addCityValidations,
    updateCityValidations,
    addUnitToCityValidations,
    deleteUnitFromCityValidations,
} = require('../middlewares/validations/cityValidations')
const cityController = require('../controllers/cityController')

router.route('/cities').get(cityController.getAllCities).post(
    // classValidator.creationValidator,
    addCityValidations,
    validateMW,
    cityController.createCity
)

// .put(
// 	classValidator.updatingValidator,
// 	validateMW,
// 	classController.updateClass
// )

router
    .route('/cities/:id')
    .get(validateId('city', param), validateMW, cityController.getCityById)
    .put(updateCityValidations, validateMW, cityController.updateCityProperties)
    .delete(
        validateId('city', param),
        // classValidator.idBodyValidator,
        validateMW,
        cityController.deleteCity
    )

router
    .route('/cities/:id/units')
    .post(addUnitToCityValidations, validateMW, cityController.addUnitToCity)
    // .put(cityController.updateUnitsOfCity) // replace existing units
    .delete(
        deleteUnitFromCityValidations,
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
    .get(validateId('city', param), validateMW, cityController.getCityProperty)

module.exports = router
