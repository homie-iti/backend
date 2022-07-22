const Cities = require('../models/cityModel')

module.exports.getCityByName = (request, response, next) => {
    Cities.find({ name: request.params.name }, { _id: 1, name: 1 })
        .then((data) => {
            console.log(data)
            if (data == null) next(new Error(' city not found'))
            response.status(200).json(data)
        })
        .catch((error) => {
            next(error)
        })
}
