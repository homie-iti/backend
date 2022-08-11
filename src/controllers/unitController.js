const fs = require('fs')
const { promisify } = require('util')

const unlinkAsync = promisify(fs.unlink)

const UnitModel = require('../models/unitModel')
const ReviewModel = require('../models/reviewModel')
const LandlordModel = require('../models/landlordModel')
const CityModel = require('../models/cityModel')
const AgentModel = require('../models/agentModel')

// Get Units using page number
module.exports.getUnitsByPage = (request, response, next) => {
    UnitModel.paginate(
        {},
        {
            page: request.query.page || 1,
            select: 'estateType images unitInfo isAvailable gender dailyPrice address numberOfResidents allowedGender',
            populate: { path: 'landlordId', select: 'fullName phone image' },
        }
    )
        .then((data) => {
            console.log(data)
            response.status(200).json({
                currentPage: data.page,
                previousPage: data.prevPage,
                nextPage: data.nextPage,
                totalPages: data.totalPages,
                totalUnits: data.totalDocs,
                unitsDisplayed: data.docs.length,
                remained: data.totalDocs - data.docs.length,
                results: data.docs,
            })
        })
        .catch((error) => {
            next(error)
        })
}

// Get Specific Unit By Id
module.exports.getUnitById = (request, response, next) => {
    UnitModel.findOne(
        { _id: request.params.id },
        'estateType images unitInfo isAvailable isPetsAllowed gender address dailyPrice cover geoLocation reviews'
    )
        .populate({ path: 'landlordId', select: 'fullName phone image' })
        .populate({
            path: 'reviews.reviews',
            select: 'createdAt rating comment agentId _id',
            populate: {
                path: 'agentId',
                select: '_id',
                populate: { path: '_id', select: 'fullName image' },
            },
        })

        .then((data) => {
            if (data == null) throw new Error("Unit Doesn't Exist")
            else {
                response.status(200).json(data)
            }
        })
        .catch((error) => {
            next(error)
        })
}

// Create/Add New Unit
module.exports.createUnit = (request, response, next) => {
    const { cityId } = request.body
    const { landlordId } = request.body
    LandlordModel.exists({ _id: landlordId })
        .then((data) => {
            if (!data) throw new Error('landlordId is not in db')
            return CityModel.exists({ _id: cityId })
        })
        .then((data) => {
            if (!data) throw new Error('cityId is not in db')
            return data
        })
        .catch((error) => {
            next(error)
        })

    let UnitImagesPaths = []
    let unitData
    //  console.log(UnitImagesPaths)

    const unit = {
        landlordId,
        cityId,
        estateType: request.body.estateType,
        address: request.body.address,
        dailyPrice: request.body.dailyPrice,
        isAvailable: request.body.isAvailable,
        numberOfResidents: request.body.numberOfResidents,
        unitInfo: request.body.unitInfo,
        allowedGender: request.body.allowedGender,
    }

    if (request.files && request.files.unitCover) {
        unit.cover = request.files.unitCover[0].path
    }

    if (request.files && request.files.unitImages) {
        const unitImagesArray = request.files.unitImages
        UnitImagesPaths = unitImagesArray.map((image) => image.path)
        unit.images = UnitImagesPaths
    }
    const newUnit = new UnitModel(unit)

    newUnit
        .save()
        .then((data) => {
            console.log(data)
            unitData = data
            return LandlordModel.findByIdAndUpdate(
                landlordId,
                {
                    $push: { landlordUnits: newUnit._id },
                },
                { new: true }
            )
        })
        .then(() =>
            CityModel.findByIdAndUpdate(
                cityId,
                { $push: { units: newUnit._id } },
                { new: true }
            )
        )
        .then(() => {
            response.status(201).json({
                data: 'unit added to units collection,landlord units and city units',
                id: unitData._id,
            })
        })
        .catch((error) => next(error))
}

// Update Unit Data
module.exports.updateUnitData = (request, response, next) => {
    UnitModel.findOne({ _id: request.params.id })
        .then((data) => {
            // console.log(data)
            if (data == null) throw new Error("Unit Doesn't Exist")

            const updates = request.body
            console.log(updates)
            for (const key in updates) {
                if (typeof updates[key] === 'object') {
                    for (let update in updates[key]) {
                        data[key][update] = updates[key][update]
                    }
                } else data[key] = updates[key]
            }
            data.save()
        })
        .then(() => {
            response.status(201).json({ data: 'Unit data updated' })
        })
        .catch((error) => next(error))
}

// delete specific unit
module.exports.deleteUnit = (request, response, next) => {
    let unitData
    UnitModel.findOneAndDelete({ _id: request.params.id })

        .then((data) => {
            console.log(`unitData:${data}`)
            if (!data) throw new Error('unitId is not in db')
            unitData = data
            return CityModel.findByIdAndUpdate(
                { _id: unitData.cityId },
                { $pull: { units: unitData._id } },
                { new: true }
            )
        })
        .then(() =>
            LandlordModel.findByIdAndUpdate(
                { _id: unitData.landlordId },
                {
                    $pull: { landlordUnits: unitData._id },
                },
                { new: true }
            )
        )
        .then(() => {
            response
                .status(200)
                .json(
                    'unit deleted from units collection,landlord units and city units'
                )
        })
        .catch((error) => next(error))
}

// Upload Unit Cover //? Think, Do we need this route or not??
module.exports.uploadUnitCover = (request, response, next) => {
    console.log(request.file)
    console.log(request.file.path)

    UnitModel.findOne({ _id: request.params.id })
        .then((data) => {
            console.log(data)
            if (data == null) throw new Error("Unit Doesn't Exist")
            data.cover = request.file.path
            data.save()
            response.status(201).json('Cover Image Uploaded')
        })
        .catch((error) => next(error))
}

// update cover image
// TODO Try to update the image without entering new one.
//* (user want to delete it )
module.exports.updateUnitCover = (request, response, next) => {
    console.log(request.file)
    console.log(request.file.path)

    UnitModel.findOneAndUpdate(
        { _id: request.params.id },
        { cover: request.file.path }
    )

        .then((data) => {
            // console.log(data)
            // console.log(data.cover)
            unlinkAsync(data.cover) // ! for removing image from uploads file(works well,but check if it is the suitable way)
            if (data == null) throw new Error("Unit Doesn't Exist")
            // data.cover = request.file.path
            response.status(201).json('Unit Cover Image has been updated')
        })
        .catch((error) => next(error))
}

// Upload Unit Images
module.exports.uploadUnitImages = (request, response, next) => {
    // console.log(request.files)
    // console.log(request.files.path)
    UnitModel.findOne({ _id: request.params.id })
        .then((data) => {
            console.log(data)
            // console.log(data.images)

            if (data == null) throw new Error("Unit Doesn't Exist")

            request.files.forEach((image) => {
                console.log(image.path)
                data.images.push(image.path)
            })
            data.save()
            response.status(201).json('Unit Images Uploaded')
        })
        .catch((error) => next(error))
}

// TODO Delete Unit Images (check it again)
// !
module.exports.deleteUnitImages = (request, response, next) => {
    UnitModel.updateMany(
        { _id: request.params.id },
        {
            $pullAll: {
                images: request.body.images,
            },
        }
    )
        .then((data) => {
            console.log(request.body.images)
            const deletedImages = request.body.images
            deletedImages.forEach((image) => {
                unlinkAsync(image)
            })

            if (data.matchedCount === 0) throw new Error('Unit Not Found')
            else {
                response.status(200).json(data)
            }
        })
        .catch((error) => next(error))
}

// module.exports.getUnitReviews = (request, response, next) => {
//     Review.find({ unitId: request.params.id }, 'rating comment')
//         .populate({ path: 'unitId', select: 'city estateType address cover' })
//         .populate({ path: 'agentId', select: 'fullName image' })
//         .then((data) => {
//             console.log(data)
//             if (data == null) throw new Error("This Unit Haven't Reviews Yet.")
//             else {
//                 response.status(200).json(data)
//             }
//         })
//         .catch((error) => {
//             next(error)
//         })
// }

// module.exports.getUnitReviewsByPage = (request, response, next) => {
//     Review.paginate(
//         { unitId: request.params.id },
//         {
//             page: request.query.page || 1,
//             // select: '',
//             // populate: {  },
//         }
//     )
//         .then((data) => {
//             console.log(data)
//             response.status(200).json({
//                 currentPage: data.page,
//                 previousPage: data.prevPage,
//                 nextPage: data.nextPage,
//                 totalPages: data.totalPages,
//                 totalUnitReviews: data.totalDocs,
//                 UnitReviewsDisplayed: data.docs.length,
//                 remained: data.totalDocs - data.docs.length,
//                 results: data.docs,
//             })
//         })
//         .catch((error) => {
//             next(error)
//         })
// }

module.exports.getAllReviews = (request, response, next) => {
    ReviewModel.find({})
        .then((data) => {
            response.status(200).json(data)
        })
        .catch((error) => next(error))
}

module.exports.getReviewById = (request, response, next) => {
    ReviewModel.findOne({ _id: request.params.id })

        .then((data) => {
            if (data == null) next(new Error("Review Doesn't Exist"))
            else {
                response.status(200).json(data)
            }
        })
        .catch((error) => {
            next(error)
        })
}

module.exports.addReview = (request, response, next) => {
    UnitModel.findOne({ _id: request.body.unitId })
        .then((unit) => {
            if (unit == null) throw new Error("Unit Doesn't Found.")

            return AgentModel.findOne({
                _id: request.body.agentId,
                'agentUnits.unitId': request.body.unitId,
            })
        })
        .then((agent) => {
            console.log(`"agent" ${agent}`)
            // TODO removed the next two lines to enable anyone to comment
            // if (agent == null)
            //     throw new Error("Agent has this unit doesn't found.")
            // console.log('this agent has this unit')
            const newReview = new ReviewModel({
                unitId: request.body.unitId,
                agentId: request.body.agentId,
                comment: request.body.comment,
                rating: request.body.rating,
            })
            return newReview.save()
        })
        .then((review) => {
            console.log(review)
            return UnitModel.updateOne(
                { _id: request.body.unitId },
                {
                    $push: { 'reviews.ratings': review.rating },
                    $addToSet: {
                        'reviews.reviews': review._id,
                    },
                }
            )
        })
        .then((data) => {
            console.log(data)
            if (data.modifiedCount === 0 || data.matchedCount === 0)
                throw new Error("Can't modified unit data.")
            response.status(200).json(data)
        })
        .catch((error) => next(error))
}

// get unit average ratings (output:ratingsAverage,numberOfReviews,[reviews])
module.exports.getUnitReviews = (request, response, next) => {
    UnitModel.findOne(
        { _id: request.params.id },
        { 'reviews.ratings': 1, 'reviews.reviews': 1 }
    )
        .populate({
            path: 'reviews.reviews',
            select: { agentId: 1, comment: 1, rating: 1, createdAt: 1 },
        })
        .then((data) => {
            console.log(data)
            console.log(data.reviews.ratings)
            if (data == null) throw new Error("Unit Doesn't Found")
            else {
                const totalRatings = data.reviews.ratings
                const ratingAverage =
                    totalRatings.reduce((a, b) => a + b, 0) /
                    totalRatings.length
                response.status(200).json({
                    RatingAverage: ratingAverage,
                    reviewsCount: data.reviews.reviews.length,
                    reviews: data.reviews.reviews,
                    unitId: data._id,
                })
            }
        })
        .catch((error) => {
            next(error)
        })
}

module.exports.deleteUnitReviews = (request, response, next) => {
    UnitModel.updateOne(
        { _id: request.params.unitId },
        { $pull: { 'reviews.reviews': request.params.reviewId } }
    )

        .then((data) => {
            console.log(data)
            if (data.modifiedCount === 0) throw new Error(`Unit not found`)
            return ReviewModel.deleteOne({ _id: request.params.reviewId })
        })
        .then((data) => {
            if (data.deletedCount === 0)
                throw new Error(`Review not found in unit reviews `)

            response
                .status(200)
                .json(
                    'Review deleted from unit reviews and reviews collection successfully'
                )
        })
        .catch((error) => {
            next(error)
        })
}

// ! Things to think about it:
//* Landlord upload new images in addition to the exist one.
// *landlord delete already exists images
// TODO Check again if I achieved this in my code.
