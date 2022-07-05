const mongoose = require("mongoose");
require("../models/city.model");

let Cities = mongoose.model("cities");

module.exports.getCityByID = (request, response, next) => {
  Cities.findOne({ _id: request.params.id, name: request.params.name })
    .then((data) => {
      if (data == null) next(new Error(" city not found"));
      response.status(200).json(data);
    })
    .catch((error) => {
      next(error);
    });
};
