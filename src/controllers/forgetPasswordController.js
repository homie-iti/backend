const jwt = require('jsonwebtoken')

const User = require('../models/userModel')
const Admin = require('../models/adminModel')

module.exports.forgetPassword = (request, response, next) => {
    User.findOne({
        email: request.body.email,
    })
        .then((user) => {
            if (user == null) {
                //! in some websites they send message says that they will send email to you if you are registered in both cases.(this prevent hackers from knowing which emails have account)
                const error = new Error('No User With entered email')
                error.status = 401
                throw error
            }
            const token = jwt.sign({ email: user.email }, 'forgetPassword', {
                expiresIn: '20m',
            })
            user.updateOne({ resetLink: token }).then((updatedUser) => {
                if (updatedUser.modifiedCount === 0)
                    next(
                        new Error(
                            'Error occurred in setting resetLink property'
                        )
                    )
                response.status(200).json(updatedUser)
                // TODO Sending email with link containing generated token
            })
        })
        .catch((error) => {
            next(error)
        })
}

module.exports.resetPassword = (request, response, next) => {
    const { resetLink, newPassword } = request.body
    if (resetLink) {
        jwt.verify(resetLink, 'forgetPassword', (error, decodedToken) => {
            if (error) {
                return response
                    .status(401)
                    .json({ error: 'Incorrect or expired link' })
            }
            User.findOneAndUpdate(
                { resetLink },
                { password: newPassword, restLink: '' }
            ).then((user) => {
                if (user == null) next(new Error("User doesn't found"))
                response.status(201).json('Your password has been changed')
                // TODO Send email says that the password has been changed successfully
            })
        })
    } else {
        response.status(401).json({ error: 'Not Authorized' })
    }
}
