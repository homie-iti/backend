const mongoose = require("mongoose");
require("../model/speaker.model");
require("../model/student.model");
let Speaker = mongoose.model("speakers");
let Student = mongoose.model("students");
const jwt = require("jsonwebtoken");

module.exports.login = (request, response, next) => {
  Speaker.findOne(
    {
      email: request.body.email,
      password: request.body.password,
    },
    { role: 1 }
  )
    .then((data) => {
      if (!data) {
        let error = new Error("email or password incorrect");
        error.status = 401;
        throw error;
      } else if (data.role == "admin") {
        let token = jwt.sign(
          {
            id: data._id,
            role: "admin",
          },
          process.env.secret,
          { expiresIn: "1h" }
        );
        response.status(200).json({ token, message: "login" });
      } else if (data.role == "speaker") {
        let token = jwt.sign(
          {
            id: data._id,
            role: "speaker",
          },
          process.env.secret,
          { expiresIn: "1h" }
        );
        response.status(200).json({ token, message: "login" });
      }

      response.status(200).json({ token, message: "login" });
    })
    .catch((error) => next(error));

  Student.findOne({
    email: request.body.email,
    password: request.body.password,
  })
    .then((data) => {
      if (!data) {
        let error = new Error("email or password incorrect");
        error.status = 401;
        throw error;
      }
      let token = jwt.sign(
        {
          id: data._id,
          role: "student",
        },
        process.env.secret,
        { expiresIn: "1h" }
      );

      response.status(200).json({ token, message: "login" });
    })
    .catch((error) => next(error));
};
