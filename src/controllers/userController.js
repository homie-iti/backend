const mongoose = require("mongoose");
require("../models/userModel");
require("../models/landlordModel");
require("../models/agentModel");
require("../models/userModel");
let User = mongoose.model("users");
let Landlord = mongoose.model("landlords");
let Agent = mongoose.model("agents");

// module.exports.getAllUsers = (request, response, next) => {
//   response.status(200).json();
// };

module.exports.getAllUsers = (request, response, next) => {
  User.find({})
    .then(data => {
      if (data == null) next(new Error("User not Found"))
      // if (data.isLandlord == true) {
      //   Landlord.findone({ _id: request.params.id }).populate({ path: "isLandlord", select: { _id: 0, landlordUnits: 1 } })
      // }
      // if (data.isAgent) {
      //   Agent.findone({ _id: request.body.id }).populate({ path: "isAgent", select: { _id: 0, agentUnits: 1 } })
      // }
      // else if (data.isLandlord == true && data.isAgent == true) {
      //   Agent.findone({ _id: request.body.id }).populate({ path: "isAgent", select: { _id: 0, agentUnits: 1 } })
      //   Landlord.findone({ _id: request.body.id }).populate({ path: "isLandlord", select: { _id: 0, landlordUnits: 1 } })
      // }
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
      // _id: mongoose.Types.ObjectId(),
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
    User.findOneAndUpdate(
      { _id: request.body._id },
      { $set: newUser },
      { new: false, runValidators: true }
    )
      .then((data) => {
        if (!data) {
          next(new Error("User not found"))
        }
        else {
          response.status(200).json("updated");
        }
      })
      .catch((error) => next(error));
  }
};

module.exports.deleteUser = (request, response, next) => {
  User.deleteOne({ _id: request.body._id })
    .then(data => {
      if (data.deletedCount == 0) { next(new Error("userID not found")) }
      else {
        response.status(200).json({ data: "deleted" });
      }
    })
    .catch((error) => next(error));
};

module.exports.deleteManyUser = (request, response, next) => {
  const { ids } = request.body;
  User.deleteMany({ _id: { $in: ids } })
    .then(data => {
      if (data.deletedCount == 0) { next(new Error("userID not found")) }
      else {
        response.status(200).json({ data: "deleted" });
      }
    })
    .catch(console.error(error => {
      next(error)
    }))

}



module.exports.getAllFavUnits = ((request, response, next) => {
  User.find({ _id: request.params.id }).populate({ path: "favoriteUnits" })
    .select({ favoriteUnits: 1, _id: 1 })
    .then(data => {
      if (data == null) { next(new Error("Agent Fav Unit is not defined")) }
      else {
        response.status(200).json(data)
      }
    })
    .catch(error => {
      next(error);
    })

});




module.exports.updateFavUnit = ((request, response, next) => {
  User.findByIdAndUpdate({ _id: request.params.id },
     { $addToSet: { favoriteUnits: request.body.favoriteUnits } })
    .then(data => {
      response.status(200).json(data);

    })
    .catch(error => {
      next(error);
    })

});

module.exports.removeFavUnit = ((request, response, next) => {
  User.updateOne({ _id: request.params.id },
     { $pull: { favoriteUnits: request.body.favoriteUnits } })

    .then(data => {
      response.status(200).json({data:"deleted"});

    })
    .catch(error => {
      next(error);
    })


});

module.exports.uploadUserImage = (request, response, next) => {
  //response.status(201).json("Cover Image Uploaded");
  console.log(request.file);
  console.log(request.file.path);

  Unit.findOne({ _id: request.params.id })
    .then((data) => {
      console.log(data);
      if (data == null) next(new Error("Unit Doesn't Exist"));
      data.cover = request.file.path;
      data.save();
      response.status(201).json("Cover Image Uploaded");
    })
    .catch((error) => next(error));
};