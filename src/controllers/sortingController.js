let Unit = require("./../models/unitModel");

module.exports.sortUnit = (request, response, next) => {
  let sortType = request.query.sorting;

  if (sortType == "mostRecent") {
    Unit.find({})
      .sort({ createdAt: -1 })
      .then((data) => {
        if (data == null) {
          next(new Error("unit mostRecent is not defined"));
        } else {
          response.status(200).json(data);
        }
      })
      .catch((error) => {
        next(error);
      });
  } else if (sortType == "lowToHigh") {
    Unit.find({})
      .sort({ dailyPrice: "asc" })
      .then((data) => {
        if (data == null) {
          next(new Error("unit priceLowToHigh is not defined"));
        } else {
          response.status(200).json(data);
        }
      })
      .catch((error) => {
        next(error);
      });
  } else if (sortType == "highToLow") {
    Unit.find({})
      .sort({ dailyPrice: -1 })
      .then((data) => {
        if (data == null) {
          next(new Error("unit priceHighToLow is not defined"));
        } else {
          response.status(200).json(data);
        }
      })
      .catch((error) => {
        next(error);
      });
  }
};

// module.exports.sortUnitByDate = ((request, response, next) => {
//     Unit.find({}).sort({ createdAt: -1 })
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

// module.exports.sortFromlowToHigh = ((request, response, next) => {
//     Unit.find({}).sort({ price: 'asc' })
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

// module.exports.sortFromHighToLow = ((request, response, next) => {
//     Unit.find({}).sort({ price: -1 })
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
