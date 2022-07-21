const jwt = require("jsonwebtoken");

module.exports = (request, response, next) => {
  let decodedToekn = null;
  try {
    let token = request.get("Authorization").split(" ")[1];
    decodedToekn = jwt.verify(token, process.env.secret);
    console.log(decodedToekn);
    request.role = decodedToekn.role;
    request.id = decodedToekn.id;
    next();
  } catch (error) {
    error.message = "Not Authorized";
    error.status = 403;
    next(error);
  }
};

export const adminAndOwner = (request, response, next) => {
  if (request.role === "admin") next();
  else if (request.id === request.params.id) next();
  else {
    const error = new Error("Not authorized");
    error.status = 403;
    next(error);
  }
};

export const adminOnly = (request, response, next) => {
  if (request.role === "admin") next();
  else {
    const error = new Error("Not authorized");
    error.status = 403;
    next(error);
  }
};
