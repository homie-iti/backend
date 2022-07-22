const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);

let Unit = require("../models/unitModel");
let Review = require("../models/reviewModel");
let Landlord = require("./../models/landlordModel");
let City = require("./../models/cityModel");

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
  const cover = request.file ? request.file.path : undefined;
  const images = request.files ? request.files.path : undefined;
  console.log(request.file, request.files);

  let unit = {
    landlordId,
    cityId,
    cover,
    images,
    estateType: request.body.estateType,
    address: request.body.address,
    dailyPrice: request.body.dailyPrice,
    isAvailable: request.body.isAvailable,
    numberOfResidents: request.body.numberOfResidents,
    unitInfo: request.body.unitInfo,
    allowedGender: request.body.allowedGender,
  };
  //if (request.file && request.file.originalname) console.log(request.file) unit.cover=request.file.path;
  let newUnit = new Unit(unit);

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
module.exports.deleteUnit = (request, response, next) => {
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
        response.status(200).json("Unit Deleted");
      }
    })
    .catch((error) => next(error));
};

//Upload Unit Cover //? Think, Do we need this route or not??
module.exports.uploadUnitCover = (request, response, next) => {
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

//update cover image
// TODO Try to update the image without entering new one.
//*(user want to delete it )
module.exports.updateUnitCover = (request, response, next) => {
  console.log(request.file);
  console.log(request.file.path);

  Unit.findOneAndUpdate(
    { _id: request.params.id },
    { cover: request.file.path }
  )

    .then((data) => {
      // console.log(data);
      // console.log(data.cover);
      unlinkAsync(data.cover); //! for removing image from uploads file(works well,but check if it is the suitable way)
      if (data == null) next(new Error("Unit Doesn't Exist"));
      //data.cover = request.file.path;
      response.status(201).json("Unit Cover Image has been updated");
    })
    .catch((error) => next(error));
};

//Upload Unit Images
module.exports.uploadUnitImages = (request, response, next) => {
  // console.log(request.files);
  // console.log(request.files.path);
  Unit.findOne({ _id: request.params.id })
    .then((data) => {
      console.log(data);
      // console.log(data.images);

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

//TODO Delete Unit Images (check it again)
//!
module.exports.deleteUnitImages = (request, response, next) => {
  Unit.updateMany(
    { _id: request.params.id },
    {
      $pullAll: {
        images: request.body.images,
      },
    }
  )
    .then((data) => {
      console.log(request.body.images);
      let deletedImages = request.body.images;
      deletedImages.forEach((image) => {
        unlinkAsync(image);
      });

      if (data.matchedCount == 0) next(new Error("Unit Not Found"));
      else {
        response.status(200).json(data);
      }
    })
    .catch((error) => next(error));
};

//! Adding reviews as a property to unit schema with rating & remove review model (//TODO Enhancement)
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



//! Things to think about it:
//*Landlord upload new images in addition to the exist one.
// *landlord delete already exists images
//TODO Check again if I achieved this in my code.
