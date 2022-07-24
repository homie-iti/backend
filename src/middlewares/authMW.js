const jwt = require('jsonwebtoken')

const adminOnly = (request, response, next) => {
    let decodedToken = null
    try {
        const token = request.get('Authorization').split(' ')[1]
        decodedToken = jwt.verify(token, process.env.secret)
        console.log(decodedToken)
        if (request.role = 'admin')
        next()
    } catch (error) {
        error.message = 'Not Authorized'
        error.status = 403
        next(error)
    }
}


const adminAndUser = (request, response, next) => {
    let decodedToken = null
    try {
        const token = request.get('Authorization').split(' ')[1]
        decodedToken = jwt.verify(token, process.env.secret)
        console.log(decodedToken)
        if (request.role = 'admin') next()
        else if(request.role = 'user') next()
    } catch (error) {
        error.message = 'Not Authorized'
        error.status = 403
        next(error)
    }
}











// const adminOnly = (request, response, next) => {
//     if (request.role === 'admin') next()
//          else {
//             console.log(request.role)
//             const error = new Error('No')
//         error.status = 403
//         next(error)
//     }
// }









// const adminAndOwner = (request, response, next) => {
//     if (request.role === 'admin') next()
//     else if (request.role === 'user') next()
//     else {
//         const error = new Error('Not authorized')
//         error.status = 403
//         next(error)
//     }
// }

module.exports = { adminAndUser, adminOnly }
