const bcrypt = require('bcrypt')

const saltRounds = 10
const myPlaintextPassword = 's0//P4$$w0rD'
// const someOtherPlaintextPassword = 'not_bacon'

const User = require('../models/userModel')

const EmailClient = require('../utilities/sendEmail')

const emailNotifier = new EmailClient()
function notifyUser(event, userInfo) {
    // console.log(userInfo)
    const configs = {
        slug: userInfo._id,
        name: userInfo.fullName,
        email: userInfo.email,
    }
    return emailNotifier
        .sendMessage(event, configs)
        .then((msgState) => ({ ...userInfo._doc, isEmailSent: msgState }))
}

module.exports.checkAvailability = (request, response, next) => {
    // ;(async function validateFilter() {
    let filterObj = {}
    if (request.body.nationalId)
        filterObj = { national_id: request.body.nationalId }
    else if (request.body.email) filterObj = { email: request.body.email }
    else if (request.body.phone) filterObj = { phone: request.body.phone }

    // console.log(filterObj)
    // return filterObj
    // })()
    // .then((filterObj) => User.exists(filterObj))
    User.exists(filterObj)
        .then((data) => {
            response.status(200).json({ isAvailable: !data })
        })
        .catch((error) => {
            next(error)
        })
}

module.exports.signup = (request, response, next) => {
    // const hashedPassword

    const user = {
        fullName: `${request.body.firstName} ${request.body.middleName} ${request.body.lastName}`,
        age: request.body.age,
        gender: request.body.gender,
        email: request.body.email,
        phone: request.body.phone,
        national_id: request.body.nationalId,
        // balance: request.body.balance,
    }

    User.exists({
        $or: [
            { email: user.email },
            { phone: user.phone },
            { national_id: user.national_id },
        ],
    })
        .then((data) => {
            console.log(data)
            if (data)
                throw new Error('email or phone or nationalId is duplicated')

            return bcrypt.hash(request.body.password, saltRounds)
        })

        .then((hash) => {
            user.password = hash
        })
        .then(() => {
            const object = new User(user)
            return object.save()
        })
        .then((userInfo) => notifyUser('user_signup', userInfo))
        .then((userInfo) => {
            response.status(201).json({ userInfo })
            // return { name: data.fullName, email: data.email }
        })
        .catch((error) => next(error))
}

module.exports.activateAccount = (request, response, next) => {
    // console.log(request.params.slug)
    // TODO use random key not the if
    User.findOneAndUpdate(
        { _id: request.params.slug },
        { isAccountActivated: true }
    )
        .then((userInfo) => {
            console.log(userInfo)
            if (userInfo.isAccountActivated)
                throw new Error('account is already activated ya man!')
            // TODO fix matching cases
            // if (data.matchedCount < 1) throw new Error('slug  not found')
            // if (data.modifiedCount < 1)
            //     throw new Error("account activation state couldn't be modified")
            return userInfo
        })
        .then((userInfo) => notifyUser('account_activated', userInfo))
        .then(() => {
            response.redirect(
                'https://homie-iti.vercel.com/login?status=activated'
            )
        })
        .catch((error) => next(error))
}
