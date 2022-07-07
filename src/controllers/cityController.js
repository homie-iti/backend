const mongoose = require("mongoose");
require("../models/cityModel");

let CityModel = mongoose.model("cities");

// let CityModel = require("../models/unit.model");

module.exports.getAllCities = async (request, response, next) => {
	try {
		const data = await CityModel.find({});
		response.status(200).json(data);
	} catch (error) {
		next(error);
	}
};

module.exports.getCityById = async (request, response, next) => {
	const { id: cityId } = request.params;
	try {
		const data = await CityModel.findOne({ _id: cityId }, { _id: 0 }).populate({
			path: "units",
			select: { dailyPrice: 1, estateType: 1, images: 1 },
		});

		// console.log(data);

		if (data == null) next(new Error("City not found"));
		response.status(200).json(data);
	} catch (error) {
		next(error);
	}
};

exports.getCityProperty = async (request, response, next) => {
	const { id: cityId, prop } = request.params;
	console.log(prop);
	try {
		let data = await CityModel.findOne({ _id: cityId }, { _id: 0, [prop]: 1 });
		if (prop === "units") {
			data = await data.populate({
				path: "units",
				select: { dailyPrice: 1, estateType: 1, images: 1 },
			});
		}

		console.log(data);

		if (data == null) next(new Error("City not found"));
		response.status(200).json(data);
	} catch (error) {
		next(error);
	}
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

// router.route("/updateHobbies").put(function (req, res) {
// 	details.updateOne(
// 		{ name: "Deven" },
// 		{ $push: { hobbies: ["Writing"] } },
// 		function (err, result) {
// 			if (err) {
// 				res.send(err);
// 			} else {
// 				res.send(result);
// 			}
// 		}
// 	);
// });

exports.addUnitToCity = async (request, response, next) => {
	const uniqueUnits = [...new Set([...request.body.units])];
	// userUnits =

	try {
		const data = await CityModel.updateOne(
			{ _id: request.params.id },
			{
				$push: {
					units: uniqueUnits,
				},
			}
		);

		console.log(data);

		if (data.matchedCount < 1) throw new Error("city  not found");
		if (data.modifiedCount < 1)
			throw new Error("units couldn't be added to city");

		response.status(200).json({
			data: `unit is added to city${
				uniqueUnits.length !== request.body.units.length
					? " - removed duplicates of your entry"
					: ""
			}`,
		});
	} catch (error) {
		next(error);
	}
};

exports.deleteUnitFromCity = async (request, response, next) => {
	const uniqueUnits = [...new Set([...request.body.units])];

	try {
		const data = await CityModel.updateOne(
			{ _id: request.params.id },
			{
				$pull: {
					units: { $in: uniqueUnits },
				},
			}
		);

		// console.log(data);

		if (data.matchedCount < 1) throw new Error("city  not found");
		if (data.modifiedCount < 1)
			throw new Error("all of the entered units isn't in city");

		response.status(200).json({
			data: `units are deleted from city${
				uniqueUnits.length !== request.body.units.length
					? " - removed duplicates of your entry"
					: ""
			}`,
		});
	} catch (error) {
		next(error);
	}
};

exports.updateCityProperties = async (request, response, next) => {
	try {
		let modificationsObject = request.body.reduce((acc, curr) => {
			acc[curr.prop] = curr.value;
			return acc;
		}, {});

		// console.log(modificationsObject);

		if (modificationsObject.units)
			modificationsObject.units = [...new Set([...modificationsObject.units])];

		const data = await CityModel.updateOne(
			{ _id: request.params.id },
			modificationsObject
		);

		// console.log(data);

		if (data.matchedCount < 1) throw new Error("city  not found");
		if (data.modifiedCount < 1) throw new Error("props couldn't be modified");

		response.status(200).json({
			data: `props are modified ${Object.keys(modificationsObject)}`,
		});
	} catch (error) {
		next(error);
	}
};
