const rateLimit = require('express-rate-limit')

function generateHandler(errMessage) {
    return (request, response, next, options) => {
        const error = new Error(errMessage)
        error.status = options.statusCode
        next(error)
    }
}

module.exports.apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes * 60 seconds * 1000 milliseconds
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    handler: generateHandler(
        'Too many requests from this IP, please try again after an 15 minutes.'
    ),
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

module.exports.accountCreationLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour = 60 minutes * 60 seconds * 1000 milliseconds
    max: 5, // Limit each IP to 5 create account requests per `window` (here, per hour)
    handler: generateHandler(
        'Too many accounts creation trials from this IP, please try again after an hour.'
    ),
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})
