const Cities = require('../models/cityModel')


// If city name starts with
module.exports.getCityByName = (request, response, next) => {
  let searchWord=request.query.cityname
  const regex = new RegExp(`^${searchWord}`)
  Cities.find({ name: { $regex :regex, $options: "i" }}, { _id: 1, name: 1 })
    .then((data) => {
      console.log(data)
      if (data == null) next(new Error(" city not found"))
      response.status(200).json(data)
    })
    .catch((error) => {
      next(error)
    })
}


// If city name starts with

// module.exports.getCityByName = (request, response, next) => {
//   Cities.find({ name: { $regex :request.query.cityname, $options: "i" }}, { _id: 1, name: 1 })
//     .then((data) => {
//       console.log(data);
//       if (data == null) next(new Error(" city not found"));
//       response.status(200).json(data);
//     })
//     .catch((error) => {
//       next(error);
//     });
// };
