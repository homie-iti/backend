const mongoose = require("mongoose");
require("../models/cityModel");

let CityModel = mongoose.model("cities");

// let CityModel = require("../models/unit.model");

module.exports.getAllCities = (request, response, next) => {
	response.status(200).json({ data: [{ department: 1 }, { department: 2 }] });
};

module.exports.getCityUnits = (request, response, next) => {
	const { id: cityId } = request.params;

	CityModel.findOne({ _id: cityId }, { _id: 0 })
		.populate({
			path: "units",
			select: { dailyPrice: 1, estateType: 1, images: 1 },
		})
		.then((data) => {
			// console.log(data);
			if (data == null) next(new Error("City not found"));
			response.status(200).json(data);
		})
		.catch((error) => {
			next(error);
		});
};

exports.createCity = async (request, response, next) => {
	try {
		const cityObject = new CityModel({
			// _id: request.body.id, it auto-increments
			name: request.body.name,
			cover: request.body.cover,
			units: [],
		});

		const data = await cityObject.save();

		response.status(201).json({ data: "city added", id: data._id.toString() });
	} catch (error) {
		next(error);
	}
};

exports.deleteCity = async (request, response, next) => {
	try {
		const data = await CityModel.deleteOne({
			_id: request.body.id,
		});

		if (data.deletedCount < 1) throw new Error("City  not found");

		response.status(200).json({ message: "deleted city" });
	} catch (error) {
		next(error);
	}
};

exports.deleteUnitFromCity = async (request, response, next) => {
	try {
		const data = await CityModel.updateOne(
			{ _id: request.params.id },
			{
				$pull: {
					units: request.body.id,
				},
			}
		);

		// console.log(data);

		if (data.matchedCount < 1) throw new Error("city  not found");
		if (data.modifiedCount < 1) throw new Error("unit isn't found in city");

		response.status(200).json({ data: "unit deleted from city" });
	} catch (error) {
		next(error);
	}
};
