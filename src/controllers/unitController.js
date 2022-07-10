let Unit = require("../models/unitModel");
let Review = require("../models/reviewModel");
let Landlord = require("./../models/landlordModel");

const mongoose = require("mongoose");
require("../models/cityModel");
let City = mongoose.model("cities");

module.exports.createUnit = (request, response, next) => {
  const cityId = request.body.cityId;
  const landlordId = request.body.landlordId;

  let newUnit = new Unit({
    landlordId: request.body.landlordId,
    cityId: request.body.cityId,
    unitInfo: request.body.unitInfo,
    allowedGender: request.body.allowedGender,
    estateType: request.body.estateType,
    dailyPrice: request.body.dailyPrice,
    cover: request.body.cover,
    numberOfResidents: request.body.numberOfResidents,
  });

  Promise.all([
    newUnit.save(),
    City.findByIdAndUpdate(
      cityId,
      { $push: { units: newUnit._id } },
      { new: true }
    ),
    Landlord.findByIdAndUpdate(
      landlordId,
      {
        $push: { landlordUnits: newUnit._id },
      },
      { new: true }
    ),
  ])
    .then((data) => {
      response.status(200).json(data);
    })
    .catch((error) => next(error));
};

module.exports.getAllcities = (request, response, next) => {
  City.find({})
    .then((data) => {
      response.status(200).json(data);
    })
    .catch((error) => next(error));
};

module.exports.getAllUnits = (request, response, next) => {
  Unit.find(
    {},
    "estateType images unitInfo isAvailable isPetsAllowed gender dailyPrice address "
  )
    .populate({ path: "landlordId", select: "fullName phone image" })
    .then((data) => {
      response.status(200).json(data);
    })
    .catch((error) => {
      next(error);
    });
};

//! check if you can select unitInfo as unitInfo:{...unitInfo,isAvailable, isPetsAllowed ,gender} as one object
module.exports.getUnitById = (request, response, next) => {
  Unit.findOne(
    { _id: request.params.id },
    "estateType images unitInfo isAvailable isPetsAllowed gender address dailyPrice cover images"
  )
    .populate({ path: "landlordId", select: "fullName phone image" })
    .then((data) => {
      if (data == null) next(new Error("Unit Doesn't Exist"));
      else {
        response.status(200).json(data);
      }
    })
    .catch((error) => {
      next(error);
    });
};


module.exports.updateUnitData = (request, response, next) => {
  Unit.findOne({ _id: request.body.id })
    .then((data) => {
      // console.log(data);
      if (data == null) next(new Error("Unit Doesn't Exist"));
      else {
        const updates = request.body;
        // console.log(updates);
        for (let property in data) {
          data[property] = updates[property] || data[property];
          if (property in data === false) {
            console.log(property, updates[property]);
            data.property = updates[property];
            console.log(data);
          }
          // if (property == "address") {
          //   console.log(updates[property]);
          //   data.address.city =
          //     updates[property].city || updates[property].city;
          //   data.address.streetName =
          //     updates[property].streetName || updates[property].streetName;
          //   data.address.buildingNumber =
          //     updates[property].buildingNumber ||
          //     updates[property].buildingNumber;
          // }
          if (typeof updates[property] == "object") {
            console.log("updateObject");
          }
        }
        data.save().then((data) => {
          console.log(data);
          response.status(201).json({ data: "Unit Data Updated" });
        });
      }
    })
    .catch((error) => next(error));
};


module.exports.updateUnit = (request, resposne, next) => {
  Unit.updateOne({ _id: request.params.id }, { $set: request.body })
    .then((data) => {
      if (data == null) next(new Error("Unit Not Found"));
      else {
        resposne.status(200).json(data);
      }
    })
    .catch((error) => next(error));
};

//delete specific unit
module.exports.deleteUnit = (request, resposne, next) => {
  Unit.deleteOne({ _id: request.params.id })
    .then((data) => {
      if (data.deletedCount == 0) next(new Error("Unit Not Found"));
      else {
        resposne.status(200).json(data);
      }
    })
    .catch((error) => next(error));
};

//Update Unit Images
module.exports.updateUnitImages = (request, resposne, next) => {
  Unit.updateOne(
    { _id: request.body.id },
    {
      $push: {
        images: { $each: [request.body.images] },
      },
      $pull: {
        images: [...images, request.body.images],
      },
    }
  )
    .then((data) => {
      // if (data.deletedCount == 0) next(new Error("Unit Not Found"));
      // else {
      //   resposne.status(200).json(data);
      // }
      console.log(data);
    })
    .catch((error) => next(error));
};

//!Thought we need to make reviews alone as controller & router (may need to get units with high review also)
module.exports.getUnitReviews = (request, response, next) => {
  Review.findOne({ unitId: request.params.id }, "rating comment")
    .populate({ path: "unitId", select: "city estateType address cover" })
    .populate({ path: "agentId", select: "fullName image" })
    .then((data) => {
      if (data == null) next(new Error("This Unit Haven't Reviews Yet."));
      else {
        response.status(200).json(data);
      }
    })
    .catch((error) => {
      next(error);
    });
};

module.exports.getAllReviews = (request, response, next) => {
  Review.find({})
    .then((data) => {
      response.status(200).json(data);
    })
    .catch((error) => next(error));
};

module.exports.addReview = (request, response, next) => {
  let newReview = new Review({
    unitId: request.body.unitId,
    agentId: request.body.agentId,
    comment: request.body.comment,
    rating: request.body.rating,
  });
  newReview
    .save()
    .then((data) => {
      response.status(200).json(data);
    })
    .catch((error) => next(error));
};
