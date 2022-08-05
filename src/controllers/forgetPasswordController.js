const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

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

            console.log(user)
            user.updateOne({ resetLink: user._id }).then((updatedUser) => {
                // console.log(updatedUser, user)
                console.log(user.resetLink)
                if (updatedUser.modifiedCount === 0)
                    next(
                        new Error(
                            'Error occurred in setting resetLink property'
                        )
                    )
                console.log(user)
                notifyUser('reset_password', user)
                response.status(200).json({
                    data: 'Email with reset password link has been sent successfully.',
                })
            })
        })
        .catch((error) => {
            next(error)
        })
}

module.exports.resetPassword = (request, response, next) => {
    const { resetLink, newPassword } = request.body
    // if (resetLink) {
    //     jwt.verify(resetLink, 'forgetPassword', (error) => {
    //         console.log(decodedToken)
    //         if (error) {
    //             return response
    //                 .status(401)
    //                 .json({ error: 'Incorrect or expired link' })
    //         }
    if (!isValidObjectId(resetLink)) throw new Error('Not Valid reset Link ')
    User.findOne({ _id: resetLink, resetLink }).then((user) => {
        console.log(user)
        if (user == null) next(new Error("Expired link or user doesn't found "))
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
    //     })
    // } else {
    //     response.status(401).json({ error: 'Not Authorized' })
    // }
}
