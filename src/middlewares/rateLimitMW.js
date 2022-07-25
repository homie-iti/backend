const rateLimit = require('express-rate-limit')

function limitingHandler(errMessage) {
    // const errMessage =
    // 'Too many accounts creation trials from this IP, please try again after an hour.'
    return (request, response, next, options) => {
        // const errMessage =
        //     'Too many accounts creation trials from this IP, please try again after an hour.'
        const error = new Error(errMessage)
        error.status = options.statusCode

        next(error)
        // response.status(options.statusCode).send(options.message)
    }
}

module.exports.apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes * 60 seconds * 1000 milliseconds
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    handler: limitingHandler(
        'Too many requests from this IP, please try again after an 15 minutes.'
    ),
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

module.exports.accountCreationLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour = 60 minutes * 60 seconds * 1000 milliseconds
    max: 5, // Limit each IP to 5 create account requests per `window` (here, per hour)
    handler: limitingHandler(
        'Too many accounts creation trials from this IP, please try again after an hour.'
    ),
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})
