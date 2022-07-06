const mongoose = require("mongoose");
require("../models/cityModel");

let Cities = mongoose.model("cities");

module.exports.getCityByName = (request, response, next) => {
  Cities.find({ cityName: request.params.cityName }, { _id: 1, cityName: 1 })
    .then((data) => {
      console.log(data);
      if (data == null) next(new Error(" city not found"));
      response.status(200).json(data);
    })
    .catch((error) => {
      next(error);
    });
};
