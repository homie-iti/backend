const mongoose = require("mongoose");
require("../models/adminModel");

let Admin = mongoose.model("admins");

module.exports.getAllAdmins = (request, response, next) => {
  Admin.find({})
    .then((data) => {
      response.status(200).json(data);
    })
    .catch((error) => {
      next(error);
    });
};

module.exports.getAdminByID = (request, response, next) => {
  Admin.findOne({ _id: request.params.id })
    .then((data) => {
      if (data == null) next(new Error(" Admin not found"));
      response.status(200).json(data);
    })
    .catch((error) => {
      next(error);
    });
};

module.exports.createAdmin = (request, response, next) => {
  let object = new Admin({
    _id: request.body.id,
  });
  object
    .save()
    .then((data) => {
      response.status(201).json({ data: "added" });
    })
    .catch((error) => next(error));
};

module.exports.updateAdmin = async (request, response, next) => {
  try {
    const data = await Admin.findById(request.body.id);
    for (const key in request.body) {
      data[key] = request.body[key];
    }

    await data.save();
    response.status(200).json({ data: "updated" });
  } catch (error) {
    next(error);
  }
};

module.exports.deleteAdmin = (request, response, next) => {
  Admin.deleteOne({ _id: request.params.id })
    .then((data) => {
      if (!data) {
        next(new Error(" Admin not found"));
      } else {
        response.status(200).json({ data: "deleted" });
      }
    })
    .catch((error) => {
      next(error);
    });
};
