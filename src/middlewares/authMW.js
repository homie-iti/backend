const jwt = require("jsonwebtoken");

const authMW = (request, response, next) => {
  let decodedToken = null;
  try {
    let token = request.get("Authorization").split(" ")[1];
    decodedToken = jwt.verify(token, process.env.secret);
    console.log(decodedToken);
    request.role = decodedToken.role;
    request.id = decodedToken.id;
    next();
  } catch (error) {
    error.message = "Not Authorized";
    error.status = 403;
    next(error);
  }
};



const adminOnly = (request, response, next) => {
    if (request.role === 'Admin') next()
         else {
            console.log(request.role)
            const error = new Error('Not authorized')
        error.status = 403
        next(error)
    }
}





const adminAndUser = (request, response, next) => {
    if (request.role === 'Admin') next()
    else if (request.role === 'User') next()
    else {
        const error = new Error('Not authorized')
        error.status = 403
        next(error)
    }
}

module.exports = { authMW,adminAndUser, adminOnly }
