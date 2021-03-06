const mongoose = require('mongoose')
const fs = require('fs')
const { promisify } = require('util')

const unlinkAsync = promisify(fs.unlink)

const User = require('../models/userModel')
const Landlord = require('../models/landlordModel')
const Agent = require('../models/agentModel')

// const EmailClient = require('../utilities/sendEmail')

// const emailNotifier = new EmailClient()
// async function notifyUser(userInfo) {
//     const msgState = await emailNotifier.sendMessage(
//         'user_creation',
//         userInfo.name,
//         userInfo.email
//     )

//     console.log(msgState)

//     return msgState
// }

// module.exports.getAllUsers = (request, response, next) => {
//   response.status(200).json();
// };

module.exports.getAllUsers = (request, response, next) => {
    User.find({})
        .then((data) => {
            if (data == null) next(new Error('User not Found'))
            // if (data.isLandlord == true) {
            //   Landlord.findone({ _id: request.params.id }).populate({ path: "isLandlord", select: { _id: 0, landlordUnits: 1 } })
            // }
            // if (data.isAgent) {
            //   Agent.findone({ _id: request.body.id }).populate({ path: "isAgent", select: { _id: 0, agentUnits: 1 } })
            // }
            // else if (data.isLandlord == true && data.isAgent == true) {
            //   Agent.findone({ _id: request.body.id }).populate({ path: "isAgent", select: { _id: 0, agentUnits: 1 } })
            //   Landlord.findone({ _id: request.body.id }).populate({ path: "isLandlord", select: { _id: 0, landlordUnits: 1 } })
            // }
            response.status(200).json(data)
        })
        .catch(
            console.error((error) => {
                next(error)
            })
        )
}

module.exports.getUserById = (request, response, next) => {
    User.findOne({ _id: request.params.id })
        .then((data) => {
            if (data == null) next(new Error(' teacher not found'))
            response.status(200).json(data)
        })
        .catch((error) => {
            next(error)
        })
}

module.exports.createUser = (request, response, next) => {
    const object = new User(request.body)
    object
        .save()
        .then((data) => {
            response.status(201).json({ data })
            // return { name: data.fullName, email: data.email }
        })
        // .then(notifyUser)
        .catch((error) => next(error))
}

module.exports.updateUser = (request, response, next) => {
    const allowed = [
        '_id',
        'fullName',
        'age',
        'email',
        'gender',
        'password',
        'phone',
        'image',
        'address',
        'national_id',
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
            { _id: request.body._id },
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
            if (data.deletedCount == 0) {
                next(new Error('userID not found'))
            } else {
                response.status(200).json({ data: 'deleted' })
            }
        })
        .catch((error) => next(error))
}

module.exports.deleteManyUser = (request, response, next) => {
    const { ids } = request.body
    User.deleteMany({ _id: { $in: ids } })
        .then((data) => {
            if (data.deletedCount == 0) {
                next(new Error('userID not found'))
            } else {
                response.status(200).json({ data: 'deleted' })
            }
        })
        .catch(
            console.error((error) => {
                next(error)
            })
        )
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

    const newUserImage = request.file ? request.file.path : ''
    User.findOneAndUpdate({ _id: request.params.id }, { image: newUserImage })

        .then((data) => {
            // unlinkAsync(data.image);
            if (data == null) next(new Error("User Doesn't Exist"))
            response.status(201).json('User Image has been updated')
        })
        .catch((error) => next(error))
}
