let Unit = require("../models/unitModel");
let Review = require("../models/reviewModel");

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
    "estateType images unitInfo isAvailable isPetsAllowed gender address dailyPrice"
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

module.exports.getUnitReviews = (request, response, next) => {
  Review.findOne({ "unit._id": request.params.id }, "rating comment")
    .populate({ path: "unitId", select: "city estateType address" })
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

module.exports.updateUnitData = (request, response, next) => {
  Unit.findOne({ _id: request.body.id })
    .then((data) => {
      // console.log(data);
      if (data == null) next(new Error("Unit Doesn't Exist"));
      else {
        const updates = request.body;
        // console.log(updates);
        for (let property in updates) {
          if (property in data === false) {
            data.property = updates[property];
            console.log(data);
            console.log(property, updates[property]);
          }
          data[property] = updates[property] || data[property];
        }
        data.save().then((data) => {
          console.log(data);
          response.status(200).json({ data: "Unit Data Updated" });
        });
      }
    })
    .catch((error) => next(error));
};


