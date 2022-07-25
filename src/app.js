const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const mongoose = require('mongoose')
require('dotenv').config()

const { apiLimiter } = require('./middlewares/rateLimitMW')

const unitRoute = require('./routers/unitRoute')
const userRoute = require('./routers/userRoute')
const cityRoute = require('./routers/cityRoute')
const recommendationsRoute = require('./routers/recommendationsRoute')
const agentRoute = require('./routers/agentRoute')
const searchRoute = require('./routers/searchRoute')
const contractRoute = require('./routers/contractRoute')
const helpRoute = require('./routers/helpQuestionRoute')
const landlordRoute = require('./routers/landlordRoute')
const adminRoute = require('./routers/adminRoute')
const loginRoute = require('./routers/loginRoute')
const signupRoute = require('./routers/signupRoute')

require('./models/addressModel')
require('./models/adminModel')
require('./models/agentModel')
require('./models/cityModel')
require('./models/contractModel')
require('./models/helpQuestionModel')
require('./models/landlordModel')
require('./models/reviewModel')
require('./models/unitModel')
require('./models/userModel')

const app = express()
const port = process.env.PORT || 8080

const homieDB_URL = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
mongoose
    .connect(homieDB_URL)
    .then(() => {
        app.listen(port, () => {
            console.log('App listens on port', port)
        })
    })
    .catch((error) => {
        console.log('DB Connection Error', error)
    })

app.use(cors())
app.use(morgan(':method :url :status - :response-time ms'))
app.use(apiLimiter)

app.use(express.json())

app.use(loginRoute)
app.use(signupRoute)
app.use(adminRoute)
app.use(searchRoute)
app.use(agentRoute)
app.use(unitRoute)
app.use(userRoute)
app.use(cityRoute)
app.use(recommendationsRoute)
app.use(contractRoute)
app.use(landlordRoute)
app.use(helpRoute)

// not-found middleware
app.use((request, response, next) => {
    // throw new Error("very big error"); //throwing an error causes the error handling middleware to work
    response.status(404).json({ message: 'Endpoint not found.' })
})

// handling errors middleware
app.use((error, request, response, next) => {
    response
        .status(error.status || 500)
        .json({ message: 'Internal Error', details: error.message })
})
