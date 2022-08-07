const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Admin = require('../models/adminModel')
const User = require('../models/userModel')

const appConfig = require('../config/app.config')
const dbConfig = require('../config/database.config')

// function loginError() {
//     const error = new Error('email or password incorrect')
//     error.status = 401
//     return error
// }

module.exports.loginUser = (request, response, next) => {
    console.log(request.body.email, '-', 'request.body.password')

    User.findOne({
        email: request.body.email,
        // password: request.body.password,
    })
        .then((data) => {
            // console.log(data)
            if (!data) {
                const error = new Error('email or password incorrect')
                error.status = 401
                throw error
                // loginError()
            }
            bcrypt
                .compare(request.body.password, data.password)
                .then((result) => {
                    if (!result) {
                        const error = new Error('email or password incorrect')
                        error.status = 401
                        throw error
                    }

                    const token = jwt.sign(
                        {
                            id: data._id,
                            role: 'aser',
                        },
                        appConfig.jwtSecret,
                        // process.env.secret,
                        { expiresIn: '24h' }
                    )
                    response.status(200).json({ token, message: 'login' })
                })
                .catch((error) => next(error))
        })
        .catch((error) => next(error))
}

module.exports.loginAdmin = (request, response, next) => {
    console.log(request.body.email, '-', 'request.body.password')

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
            }
            bcrypt
                .compare(request.body.password, data.password)
                .then((result) => {
                    if (!result) {
                        const error = new Error('email or password incorrect')
                        error.status = 401
                        throw error
                    }

                    const token = jwt.sign(
                        {
                            id: data._id,
                            role: 'admin',
                        },
                        appConfig.jwtSecret,
                        { expiresIn: '24h' }
                    )
                    response.status(200).json({ token, message: 'login' })
                })
                .catch((error) => next(error))
        })
        .catch((error) => next(error))
}
