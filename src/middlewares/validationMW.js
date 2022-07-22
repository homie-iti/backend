const { validationResult } = require('express-validator')

module.exports = (request, response, next) => {
    const result = validationResult(request)
    if (!result.isEmpty()) {
        const message = `${result.errors
            .reduce((current, error) => ` ${current}${error.msg} / `, '')
            .slice(0, -2)
            .trim()}.`
        const error = new Error(message)
        error.status = 422
        throw error
    } else next()
}
