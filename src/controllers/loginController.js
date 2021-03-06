const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Admin = require('../models/adminModel')
const User = require('../models/userModel')

module.exports.loginUser = (request, response, next) => {
    User.findOne({
        email: request.body.email,
        // password: request.body.password,
    })

        .then((data) => {
            console.log(data)
            if (!data) {
                const error = new Error('email or password incorrect')
                error.status = 401
                throw error
            } else {
                bcrypt
                    .compare(request.body.password, data.password)
                    .then((result) => {
                        const token = jwt.sign(
                            {
                                id: data._id,
                                role: 'User',
                            },
                            process.env.secret,
                            { expiresIn: '1h' }
                        )
                        response
                            .status(200)
                            .json({ token, message: 'login' })
                    })
            }
        })
        .catch((error) => next(error))
}

module.exports.loginAdmin = (request, response, next) => {
    Admin.findOne({
        email: request.body.email,
        // password: request.body.password,
    })
        .then((data) => {
            console.log(data)
            if (!data) {
                const error = new Error('email or password incorrect')
                error.status = 401
                throw error
            } else {
                bcrypt
                    .compare(request.body.password, data.password)
                    .then((result) => {
                        const token = jwt.sign(
                            {
                                id: data._id,
                                role: 'Admin',
                            },
                            process.env.secret,
                            { expiresIn: '1h' }
                        )
                        response
                            .status(200)
                            .json({ token, message: 'login' })
                    })
            }
        })
        .catch((error) => next(error))
}
