const express = require("express");
const router = express.Router();
const { body, param, query } = require("express-validator");

const cityController = require("../controllers/cityController.js");

router
	.route("/cities")
	.get(cityController.getAllCities)
	.post(
		// classValidator.creationValidator,
		// validateMW,
		cityController.createCity
	)
	.delete(
		// classValidator.idBodyValidator,
		// validateMW,
		cityController.deleteCity
	);
// .put(
// 	classValidator.updatingValidator,
// 	validateMW,
// 	classController.updateClass
// )

router.route("/cities/:id").get(cityController.getCityById);

router
	.route("/cities/:id/units")
	.post(cityController.addUnitToCity)
	.delete(cityController.deleteUnitFromCity); //adding unit to city
// 	.delete(
// 		classValidator.idParamValidator,
// 		childValidator.idBodyValidator,
// 		validateMW,
// 		classController.deleteChildFromClass
// 	);

router.route("/cities/:id/:prop").get(cityController.getCityProperty);
// .put(
// 	classValidator.idParamValidator,
// 	classValidator.propParamValidator,
// 	validateMW,
// 	classController.updateClassProps
// );

module.exports = router;
