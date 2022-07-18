let Unit = require("../models/unitModel");
let Review = require("../models/reviewModel");
let Landlord = require("./../models/landlordModel");

//Get All Units
module.exports.getAllUnits = (request, response, next) => {
  Unit.find(
    {},
    "estateType images unitInfo isAvailable isPetsAllowed gender dailyPrice address"
  )
    .populate({ path: "landlordId", select: "fullName phone image" })
    // .populate({ path: "agentId" })

    .then((data) => {
      response.status(200).json(data);
    })
    .catch((error) => {
      next(error);
    });
};

//Get Specific Unit By Id
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

//Create/Add New Unit
module.exports.createUnit = (request, response, next) => {
  const cityId = request.body.cityId;
  const landlordId = request.body.landlordId;

  let newUnit = new Unit(request.body);

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

//Update Unit Data
module.exports.updateUnitData = (request, response, next) => {
  Unit.findOne({ _id: request.body.id })
    .then((data) => {
      // console.log(data);
      if (data == null) next(new Error("Unit Doesn't Exist"));
      else {
        const updates = request.body;
        // console.log(updates);
        for (let property in updates) {
          // if (property in data === false) {
          //   console.log(property);
          //   console.log(updates[property]);

          //   Unit.updateOne(
          //     { _id: request.body.id },
          //     { $set: { property: updates[property] } }
          //   ).then((data) => {
          //     console.log(data);
          //   });
          //   //data.property = updates[property];
          // }
          data[property] = updates[property] || data[property];
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

//delete specific unit
module.exports.deleteUnit = (request, resposne, next) => {
  const cityId = request.body.cityId;
  const landlordId = request.body.landlordId;
  //!Promise.all needs to be checked (!Important)
  Promise.all([
    Unit.deleteOne({ _id: request.params.id }),
    City.findByIdAndUpdate(
      cityId,
      { $pull: { units: request.params.id } },
      { new: true }
    ),
    Landlord.findByIdAndUpdate(
      landlordId,
      {
        $pull: { landlordUnits: request.params.id },
      },
      { new: true }
    ),
  ])
    .then((data) => {
      if (data.matchedCount == 0)
        next(new Error("Unit Not Found")); //! doesn't work check it again
      else {
        resposne.status(200).json("Unit Deleted");
      }
    })
    .catch((error) => next(error));
};

//Upload Unit Cover(//!Check if this route needs something else(addind landlord-delete the old cover when updated))
module.exports.uploadCoverImage = (request, response, next) => {
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

//Upload Unit Images (//!Check if we delete old images of the unit when landlord update them & check if we need to add the landrordId(relations) )
module.exports.uploadUnitImages = (request, response, next) => {
  console.log(request.files);
  console.log(request.files.path);
  Unit.findOne({ _id: request.params.id })
    .then((data) => {
      console.log(data);
      console.log(data.images);

      if (data == null) next(new Error("Unit Doesn't Exist"));

      request.files.forEach((image) => {
        console.log(image.path);
        data.images.push(image.path);
      });
      data.save();
      response.status(201).json("Unit Images Uploaded");
    })
    .catch((error) => next(error));
};

//Update Unit Images
module.exports.updateUnitImages = (request, resposne, next) => {
  Unit.updateOne(
    { _id: request.body.id },
    {
      // $addToSet: {
      //   images: { $each: request.body.images },
      // },
      $pull: {
        images: request.body.images,
      },
    }
  )
    .then((data) => {
      if (data.matchedCount == 0) next(new Error("Unit Not Found"));
      else {
        resposne.status(200).json("Unit Images Has Updated");
      }
    })
    .catch((error) => next(error));
};

//TODO Delete Unit Images (check it again)
module.exports.deleteUnitImages = (request, resposne, next) => {
  Unit.updateOne(
    { _id: request.body.id },
    {
      $pull: {
        images: request.body.images,
      },
    }
  )
    .then((data) => {
      if (data.matchedCount == 0) next(new Error("Unit Not Found"));
      else {
        resposne.status(200).json(data);
      }
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
