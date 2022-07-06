const mongoose = require("mongoose");
require("../models/agentModel");

let Agent = mongoose.model("agents");

module.exports.getAllAgents = (request, response, next) => {
  Agent.find({})
    .populate({
      path: "_id",
      select: {},
    })
    .populate({
      path: "agentUnits",
      select: {},
    })
    .populate({
      path: "favoriteUnits",
      select: {},
    })
    .then((data) => {
      response.status(200).json(data);
    })
    .catch((error) => {
      next(error);
    });
};

module.exports.getAgentByID = (request, response, next) => {
  Agent.findOne({ _id: request.params.id })
    .populate({
      path: "_id",
      select: {},
    })
    .populate({
      path: "agentUnits",
      select: {},
    })
    .populate({
      path: "favoriteUnits",
      select: {},
    })
    .then((data) => {
      if (data == null) next(new Error(" Agent not found"));
      response.status(200).json(data);
    })
    .catch((error) => {
      next(error);
    });
};

module.exports.createAgent = (request, response, next) => {
  let object = new Agent({
    _id: request.body.id,
    fullName: request.body.fullName,
    age: request.body.age,
    email: request.body.email,
    password: request.body.password,
    gender: request.body.gender,
    phone: request.body.phone,
    national_id: request.body.national_id,
    image: request.body.image,
    address: request.body.address,
  });
  object
    .save()
    .then((data) => {
      response.status(201).json({ data: "added" });
    })
    .catch((error) => next(error));
};

module.exports.updateAgent = (request, response, next) => {
  Agent.findById(request.body.id)
    .then((data) => {
      for (const key in request.body) {
        data[key] = request.body[key];
      }
      data.save();
      response.status(200).json({ data: "updated" });
    })
    .catch((error) => {
      next(error);
    });
};

module.exports.deleteAgent = (request, response, next) => {
  Agent.deleteOne({ _id: request.params.id })
    .then((data) => {
      if (!data) {
        next(new Error(" Agent not found"));
      } else {
        response.status(200).json({ data: "deleted" });
      }
    })
    .catch((error) => {
      next(error);
    });
};
