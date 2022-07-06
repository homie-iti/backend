const mongoose = require("mongoose");
require("../models/userModel");
let User = mongoose.model("users");

// module.exports.getAllUsers = (request, response, next) => {
//   response.status(200).json();
// };

module.exports.getAllUsers = (request, response, next) => {
  User.find({})
    .then((data) => {
      response.status(200).json(data);
    })
    .catch(
      console.error((error) => {
        next(error);
      })
    );
};

module.exports.getUserById = (request, response, next) => {
  User.findOne({ _id: request.params.id })
    .then((data) => {
      if (data == null) next(new Error(" teacher not found"));
      response.status(200).json(data);
    })
    .catch((error) => {
      next(error);
    });
};

module.exports.createUser = (request, response, next) => {
  let object = new User(
    //request.body
    {
      _id: mongoose.Types.ObjectId(),
      fullName: request.body.fullName,
      age: request.body.age,
      password: request.body.password,
      gender: request.body.gender,
      phone: request.body.phone,
      national_id: request.body.national_id,
      address: request.body.address,
      email: request.body.email,
      image: request.body.image,
    }
  );
  object
    .save()
    .then((data) => {
      response.status(201).json({ data: "added" });
    })
    .catch((error) => next(error));
};
