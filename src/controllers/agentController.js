const mongoose = require("mongoose");
require("../models/agentModel");
require("../models/userModel");
require("../models/unitModel");

let Agent = mongoose.model("agents");
let User = mongoose.model("users");
let Unit = mongoose.model("units");

const saltRounds = 10
// Get All Agents
// module.exports.getAllAgents = (request, response, next) => {
//     Agent.find({})
//         .populate({
//             path: '_id',
//             select: {},
//         })
//         .populate({
//             path: 'agentUnits',
//             select: {},
//         })
//         .then((data) => {
//             response.status(200).json(data)
//         })
//         .catch((error) => {
//             next(error)
//         })
// }

module.exports.getAgentsByPage = (request, response, next) => {
    Agent.paginate(
        {},
        {
            page: request.query.page || 1,
            // select: '',
            populate: { path: 'agentUnits _id' },
        }
    )
        .then((data) => {
            console.log(data)
            response.status(200).json({
                currentPage: data.page,
                previousPage: data.prevPage,
                nextPage: data.nextPage,
                totalPages: data.totalPages,
                totalAgents: data.totalDocs,
                agentsDisplayed: data.docs.length,
                remained: data.totalDocs - data.docs.length,
                results: data.docs,
            })
        })
        .catch((error) => {
            next(error)
        })
}
// Get Agent By ID
module.exports.getAgentByID = (request, response, next) => {
  Agent.findOne({ _id: request.params.id })
    .populate({
      path: "_id",
      select: {},
    })
    .populate({
      path: "agentUnits.unitId",
      select: {},
    })
    // .populate({
    //   path: "favoriteUnits",
    //   select: {},
    // })
    .then((data) => {
      if (data == null) next(new Error(" Agent not found"));
      response.status(200).json(data);
    })
    .catch((error) => {
      next(error);
    });
};

exports.createAgent = async (request, response, next) => {
  try {
    for (let value of request.body.agentUnits) {
      let filterUnit = value.unitId;

      const unitExist = await Unit.findById(filterUnit);
      if (!unitExist) throw new Error(`unitId isn't valid`);
    }

    const filteruUser = request.body._id;
    const update = { isAgent: "true" };

    const UserExist = await User.findByIdAndUpdate(filteruUser, update);
    if (!UserExist) throw new Error(`userId isn't valid`);

    const agentObject = new Agent({ ...request.body });
    const data = await agentObject.save();

    response.status(201).json({ data: "agent added" });
  } catch (error) {
    next(error);
  }
};

exports.updateAgentUnits = async (request, response, next) => {
  try {
    let unitIds = [];
    let filterduplicated = [];

    const data1 = await Agent.findById(request.body._id);
    for (let value of data1.agentUnits) {
      unitIds.push(value.unitId.toString());
    }

    for (let value of request.body.agentUnits) {
      let filterUnit = value.unitId;
      filterduplicated.push(value.unitId);

      const unitExist = await Unit.findById(filterUnit);
      if (!unitExist) throw new Error(`unitId isn't valid`);
    }

    console.log(filterduplicated);
    for (i = 0; i <= filterduplicated.length; i++) {
      if (unitIds.includes(filterduplicated[i]))
        throw new Error(`duplicated unitID isn't valid`);
    }

    const filterAgent = request.body._id;
    const update = { $addToSet: { agentUnits: request.body.agentUnits } };

    const data = await Agent.findByIdAndUpdate(filterAgent, update);

    response.status(200).json({
      data,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteAgent = async (request, response, next) => {
  try {
    const data = await Agent.deleteOne({
      _id: request.params.id,
    })

    if (data.deletedCount < 1) throw new Error("Agent  not found");

    const filteruUser = request.params.id;
    const update = { isAgent: "false" };

    const userupdate = await User.findByIdAndUpdate(filteruUser, update);
    if (!userupdate) throw new Error(`userId isn't valid`);

    response.status(200).json({ message: "deleted Agent" });
  } catch (error) {
    next(error);
  }
};

exports.RemoveAgentUnits = async (request, response, next) => {
  try {
    let deletedArr = [];

    for (let value of request.body.agentUnits) {
      deletedArr.push(value.unitId);
    }

    console.log(deletedArr);
    const data = await Agent.updateOne(
      { _id: request.body._id },
      {
        $pull: {
          agentUnits: { unitId: { $in: deletedArr } },
        },
      }
    );

    if (data.matchedCount < 1) throw new Error("Agent  not found");
    if (data.modifiedCount < 1)
      throw new Error("Agent units couldn't be modified");

    response.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};
