const mongoose = require("mongoose");
require("../models/userModel");
let User = mongoose.model("users");


// module.exports.getAllUsers = (request, response, next) => {
//   response.status(200).json();
// };


module.exports.getAllUsers = (request, response, next) => {
  User.find({})
    .then(data => {
      response.status(200).json(data);

    })
    .catch(console.error(error => {
      next(error);
    }))
}

module.exports.getUserById = (request, response, next) => {
  User.findOne({ _id: request.params.id })
    .then(data => {
      if (data == null) next(new Error(" teacher not found"))
      response.status(200).json(data);

    })
    .catch(error => {
      next(error);
    })

}



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
      image: request.body.image
    }
  );
  object.save()
    .then(data => {
      response.status(201).json({ data: "added" });
    })
    .catch(error => next(error))


}

module.exports.updateUser = (request, response, next) => {
  let allowed = ["_id", "fullName", "age", "email", "gender"
    , "password", "phone", "image", "address", "national_id"];
  console.log(allowed)
  let requested = Object.keys(request.body)
  console.log(requested)
  const isValidUpdates = requested.every(i => allowed.includes(i))
  console.log(isValidUpdates)
  if (!isValidUpdates) { next(new Error("User not allowed")) }
  else {

    let newUser = request.body;
    User.findOneAndUpdate({ _id: request.body._id },
      { $set: newUser }, { new: false, runValidators: true })
      .then(data => {
        if (!data) {
          next(new Error("User not found"))
        }
        else {
          response.status(200).json("updated");
        }

      })
      .catch(error => next(error));
  }

}

module.exports.deleteUser = (request, response, next) => {
  User.deleteOne({ _id: request.body._id })
    .then(data => {
      if (data.deletedCount == 0) { next(new Error("userID not found")) }
      else {
        response.status(200).json({data:"deleted"});
      }
    })
    .catch(error => next(error))

}


module.exports.deleteManyUser = (request, response, next) => {
  const { ids } = request.body;
  User.deleteMany({ _id: { $in: ids } })
    .then(data => {
      if (data.deletedCount == 0) { next(new Error("userID not found")) }
      else {
        response.status(200).json({data:"deleted"});
      }
    })
    .catch(console.error(error => {
      next(error)
    }))

}
