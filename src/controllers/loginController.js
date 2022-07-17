const mongoose = require("mongoose");
require("../models/adminModel");
require("../models/userModel");
let Admin = mongoose.model("admins");
let User = mongoose.model("users");
const jwt = require("jsonwebtoken");

module.exports.login = (request, response, next) => {
  Admin.findOne(
    {
      email: request.body.email,
      password: request.body.password,
    },
  )
    .then((data) => {
      if (!data) {
        let error = new Error("email or password incorrect");
        error.status = 401;
        throw error;
      } else if (data.role == "user") {
        let token = jwt.sign(
          {
            id: data._id,
            role: "admin",
          },
          process.env.secret,
          { expiresIn: "1h" }
        );
        response.status(200).json({ token, message: "login" });
      } else if (data.role == "user") {
        let token = jwt.sign(
          {
            id: data._id,
            role: "user",
          },
          process.env.secret,
          { expiresIn: "1h" }
        );
        response.status(200).json({ token, message: "login" });
      }

      response.status(200).json({ token, message: "login" });
    })
    .catch((error) => next(error));
};
