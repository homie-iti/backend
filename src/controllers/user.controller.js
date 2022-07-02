let User = require("../models/user.model");

module.exports.getAllUsers = (request, response, next) => {
  response.status(200).json({ data: [{ user: 1 }, { user: 2 }] });
};
