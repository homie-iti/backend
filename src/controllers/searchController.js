const mongoose = require("mongoose");
require("../models/city.model");

let Cities = mongoose.model("cities");

module.exports.getCityByName = (request, response, next) => {
  Cities.findOne({ name: request.param.name })
    .then((data) => {
      console.log(data);
      if (data == null) next(new Error(" city not found"));
      response.status(200).json(data);
    })
    .catch((error) => {
      next(error);
    });
};
