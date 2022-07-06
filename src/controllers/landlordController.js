const mongoose = require("mongoose");
require("../models/landlordModel");

let Landlord = mongoose.model("landlords");


// Get All landlords
module.exports.getAllLandLord = (request, response, next) => {
  Landlord.find({}).populate({ path: "_id" }).populate({ path: "landlordUnits" })
    .then((data) => {
      response.status(200).json(data);
    })
    .catch((error) => {
      next(error);
    });
};

// Get All landlord by Id
module.exports.getLandLordById = (request, response, next) => {
  Landlord.findOne({ _id: request.params.id })
    .then((data) => {
      if (data == null) next(new Error(" landlord is not found"));
      response.status(200).json(data);
    })
    .catch((error) => {
      next(error);
    });
};

// Add LandLord
module.exports.CreateLandLord = (request, response, next) => {
  let object = new Landlord({
    _id: request.body.id,
    landlordUnits: request.body.landlordUnits

  });
  object.save()
    .then((data) => {
      response.status(201).json({ data: "added" });
    })
    .catch((error) => next(error));
};

// Update LandLord Units
module.exports.updateLandlordUnits = ((request, response, next) => {
  Landlord.findByIdAndUpdate({ _id: request.body.id }, { $addToSet: { landlordUnits: request.body.landlordUnits } })
    .then(data => {
      response.status(200).json(data);

    })
    .catch(error => {
      next(error);
    })

});

// Remove From LandLord Units
module.exports.RemoveLandlordUnits = ((request, response, next) => {
  Landlord.findByIdAndUpdate({ _id: request.body.id }, { $pull: { landlordUnits: request.body.landlordUnits } })
    .then(data => {
      response.status(200).json(data);

    })
    .catch(error => {
      next(error);
    })

});


// Delete LandLord By ID
module.exports.deleteLandlordById = (request, response, next) => {
  Landlord.deleteOne({ _id: request.params.id })
  then(data => {
    if (data.deletedCount == 0) {
      next(new Error("LandLord is not defined"))
    }
    else {
      response.status(200).json(data)

    }
  })
    .catch((error) => {
      next(error);
    });
};







