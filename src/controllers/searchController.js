const mongoose = require("mongoose");
require("../models/city.model");

let Cities = mongoose.model("cities");

module.exports.getCityByName = (request, response, next) => {
  Cities.find(
    { cityName: request.params.cityName },
    { _id: "", cityName: 1, units: 1 }
  )
    .then((data) => {
      console.log(data);
      if (data == null) next(new Error(" city not found"));
      response.status(200).json(data);
    })
    .catch((error) => {
      next(error);
    });
};
