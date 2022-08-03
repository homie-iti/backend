const fs = require('fs')
const { promisify } = require('util')

const unlinkAsync = promisify(fs.unlink)

const Unit = require('../models/unitModel')
const Review = require('../models/reviewModel')
const Landlord = require('../models/landlordModel')
const City = require('../models/cityModel')
const Agent = require('../models/agentModel')

// Get Units using page number
module.exports.getUnitsByPage = (request, response, next) => {
    Unit.paginate(
        {},
        {
            page: request.query.page || 1,
            select: 'estateType images unitInfo isAvailable gender dailyPrice address',
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
    Unit.findOne(
        { _id: request.params.id },
        'estateType images unitInfo isAvailable isPetsAllowed gender address dailyPrice cover geoLocation reviews'
    )
        .populate({ path: 'landlordId', select: 'fullName phone image' })
        .then((data) => {
            if (data == null) next(new Error("Unit Doesn't Exist"))
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
    Landlord.exists({ _id: landlordId })
        .then((data) => {
            if (!data) throw new Error('landlordId is not in db')
            return City.exists({ _id: cityId })
        })
        .then((data) => {
            if (!data) throw new Error('cityId is not in db')
            return data
        })
        .catch((error) => {
            next(error)
        })

    let UnitImagesPaths = []
    let images
    let cover
    if (request.files.unitImages && request.files.path) {
        const unitImagesArray = request.files.unitImages
        UnitImagesPaths = unitImagesArray.map((image) => image.path)
        images = request.files.unitImages ? UnitImagesPaths : []
    }
    if (request.files.unitCover) {
        cover = request.files.unitCover[0].path
    }
    console.log(UnitImagesPaths)

    const unit = {
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
    }
    const newUnit = new Unit(unit)

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
            response.status(200).json(data)
        })
        .catch((error) => next(error))
}

// Update Unit Data
module.exports.updateUnitData = (request, response, next) => {
    Unit.findOne({ _id: request.body.id })
        .then((data) => {
            // console.log(data);
            if (data == null) next(new Error("Unit Doesn't Exist"))
            else {
                const updates = request.body
                // console.log(updates);
                for (const property in updates) {
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
                    data[property] = updates[property] || data[property]
                    if (typeof updates[property] === 'object') {
                        console.log('updateObject')
                    }
                }
                data.save().then((data) => {
                    console.log(data)
                    response.status(201).json({ data: 'Unit Data Updated' })
                })
            }
        })
        .catch((error) => next(error))
}

// delete specific unit
module.exports.deleteUnit = (request, response, next) => {
    const { cityId } = request.body
    const { landlordId } = request.body
    // !Promise.all needs to be checked (!Important)
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
            if (data.matchedCount === 0) {
                next(new Error('Unit Not Found'))
                // ! doesn't work check it again
            } else {
                response.status(200).json('Unit Deleted')
            }
        })
        .catch((error) => next(error))
}

// Upload Unit Cover //? Think, Do we need this route or not??
module.exports.uploadUnitCover = (request, response, next) => {
    console.log(request.file)
    console.log(request.file.path)

    Unit.findOne({ _id: request.params.id })
        .then((data) => {
            console.log(data)
            if (data == null) next(new Error("Unit Doesn't Exist"))
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

    Unit.findOneAndUpdate(
        { _id: request.params.id },
        { cover: request.file.path }
    )

        .then((data) => {
            // console.log(data);
            // console.log(data.cover);
            unlinkAsync(data.cover) // ! for removing image from uploads file(works well,but check if it is the suitable way)
            if (data == null) next(new Error("Unit Doesn't Exist"))
            // data.cover = request.file.path;
            response.status(201).json('Unit Cover Image has been updated')
        })
        .catch((error) => next(error))
}

// Upload Unit Images
module.exports.uploadUnitImages = (request, response, next) => {
    // console.log(request.files);
    // console.log(request.files.path);
    Unit.findOne({ _id: request.params.id })
        .then((data) => {
            console.log(data)
            // console.log(data.images);

            if (data == null) next(new Error("Unit Doesn't Exist"))

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
    Unit.updateMany(
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

            if (data.matchedCount === 0) next(new Error('Unit Not Found'))
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
//             if (data == null) next(new Error("This Unit Haven't Reviews Yet."))
//             else {
//                 response.status(200).json(data)
//             }
//         })
//         .catch((error) => {
//             next(error)
//         })
// }

module.exports.getUnitReviewsByPage = (request, response, next) => {
    Review.paginate(
        {},
        {
            page: request.query.page || 1,
            // select: '',
            // populate: {  },
        }
    )
        .then((data) => {
            console.log(data)
            response.status(200).json({
                currentPage: data.page,
                previousPage: data.prevPage,
                nextPage: data.nextPage,
                totalPages: data.totalPages,
                totalUnitReviews: data.totalDocs,
                UnitReviewsDisplayed: data.docs.length,
                remained: data.totalDocs - data.docs.length,
                results: data.docs,
            })
        })
        .catch((error) => {
            next(error)
        })
}

module.exports.getAllReviews = (request, response, next) => {
    Review.find({})
        .then((data) => {
            response.status(200).json(data)
        })
        .catch((error) => next(error))
}

// TODO needs enhancement (try,catch to avoid callback hells)
module.exports.addReview = (request, response, next) => {
    Unit.findOne({ _id: request.body.unitId })
        .then((unit) => {
            if (unit == null) next(new Error("Unit Doesn't Found."))
            else {
                Agent.findOne({
                    _id: request.body.agentId,
                    'agentUnits.unitId': request.body.unitId,
                }).then((agent) => {
                    console.log(`"agent" ${agent}`)
                    if (agent == null)
                        next(new Error("Agent has this unit doesn't found."))
                    // console.log('this agent has this unit')
                    const newReview = new Review({
                        unitId: request.body.unitId,
                        agentId: request.body.agentId,
                        comment: request.body.comment,
                        rating: request.body.rating,
                    })
                    newReview.save().then((review) => {
                        console.log(review)
                        Unit.updateOne(
                            { _id: request.body.unitId },
                            {
                                $push: { 'reviews.ratings': review.rating },
                                $addToSet: {
                                    'reviews.totalReviews': review._id,
                                },
                            }
                        )
                            .then((data) => {
                                console.log(data)
                                if (
                                    data.modifiedCount === 0 ||
                                    data.matchedCount === 0
                                )
                                    next(new Error("Can't modified unit data."))
                                response.status(200).json(data)
                            })
                            .catch((error) => next(error))
                    })
                })
            }
        })

        .catch((error) => next(error))
}

// get unit average ratings (output:ratingsAverage,numberOfReviews,[reviews])
module.exports.getUnitAverageRatings = (request, response, next) => {
    Unit.findOne(
        { _id: request.params.id },
        { 'reviews.ratings': 1, 'reviews.totalReviews': 1 }
    )
        .populate({
            path: 'reviews.totalReviews',
            select: { agentId: 1, comment: 1 },
        })
        .then((data) => {
            console.log(data)
            console.log(data.reviews.ratings)
            if (data == null) next(new Error("Unit Doesn't Found"))
            else {
                const totalRatings = data.reviews.ratings
                const ratingAverage =
                    totalRatings.reduce((a, b) => a + b, 0) /
                    totalRatings.length
                response.status(200).json({
                    RatingAverage: ratingAverage,
                    reviewsCount: data.reviews.totalReviews.length,
                    reviews: data.reviews.totalReviews,
                })
            }
        })
        .catch((error) => {
            next(error)
        })
}

// ! Things to think about it:
//* Landlord upload new images in addition to the exist one.
// *landlord delete already exists images
// TODO Check again if I achieved this in my code.
