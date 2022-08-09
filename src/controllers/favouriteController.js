const User = require('../models/userModel')
const Unit = require('../models/unitModel')

module.exports.getUserFavUnits = (request, response, next) => {
    User.find({ _id: request.params.userId }, { _id: 1, favoriteUnits: 1 })
        .populate({ path: 'favoriteUnits' })
        .then((data) => {
            console.log(data)
            if (!data.length)
                throw new Error('This user has no favorite units yet.')

            response.status(200).json(data)
        })
        .catch((error) => {
            next(error)
        })
}

module.exports.addUnitToFavorite = (request, response, next) => {
    let userData
    User.findOne({ _id: request.params.userId }, { _id: 1, favoriteUnits: 1 })
        .then((data) => {
            if (!data) throw new Error('User is not in db')
            if (data.favoriteUnits.includes(request.body.unitId))
                throw new Error('Unit exists already in favoriteUnits.')
            userData = data
            return Unit.findOne({ _id: request.body.unitId })
        })
        .then((unit) => {
            console.log(unit)
            if (!unit) throw new Error('Unit is not in db')
            userData.favoriteUnits.push(request.body.unitId)
            userData.save()
            response
                .status(200)
                .json('The unit has been added to user favorite units.')
        })
        .catch((error) => next(error))
}

// module.exports.deleteUnitFromFavorites = (request, response, next) => {
//     User.findOne({ _id: request.params.userId }, '_id favoriteUnits')
//         .then((data) => {
//             console.log(data)
//             if (!data) throw new Error('User is not in db')
//             if (data.favoriteUnits.includes(request.params.unitId))
//                 data.favoriteUnits.splice(request.params.unitId, 1)
//             //     throw new Error('Unit exists already in favoriteUnits.')
//             // data.favoriteUnits.push(request.body.unitId)
//             // // console.log(data)
//             data.save()
//             // response.status(200).json(data)
//         })
//         .catch((error) => next(error))
// }

module.exports.deleteUnitFromFavorites = (request, response, next) => {
    User.findOne({ _id: request.params.userId })

        .then((data) => {
            console.log(data)
            if (!data) throw new Error('User is not in db')
            if (!data.favoriteUnits.includes(request.params.unitId))
                throw new Error('This unit does not exist on favorite units.')

            return User.findOneAndUpdate(
                { _id: request.params.userId },
                {
                    $pull: { favoriteUnits: request.params.unitId },
                },
                { new: true }
            )
        })
        .then((data) => {
            console.log(data)
            response
                .status(200)
                .json('The unit has been deleted from user favorite units.')
        })
        .catch((error) => next(error))
}
