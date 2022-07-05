const mongoose = require("mongoose");
require("../models/agent.model");

let Agent = mongoose.model("agents");

module.exports.getAllAgents = (request, response, next) => {
  Agent.find({})
    .then((data) => {
      response.status(200).json(data);
    })
    .catch((error) => {
      next(error);
    });
};

module.exports.getAgentByID = (request, response, next) => {
  Agent.findOne({ _id: request.params.id })
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
  });
  object
    .save()
    .then((data) => {
      response.status(201).json({ data: "added" });
    })
    .catch((error) => next(error));
};

module.exports.updateAgent = async (request, response, next) => {
  try {
    const data = await Agent.findById(request.body.id);
    for (const key in request.body) {
      data[key] = request.body[key];
    }

    await data.save();
    response.status(200).json({ data: "updated" });
  } catch (error) {
    next(error);
  }
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

module.exports.uploadAgent = (request, response, next) => {
  console.log(request.file);
  Agent.findOne({ _id: request.params.id })
    .then((data) => {
      response.status(200).json({ data: "uploaded" });
    })
    // .save()
    .catch((error) => {
      next(error);
    });
};
