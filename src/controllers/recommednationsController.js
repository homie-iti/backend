
const mongoose = require("mongoose");
require("../models/cityModel");
let City = mongoose.model("cities")




// module.exports.getCities = ((request, response, next) => {
//     City.find({
//         $or: [{ cityName: "Cairo" },
//         { cityName: "Alexandria" },
//         { cityName: "Sharqia" },
//         { cityName: "Mansoura" },
//         { cityName: "Tanta" },
//         { cityName: "5th Settelment" },
//         ]
//     }).select({ cityName: 1, _id: 1 })
//         .then(data => {
//             if (data == null) { next(new Error("City is not defined")) }
//             else {
//                 response.status(200).json(data)
//             }
//         })
//         .catch(error => {
//             next(error);
//         })

// });




module.exports.getCities = ((request, response, next) => {
    let Number = request.query.citiesNumber
    City.find({}).limit(Number).select({ cityName: 1, _id: 1 })
        .then(data => {
            if (data == null) { next(new Error("City is not defined")) }
            else {
                response.status(200).json(data)
            }
        })
        .catch(error => {
            next(error);
        })

});