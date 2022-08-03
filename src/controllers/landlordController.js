const helperFunctions = require('./_HelperFunctions')

const LandlordModel = require('../models/landlordModel')
const UserModel = require('../models/userModel')
const UnitModel = require('../models/unitModel')

// Get All landlords
// module.exports.getAllLandLord = (request, response, next) => {
//     Landlord.find({})
//         .populate({ path: '_id' })
//         .populate({ path: 'landlordUnits' })
//         .then((data) => {
//             response.status(200).json(data)
//         })
//         .catch((error) => {
//             next(error)
//         })
// }

module.exports.getLandlordsByPage = (request, response, next) => {
    LandlordModel.paginate(
        {},
        {
            page: request.query.page || 1,
            // select: '',
            // populate: { path: 'landlordUnits _id' },
        }
    )
        .then((data) => {
            console.log(data)
            response.status(200).json({
                currentPage: data.page,
                previousPage: data.prevPage,
                nextPage: data.nextPage,
                totalPages: data.totalPages,
                totalLandlords: data.totalDocs,
                landlordsDisplayed: data.docs.length,
                remained: data.totalDocs - data.docs.length,
                results: data.docs,
            })
        })
        .catch((error) => {
            next(error)
        })
}

// Get All landlord by Id
module.exports.getLandLordById = (request, response, next) => {
    LandlordModel.findOne({ _id: request.params.id })
        .then((data) => {
            if (data == null) next(new Error(' landlord is not found'))
            response.status(200).json(data)
        })
        .catch((error) => {
            next(error)
        })
}

// Add LandLord
module.exports.CreateLandLord = (request, response, next) => {
    UserModel.exists({ _id: request.body._id })
        .then((data) => {
            // console.log(data)
            if (!data)
                throw new Error(`_id is not available in users collection`)

            const object = new LandlordModel(request.body)
            return object.save()
        })
        .then((data) =>
            helperFunctions.updateOneDocument(
                UserModel,
                '_id',
                request.body._id,
                { isLandlord: true },
                data
            )
        )
        .then((data) => {
            response.status(201).json({ data: 'added', id: data._id })
        })
        .catch((error) => next(error))
}

// Update LandLord Units
module.exports.updateLandlordUnits = (request, response, next) => {
    // TODO shouldn't be used in api

    LandlordModel.findByIdAndUpdate(
        { _id: request.body.id },
        { $addToSet: { landlordUnits: request.body.landlordUnits } },
        { new: true }
    )
        .then((data) => {
            response.status(200).json(data)
        })
        .catch((error) => {
            next(error)
        })
}

// Delete LandLord By ID
module.exports.deleteLandlordById = (request, response, next) => {
    LandlordModel.deleteOne({ _id: request.params.id })
        .then((data) => {
            if (data.deletedCount === 0)
                next(new Error('LandLord is not defined'))
            return data
        })
        .then((data) =>
            helperFunctions.updateOneDocument(
                UserModel,
                '_id',
                request.params.id,
                { isLandlord: false },
                data
            )
        )
        .then((data) =>
            helperFunctions.deleteManyDocumentsByOneValue(
                UnitModel,
                'landlordId',
                request.params.id,
                data
            )
        )
        .then((data) => {
            response.status(200).json({ data: `deleted landlord` })
        })
        .catch((error) => {
            next(error)
        })
}

// Remove From LandLord Units
module.exports.RemoveLandlordUnits = (request, response, next) => {
    // TODO shouldn't be used in api
    LandlordModel.updateOne(
        { _id: request.params.id },
        { $pull: { landlordUnits: request.body.landlordUnits } },
        { new: true }
    )
        .then((data) => {
            response.status(200).json(data)
        })
        .catch((error) => {
            next(error)
        })
}
