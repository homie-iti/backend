const mongoose = require("mongoose");
require("../models/adminModel");
require("../models/userModel");
let Admin = mongoose.model("admins");
let User = mongoose.model("users");
const jwt = require("jsonwebtoken");

module.exports.login = (request, response, next) => {
  if (
    User.findOne({
      email: request.body.email,
      password: request.body.password,
    })
  ) {
    then((data) => {
      if (!data) {
        let error = new Error("email or password incorrect");
        error.status = 401;
        throw error;
      }
      let token = jwt.sign(
        {
          id: data._id,
          role: "User",
        },
        process.env.secret,
        { expiresIn: "1h" }
      );

      response.status(200).json({ token, message: "login" });
    }).catch((error) => next(error));
  } else if (
    Admin.findOne({
      email: request.body.email,
      password: request.body.password,
    })
  ) {
    then((data) => {
      if (!data) {
        let error = new Error("email or password incorrect");
        error.status = 401;
        throw error;
      }
      let token = jwt.sign(
        {
          id: data._id,
          role: "Admin",
        },
        process.env.secret,
        { expiresIn: "1h" }
      );

      response.status(200).json({ token, message: "login" });
    }).catch((error) => next(error));
  }
};
