let Agent = require('./../models/agentModel')

module.exports.getAllFavUnits = (request, response, next) => {
    Agent.find({ _id: request.params.id })
        .select({ favoriteUnits: 1, _id: 1 })
        .populate({ path: 'favoriteUnits' })
        .then((data) => {
            if (data == null) {
                next(new Error('Agent Fav Unit is not defined'))
            } else {
                response.status(200).json(data)
            }
        })
        .catch((error) => {
            next(error)
        })
}

module.exports.updateFavUnit = (request, response, next) => {
    Agent.findByIdAndUpdate(
        { _id: request.params.id },
        { $addToSet: { favoriteUnits: request.body.favoriteUnits } }
    )
        .then((data) => {
            response.status(200).json(data)
        })
        .catch((error) => {
            next(error)
        })
}

//

module.exports.removeFavUnit = (request, response, next) => {
    Agent.updateOne(
        { _id: request.params.id },
        { $pull: { favoriteUnits: request.body.favoriteUnits } }
    )

        .then((data) => {
            response.status(200).json(data)
        })
        .catch((error) => {
            next(error)
        })
}
