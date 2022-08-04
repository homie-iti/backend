const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const mongoose = require('mongoose')
// require('dotenv').config()

const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('../swagger.json')

const appConfig = require('./config/app.config')
const dbConfig = require('./config/database.config')

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
const forgetPasswordRoute = require('./routers/forgetPasswordRoute')
const signupRoute = require('./routers/signupRoute')
const filterandsort = require('./routers/filtringandsortingRoute')
const paymentRoute = require('./routers/paymentRoute')

// require('./models/addressModel')
// require('./models/adminModel')
// require('./models/agentModel')
// require('./models/cityModel')
// require('./models/contractModel')
// require('./models/helpQuestionModel')
// require('./models/landlordModel')
// require('./models/reviewModel')
// require('./models/unitModel')
// require('./models/userModel')

const app = express()
const { port } = appConfig

let dbURL
if (appConfig.environment === 'prod' || appConfig.environment === 'testProd')
    dbURL = `mongodb+srv://${dbConfig.username}:${dbConfig.password}@${dbConfig.host}/${dbConfig.name}?retryWrites=true&w=majority`
else dbURL = `mongodb://${dbConfig.host}:${dbConfig.port}/${dbConfig.name}`

console.log(`NODE_ENV: ${appConfig.environment}`)
// console.log(dbURL)

app.use('/homie-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
mongoose
    .connect(dbURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        app.listen(port, () => {
            console.log('App listens on port', port)
        })
    })
    .catch((error) => {
        console.log('DB Connection Error', error)
    })

if (!appConfig.environment.includes('test'))
    app.use(morgan(':method :url :status - :response-time ms'))

app.use(cors())
app.use(apiLimiter)

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Done CI/CD')
})

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
app.use(forgetPasswordRoute)
app.use(filterandsort)
app.use(paymentRoute)

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

module.exports = app
