const mongoose = require("mongoose");
require("../models/cityModel");

let citiesCollection = mongoose.model("cities");

// let cityModel = require("../models/unit.model");

module.exports.getAllCities = (request, response, next) => {
    response.status(200).json({ data: [{ department: 1 }, { department: 2 }] });
};

module.exports.getCityUnits = (request, response, next) => {
    const { id: cityId } = request.params;

    citiesCollection
        .findOne({ _id: cityId }, { _id: 0 })
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

    // response.status(200).json({ data: [{ department: 1 }, { department: 2 }] });
};

// const data = await ClassModel.findById(request.params.id, {
// 	children: 1,
// }).populate({
// 	path: "children",
// 	select: { _id: 0, fullName: 1, age: 1, level: 1 },
// });
