let Unit = require("../models/unit.model");
let Review = require("../models/review.model");

module.exports.getAllUnits = (request, response, next) => {
  Unit.find({}, "estateType images unitInfo dailyPrice address ")
    .populate({ path: "landlordId", select: "fullName phone image" })
    .then((data) => {
      response.status(200).json(data);
    })
    .catch((error) => {
      next(error);
    });
};

module.exports.getUnitById = (request, response, next) => {
  Unit.findOne({ _id: request.params.id })
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
