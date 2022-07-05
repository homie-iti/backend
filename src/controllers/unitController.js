let Unit = require("../models/unitModel");

module.exports.getAllUnits = (request, response, next) => {
  response.status(200).json({ data: [{ department: 1 }, { department: 2 }] });
};
