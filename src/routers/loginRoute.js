const express = require('express')
const controller = require('../controllers/loginController')

const route = express.Router()

route.post('/login', controller.loginUser)
route.post('/login/admin', controller.loginAdmin)

module.exports = route
