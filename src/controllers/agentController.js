const bcrypt = require('bcrypt')
const Agent = require('../models/agentModel')

const saltRounds = 10
// Get All Agents
module.exports.getAllAgents = (request, response, next) => {
    Agent.find({})
        .populate({
            path: '_id',
            select: {},
        })
        .populate({
            path: 'agentUnits',
            select: {},
        })
        .populate({
            path: 'favoriteUnits',
            select: {},
        })
        .then((data) => {
            response.status(200).json(data)
        })
        .catch((error) => {
            next(error)
        })
}

// Get Agent By ID
module.exports.getAgentByID = (request, response, next) => {
    Agent.findOne({ _id: request.params.id })
        .populate({
            path: '_id',
            select: {},
        })
        .populate({
            path: 'agentUnits',
            select: {},
        })
        .populate({
            path: 'favoriteUnits',
            select: {},
        })
        .then((data) => {
            if (data == null) next(new Error(' Agent not found'))
            response.status(200).json(data)
        })
        .catch((error) => {
            next(error)
        })
}

// create Agent
module.exports.createAgent = (request, response, next) => {
    const object = new Agent({
        _id: request.body.id,
        fullName: request.body.fullName,
        age: request.body.age,
        email: request.body.email,
        password: bcrypt.hashSync(request.body.password, saltRounds),
        phone: request.body.phone,
        national_id: request.body.national_id,
        gender: request.body.gender,
        address: request.body.address,
        image: request.body.image,
        agentUnits: request.body.agentUnits,
        favoriteUnits: request.body.favoriteUnits,
    })
    object
        .save()
        .then((data) => {
            response.status(201).json({ data: 'added' })
        })
        .catch((error) => next(error))
}

// Update Agent By ID
module.exports.updateAgent = (request, response, next) => {
    Agent.findById(request.body.id)
        .then((data) => {
            for (const key in request.body) {
                data[key] = request.body[key]
            }
            data.save()
            response.status(200).json({ data: 'updated' })
        })
        .catch((error) => {
            next(error)
        })
}

// Delete Agent By ID
module.exports.deleteAgent = (request, response, next) => {
    Agent.deleteOne({ _id: request.params.id })
        .then((data) => {
            if (!data) {
                next(new Error(' Agent not found'))
            } else {
                response.status(200).json({ data: 'deleted' })
            }
        })
        .catch((error) => {
            next(error)
        })
}

// Update Agent Units
module.exports.updateAgentUnits = (request, response, next) => {
    Agent.findByIdAndUpdate(
        { _id: request.body.id },
        { $addToSet: { agentUnits: request.body.agentUnits } }
    )
        .then((data) => {
            response.status(200).json(data)
        })
        .catch((error) => {
            next(error)
        })
}

// Remove From Agent Units
module.exports.RemoveAgentUnits = (request, response, next) => {
    Agent.updateOne(
        { _id: request.params.id },
        { $pull: { agentUnits: request.body.agentUnits } }
    )
        .then((data) => {
            response.status(200).json(data)
        })
        .catch((error) => {
            next(error)
        })
}
