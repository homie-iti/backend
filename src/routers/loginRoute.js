const express = require('express')
const controller = require('../controllers/loginController')
const route = express.Router()

route.post('/login/admin', controller.loginAdmin)
route.post('/login', controller.loginUser)

module.exports = route
