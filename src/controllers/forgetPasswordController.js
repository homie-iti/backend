const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const { toObjectId } = require('../utilities/convertString')

const saltRounds = 10
const { isValidObjectId } = require('mongoose')
const User = require('../models/userModel')
const EmailClient = require('../utilities/sendEmail')

const emailNotifier = new EmailClient()
function notifyUser(event, user) {
    console.log(user)
    const configs = {
        email: user.email,
        name: user.fullName,
        resetLink: user.resetLink,
    }
    return emailNotifier.sendMessage(event, configs).then((msgState) => {
        console.log(msgState)
        return {
            ...user._doc,
            isEmailSent: msgState,
        }
    })
}
module.exports.forgetPassword = (request, response, next) => {
    let userData

    User.findOne({
        email: request.body.email,
    })
        .then((user) => {
            if (user == null) {
                const error = new Error('No User With entered email')
                error.status = 401
                throw error
            }
            // const token = jwt.sign({ email: user.email }, 'forgetPassword', {
            //     expiresIn: '20m',
            // })

            userData = user
            userData.resetLink = user._id
            // console.log(user)
            // console.log(user.resetLink)
            return user.updateOne({}, { resetLink: user._id })
        })
        .then((updatedUser) => {
            // console.log(updatedUser, user)
            if (updatedUser.modifiedCount === 0)
                throw new Error('Error occurred in setting resetLink property')

            // console.log(user)
            notifyUser('reset_password', userData)
            response.status(200).json({
                data: 'Email with reset password link has been sent successfully.',
            })
        })
        .catch((error) => {
            next(error)
        })
}

module.exports.resetPassword = (request, response, next) => {
    const { resetLink, newPassword } = request.body
    console.log({ resetLink, newPassword })
    // if (resetLink) {
    //     jwt.verify(resetLink, 'forgetPassword', (error) => {
    //         console.log(decodedToken)
    //         if (error) {
    //             return response
    //                 .status(401)
    //                 .json({ error: 'Incorrect or expired link' })
    //         }
    if (!isValidObjectId(resetLink)) throw new Error('Not Valid reset Link ')
    User.findOne({
        // _id: toObjectId(resetLink),
        resetLink,
    })
        .then((user) => {
            console.log(user)
            if (user == null)
                throw new Error("Expired link or user doesn't found ")
            else {
                const hashedPassword = bcrypt.hashSync(newPassword, saltRounds)
                user.password = hashedPassword
                user.resetLink = ''
                console.log(user.password)
                user.save()
                notifyUser('password_changed', user)
                response.status(200).json('Your password has been changed')
            }
        })
        .catch((error) => {
            next(error)
        })
    //     })
    // } else {
    //     response.status(401).json({ error: 'Not Authorized' })
    // }
}
