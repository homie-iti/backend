const fs = require('fs')
const { promisify } = require('util')

const unlinkAsync = promisify(fs.unlink)

const helperFunctions = require('./_HelperFunctions')

const User = require('../models/userModel')
const Landlord = require('../models/landlordModel')
const Agent = require('../models/agentModel')
const HelpQuestion = require('../models/helpQuestionModel')
const Contract = require('../models/contractModel')
const Review = require('../models/reviewModel')
const Unit = require('../models/unitModel')

module.exports.getUsersByPage = (request, response, next) => {
    User.paginate(
        {},
        {
            page: request.query.page || 1,
            // select: '',
            // populate: {},
        }
    )
        .then((data) => {
            console.log(data)
            response.status(200).json({
                currentPage: data.page,
                previousPage: data.prevPage,
                nextPage: data.nextPage,
                totalPages: data.totalPages,
                totalUsers: data.totalDocs,
                usersDisplayed: data.docs.length,
                remained: data.totalDocs - data.docs.length,
                results: data.docs,
            })
        })
        .catch((error) => {
            next(error)
        })
}

module.exports.getUserById = (request, response, next) => {
    User.findOne({ _id: request.params.id })
        .then((data) => {
            if (data == null) next(new Error('user not found'))
            response.status(200).json(data)
        })
        .catch((error) => {
            next(error)
        })
}

module.exports.createUser = (request, response, next) => {
    // console.log(request.file)
    // const image = request.file ? request.file.profile.path : ''

    const object = new User({
        fullName: request.body.fullName,
        age: request.body.age,
        email: request.body.email,
        gender: request.body.gender,
        password: request.body.password,
        phone: request.body.phone,
        national_id: request.body.national_id,
        balance: request.body.balance,
        address: request.body.address,
        // image,
    })
    object
        .save()
        .then((data) => {
            response.status(201).json({ data: 'added', id: data._id })
            // return { name: data.fullName, email: data.email }
        })
        // .then(notifyUser)
        .catch((error) => next(error))
}

module.exports.updateUser = (request, response, next) => {
    const allowed = [
        'fullName',
        'age',
        'email',
        'gender',
        'phone',
        'image',
        'address',
        'balance',
        'isAgent',
        'isLandlord',
    ]
    console.log(allowed)
    const requested = Object.keys(request.body)
    console.log(requested)
    const isValidUpdates = requested.every((i) => allowed.includes(i))
    console.log(isValidUpdates)
    if (!isValidUpdates) {
        next(new Error('User not allowed'))
    } else {
        const newUser = request.body
        User.findOneAndUpdate(
            { _id: request.params.id },
            { $set: newUser },
            { new: false, runValidators: true }
        )
            .then((data) => {
                if (!data) {
                    next(new Error('User not found'))
                } else {
                    response.status(200).json('updated')
                }
            })
            .catch((error) => next(error))
    }
}

module.exports.deleteUser = (request, response, next) => {
    User.deleteOne({ _id: request.params.id })
        .then((data) => {
            // console.log(data)
            if (data.deletedCount === 0) throw new Error('userID not found')

            return data
        })
        .then((data) =>
            // there is one document for each deleted user
            helperFunctions.deleteOneDocument(
                Agent,
                '_id',
                request.params.id,
                data
            )
        )
        .then((data) =>
            // there is one document for each deleted user
            helperFunctions.deleteOneDocument(
                Landlord,
                '_id',
                request.params.id,
                data
            )
        )
        .then((data) =>
            // there are many documents for each deleted user
            helperFunctions.deleteManyDocumentsByOneValue(
                HelpQuestion,
                'userId',
                request.params.id,
                data
            )
        )
        .then((data) =>
            // there are many documents for each deleted user
            helperFunctions.deleteManyDocumentsByOneValue(
                Review,
                'agentId',
                request.params.id,
                data
            )
        )
        .then((data) =>
            // there are many documents for each deleted user
            helperFunctions.deleteManyDocumentsByOneValue(
                Contract,
                'agentId',
                request.params.id,
                data
            )
        )
        .then((data) =>
            helperFunctions.deleteManyDocumentsByOneValue(
                Contract,
                'landlordId',
                request.params.id,
                data
            )
        )
        .then((data) =>
            // there are many documents for each deleted user
            helperFunctions.deleteManyDocumentsByOneValue(
                Unit,
                'agentId',
                request.params.id,
                data
            )
        )
        .then((data) =>
            // there are many documents for each deleted user
            helperFunctions.deleteManyDocumentsByOneValue(
                Unit,
                'landlordId',
                request.params.id,
                data
            )
        )
        .then((data) => {
            response.status(200).json({ data: 'deleted user' })
        })
        .catch((error) => next(error))
}

module.exports.deleteManyUser = (request, response, next) => {
    const { ids } = request.body
    User.deleteMany({ _id: { $in: ids } })
        .then((data) => {
            if (data.deletedCount === 0) throw new Error('users ids not found')
            return data
        })
        .then((data) =>
            // there are many documents for many deleted users
            helperFunctions.deleteManyDocumentsByManyValues(
                Agent,
                '_id',
                ids,
                data
            )
        )
        .then((data) =>
            // there are many documents for many deleted users
            helperFunctions.deleteManyDocumentsByManyValues(
                Landlord,
                '_id',
                ids,
                data
            )
        )
        .then((data) =>
            // there are many documents for many deleted users
            helperFunctions.deleteManyDocumentsByManyValues(
                HelpQuestion,
                'userId',
                ids,
                data
            )
        )
        .then((data) =>
            // there are many documents for many deleted users
            helperFunctions.deleteManyDocumentsByManyValues(
                Review,
                'agentId',
                ids,
                data
            )
        )
        .then((data) =>
            // there are many documents for many deleted users
            helperFunctions.deleteManyDocumentsByManyValues(
                Contract,
                'agentId',
                ids,
                data
            )
        )
        .then((data) =>
            // there are many documents for many deleted users
            helperFunctions.deleteManyDocumentsByManyValues(
                Contract,
                'landlordId',
                ids,
                data
            )
        )
        .then((data) =>
            // there are many documents for many deleted users
            helperFunctions.deleteManyDocumentsByManyValues(
                Unit,
                'agentId',
                ids,
                data
            )
        )
        .then((data) =>
            // there are many documents for many deleted users
            helperFunctions.deleteManyDocumentsByManyValues(
                Unit,
                'landlordId',
                ids,
                data
            )
        )
        .then((data) => {
            response.status(200).json({ data: 'deleted users' })
        })
        .catch((error) => {
            next(error)
        })
}

module.exports.getAllFavUnits = (request, response, next) => {
    User.find({ _id: request.params.id })
        .populate({ path: 'favoriteUnits' })
        .select({ favoriteUnits: 1, _id: 1 })
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
    User.findByIdAndUpdate(
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

module.exports.removeFavUnit = (request, response, next) => {
    User.updateOne(
        { _id: request.params.id },
        { $pull: { favoriteUnits: request.body.favoriteUnits } }
    )

        .then((data) => {
            response.status(200).json({ data: 'deleted' })
        })
        .catch((error) => {
            next(error)
        })
}

module.exports.uploadUserImage = (request, response, next) => {
    // response.status(201).json("Cover Image Uploaded");
    console.log(request.file)
    console.log(request.file.path)

    User.findOne({ _id: request.params.id })
        .then((data) => {
            console.log(data)
            if (data == null) next(new Error("User Doesn't Exist"))
            data.image = request.file.path
            data.save()
            response.status(201).json('Image has been uploaded')
        })
        .catch((error) => next(error))
}

// TODO Needs to be enhanced(user can delete his image,user can update it but when choose update he should upload image)
module.exports.updateUserImage = (request, response, next) => {
    console.log(request.file)
    let imagePath
    if (request.file) {
        let newPath = request.file.path.split('\\')
        console.log(newPath)
        newPath.shift()
        imagePath = newPath.join('/')
        console.log(newPath, imagePath)
    }
    const newUserImage = request.file ? imagePath : ''
    User.findOneAndUpdate({ _id: request.params.id }, { image: newUserImage })

        .then((data) => {
            unlinkAsync(data.image)
            if (data == null) next(new Error("User Doesn't Exist"))
            response.status(201).json('User Image has been updated')
        })
        .catch((error) => next(error))
}
