const express = require('express')

const router = express.Router()

const validationMW = require('../middlewares/validationMW')
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
    validationMW,
    cityController.createCity
)

// .put(
// 	classValidator.updatingValidator,
// 	 validationMW,
// 	classController.updateClass
// )

router
    .route('/cities/:id')
    .get(validateId('city'), validationMW, cityController.getCityById)
    .put(
        updateCityValidations,
        validationMW,
        cityController.updateCityProperties
    )
    .delete(
        validateId('city'),
        // classValidator.idBodyValidator,
        validationMW,
        cityController.deleteCity
    )

router
    .route('/cities/:id/units')
    .post(addUnitToCityValidations, validationMW, cityController.addUnitToCity)
    // .put(cityController.updateUnitsOfCity) // replace existing units
    .delete(
        deleteUnitFromCityValidations,
        validationMW,
        cityController.deleteUnitFromCity
    ) // adding unit to city
// 	.delete(
// 		classValidator.idParamValidator,
// 		childValidator.idBodyValidator,
// 		 validationMW,
// 		classController.deleteChildFromClass
// 	);

router
    .route('/cities/:id/:prop')
    .get(validateId('city'), validationMW, cityController.getCityProperty)

module.exports = router
