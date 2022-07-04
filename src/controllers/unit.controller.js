let Unit = require("../models/unit.model");

module.exports.getAllUnits = (request, response, next) => {
  response.status(200).json({ data: [{ department: 1 }, { department: 2 }] });
};
