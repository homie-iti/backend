const mongoose = require("mongoose");
require("../models/unitModel");
let Unit = mongoose.model("units");

module.exports.filteredUnit = (request, response, next) => {
  filterQuery = request.query;

  let genderFilter = request.query.gender;
  let estateFilter = request.query.estateType;
  let petAllowedFilter = request.query.petAllowed;
  let minuPrice = request.query.minPrice;
  let maxiPrice = request.query.maxPrice;

  // *******************Look for a better Solution 
  // Route scenario 
  // Homie?gender=male&estateType=studio&maxPrice=800&minPrice=200&petAllowed=true


  // Homie?gender=male&estateType=studio&maxPrice=800&minPrice=200
  // Homie?gender=male&estateType=studio&maxPrice=800&petAllowed=true
  // Homie?gender=male&estateType=studio&minPrice=200&petAllowed=true
  // Homie?gender=male&maxPrice=800&minPrice=200&petAllowed=true
  // Homie?estateType=studio&maxPrice=800&minPrice=200&petAllowed=true


  // Homie?gender=male&estateType=studio&maxPrice=800
  // Homie?gender=male&estateType=studio&minPrice=200
  // Homie?gender=male&estateType=studio&petAllowed=true
  // Homie?gender=male&maxPrice=800&minPrice=200
  // Homie?gender=male&maxPrice=800&petAllowed=true
  // Homie?gender=male&minPrice=300&petAllowed=true
  // Homie?estateType=studio&maxPrice=800&petAllowed=true
  // Homie?estateType=studio&minPrice=200&petAllowed=true
  // Homie?estateType=studio&maxPrice=800&minPrice=200
  // Homie?maxPrice=800&minPrice=200&petAllowed=true

  // Homie?maxPrice=800&petAllowed=true
  // Homie?maxPrice=800&minPrice=200
  // Homie?minPrice=200&petAllowed=true
  // Homie?gender=male&minPrice=200
  // Homie?gender=male&petAllowed=true
  // Homie?gender=male&estateType=studio
  // Homie?maxPrice=500&estateType=studio



  // Homie?maxPrice=800
  // Homie?&minPrice=200
  // Homie?petAllowed=true
  // Homie?gender=male
  // Homie?estateType=studio












  // ******TOO MANY CONDITIONS LOOK FOR BETTER SOLUTION

  if (genderFilter && estateFilter && petAllowedFilter && maxiPrice && minuPrice) {
    Unit.find({ $and: [{ allowedGender: genderFilter }, { estateType: estateFilter }, { isPetsAllowed: petAllowedFilter }, { $or: [{ dailyPrice: { $lte: maxiPrice } }, { dailyPrice: { $gt: minuPrice } }] }] })
      .then(data => {
        if (data == null) { next(new Error("gender is not defined")) }
        else {
          response.status(200).json(data)
        }
      })
      .catch(error => {
        next(error);
      })
  }


  if (genderFilter && estateFilter && petAllowedFilter && maxiPrice && !minuPrice) {
    Unit.find({ $and: [{ allowedGender: genderFilter }, { estateType: estateFilter }, { isPetsAllowed: petAllowedFilter }, { dailyPrice: { $lte: maxiPrice } }] })
      .then(data => {
        if (data == null) { next(new Error("gender is not defined")) }
        else {
          return response.status(200).json(data)
        }
      })
      .catch(error => {
        next(error);
      })
  }

  if (genderFilter && estateFilter && petAllowedFilter && minuPrice && !maxiPrice) {
    Unit.find({ $and: [{ allowedGender: genderFilter }, { estateType: estateFilter }, { isPetsAllowed: petAllowedFilter }, { dailyPrice: { $gte: minuPrice } }] })
      .then(data => {
        if (data == null) { next(new Error("gender is not defined")) }
        else {
          return response.status(200).json(data)
        }
      })
      .catch(error => {
        next(error);
      })
  }


  if (maxiPrice && estateFilter && petAllowedFilter && minuPrice && !genderFilter) {
    Unit.find({ $and: [{ dailyPrice: { $lte: maxiPrice } }, { estateType: estateFilter }, { isPetsAllowed: petAllowedFilter }, { dailyPrice: { $gte: minuPrice } }] })
      .then(data => {
        if (data == null) { next(new Error("gender is not defined")) }
        else {
          return response.status(200).json(data)
        }
      })
      .catch(error => {
        next(error);
      })
  }


  if (maxiPrice && genderFilter && petAllowedFilter && minuPrice && !estateFilter) {
    Unit.find({ $and: [{ dailyPrice: { $lte: maxiPrice } }, { allowedGender: genderFilter }, { isPetsAllowed: petAllowedFilter }, { dailyPrice: { $gte: minuPrice } }] })
      .then(data => {
        if (data == null) { next(new Error("gender is not defined")) }
        else {
          return response.status(200).json(data)
        }
      })
      .catch(error => {
        next(error);
      })
  }


  if (maxiPrice && genderFilter && estateFilter && minuPrice && !petAllowedFilter) {
    Unit.find({ $or: [{ dailyPrice: { $lte: maxiPrice } }, { allowedGender: genderFilter }, { estateType: estateFilter }, { dailyPrice: { $gte: minuPrice } }] })
      .then(data => {
        if (data == null) { next(new Error("gender is not defined")) }
        else {
          return response.status(200).json(data)
        }
      })
      .catch(error => {
        next(error);
      })
  }



  if (genderFilter && estateFilter && petAllowedFilter && !maxiPrice && !minuPrice) {
    Unit.find({ $and: [{ allowedGender: genderFilter }, { estateType: estateFilter }, { isPetsAllowed: petAllowedFilter }] })
      .then(data => {
        if (data == null) { next(new Error("gender is not defined")) }
        else {
          return response.status(200).json(data)
        }
      })
      .catch(error => {
        next(error);
      })
  }


  if (genderFilter && estateFilter && minuPrice && !petAllowedFilter && !maxiPrice) {
    Unit.find({ $and: [{ allowedGender: genderFilter }, { estateType: estateFilter }, { dailyPrice: { $gte: minuPrice } }] })
      .then(data => {
        if (data == null) { next(new Error("gender is not defined")) }
        else {
          return response.status(200).json(data)
        }
      })
      .catch(error => {
        next(error);
      })
  }



  if (genderFilter && estateFilter && maxiPrice && !minuPrice && !petAllowedFilter) {
    Unit.find({ $and: [{ allowedGender: genderFilter }, { estateType: estateFilter }, { dailyPrice: { $lte: maxiPrice } }] })
      .then(data => {
        if (data == null) { next(new Error("gender is not defined")) }
        else {
          return response.status(200).json(data)
        }
      })
      .catch(error => {
        next(error);
      })
  }


  if (genderFilter && petAllowedFilter && maxiPrice && !minuPrice && !estateFilter) {
    Unit.find({ $and: [{ allowedGender: genderFilter }, { isPetsAllowed: petAllowedFilter }, { dailyPrice: { $lte: maxiPrice } }] })
      .then(data => {
        if (data == null) { next(new Error("gender is not defined")) }
        else {
          return response.status(200).json(data)
        }
      })
      .catch(error => {
        next(error);
      })
  }



  if (genderFilter && petAllowedFilter && minuPrice && !maxiPrice && !estateFilter) {
    Unit.find({ $and: [{ allowedGender: genderFilter }, { isPetsAllowed: petAllowedFilter }, { dailyPrice: { $gte: minuPrice } }] })
      .then(data => {
        if (data == null) { next(new Error("gender is not defined")) }
        else {
          return response.status(200).json(data)
        }
      })
      .catch(error => {
        next(error);
      })
  }


  if (genderFilter && minuPrice && maxiPrice && !estateFilter && !petAllowedFilter) {
    Unit.find({ $and: [{ allowedGender: genderFilter }, { dailyPrice: { $gte: minuPrice } }, { dailyPrice: { $lte: maxiPrice } }] })
      .then(data => {
        if (data == null) { next(new Error("gender is not defined")) }
        else {
          return response.status(200).json(data)
        }
      })
      .catch(error => {
        next(error);
      })
  }


  if (estateFilter && minuPrice && maxiPrice && !genderFilter && !petAllowedFilter) {
    Unit.find({ $and: [{ estateType: estateFilter }, { dailyPrice: { $gte: minuPrice } }, { dailyPrice: { $lte: maxiPrice } }] })
      .then(data => {
        if (data == null) { next(new Error("gender is not defined")) }
        else {
          return response.status(200).json(data)
        }
      })
      .catch(error => {
        next(error);
      })
  }


  if (estateFilter && petAllowedFilter && maxiPrice && !minuPrice && !genderFilter) {
    Unit.find({ $and: [{ estateType: estateFilter }, { isPetsAllowed: petAllowedFilter }, { dailyPrice: { $lte: maxiPrice } }] })
      .then(data => {
        if (data == null) { next(new Error("gender is not defined")) }
        else {
          return response.status(200).json(data)
        }
      })
      .catch(error => {
        next(error);
      })
  }

  if (estateFilter && petAllowedFilter && minuPrice && !maxiPrice && !genderFilter) {
    Unit.find({ $and: [{ estateType: estateFilter }, { isPetsAllowed: petAllowedFilter }, { dailyPrice: { $gte: minuPrice } }] })
      .then(data => {
        if (data == null) { next(new Error("gender is not defined")) }
        else {
          return response.status(200).json(data)
        }
      })
      .catch(error => {
        next(error);
      })
  }



  if (maxiPrice && petAllowedFilter && minuPrice && !genderFilter && !estateFilter) {
    Unit.find({ $and: [{ dailyPrice: { $lte: maxiPrice } }, { isPetsAllowed: petAllowedFilter }, { dailyPrice: { $gte: minuPrice } }] })
      .then(data => {
        if (data == null) { next(new Error("gender is not defined")) }
        else {
          return response.status(200).json(data)
        }
      })
      .catch(error => {
        next(error);
      })
  }


  if (genderFilter && estateFilter && !maxiPrice && !minuPrice && !petAllowedFilter) {
    Unit.find({ $and: [{ allowedGender: genderFilter }, { estateType: estateFilter }] })
      .then(data => {
        if (data == null) { next(new Error("gender is not defined")) }
        else {
          return response.status(200).json(data)
        }
      })
      .catch(error => {
        next(error);
      })
  }




  if (genderFilter && petAllowedFilter && !maxiPrice && !minuPrice && !estateFilter) {
    Unit.find({ $and: [{ allowedGender: genderFilter }, { isPetsAllowed: petAllowedFilter }] })
      .then(data => {
        if (data == null) { next(new Error("gender is not defined")) }
        else {
          return response.status(200).json(data)
        }
      })
      .catch(error => {
        next(error);
      })
  }


  if (genderFilter && minuPrice && !maxiPrice && !petAllowedFilter && !estateFilter) {
    Unit.find({ $and: [{ allowedGender: genderFilter }, { dailyPrice: { $gte: minuPrice } }] })
      .then(data => {
        if (data == null) { next(new Error("gender is not defined")) }
        else {
          return response.status(200).json(data)
        }
      })
      .catch(error => {
        next(error);
      })
  }


  if (maxiPrice && genderFilter && !minuPrice && !estateFilter && !petAllowedFilter) {
    Unit.find({ $and: [{ dailyPrice: { $lte: maxiPrice } }, { allowedGender: genderFilter }] })
      .then(data => {
        if (data == null) { next(new Error("gender is not defined")) }
        else {
          return response.status(200).json(data)
        }
      })
      .catch(error => {
        next(error);
      })
  }


  if (estateFilter && petAllowedFilter && !genderFilter && !minuPrice && !maxiPrice) {
    Unit.find({ $and: [{ estateType: estateFilter }, { isPetsAllowed: petAllowedFilter }] })
      .then(data => {
        if (data == null) { next(new Error("gender is not defined")) }
        else {
          return response.status(200).json(data)
        }
      })
      .catch(error => {
        next(error);
      })
  }


  if (estateFilter && minuPrice && !maxiPrice && !genderFilter && !petAllowedFilter) {
    Unit.find({ $and: [{ estateType: estateFilter }, { dailyPrice: { $gte: minuPrice } }] })
      .then(data => {
        if (data == null) { next(new Error("gender is not defined")) }
        else {
          return response.status(200).json(data)
        }
      })
      .catch(error => {
        next(error);
      })
  }


  if (estateFilter && maxiPrice && !minuPrice && !genderFilter && !petAllowedFilter) {
    Unit.find({ $and: [{ dailyPrice: { $lte: maxiPrice } }, { estateType: estateFilter }] })
      .then(data => {
        if (data == null) { next(new Error("gender is not defined")) }
        else {
          return response.status(200).json(data)
        }
      })
      .catch(error => {
        next(error);
      })
  }

  if (petAllowedFilter && maxiPrice && !minuPrice && !genderFilter && !estateFilter) {
    Unit.find({ $and: [{ dailyPrice: { $lte: maxiPrice } }, { isPetsAllowed: petAllowedFilter }] })
      .then(data => {
        if (data == null) { next(new Error("gender is not defined")) }
        else {
          return response.status(200).json(data)
        }
      })
      .catch(error => {
        next(error);
      })
  }


  if (petAllowedFilter && minuPrice && !maxiPrice && !estateFilter && !genderFilter) {
    Unit.find({ $and: [{ dailyPrice: { $gte: minuPrice } }, { isPetsAllowed: petAllowedFilter }] })
      .then(data => {
        if (data == null) { next(new Error("gender is not defined")) }
        else {
          return response.status(200).json(data)
        }
      })
      .catch(error => {
        next(error);
      })
  }

  if (maxiPrice && minuPrice && !genderFilter && !estateFilter && !petAllowedFilter) {
    Unit.find({ $and: [{ dailyPrice: { $gte: minuPrice } }, { dailyPrice: { $lte: maxiPrice } }] })
      .then(data => {
        if (data == null) { next(new Error("gender is not defined")) }
        else {
          return response.status(200).json(data)
        }
      })
      .catch(error => {
        next(error);
      })
  }



  if (minuPrice && !maxiPrice && !genderFilter && !petAllowedFilter && !estateFilter) {
    Unit.find({ dailyPrice: { $gte: minuPrice } })
      .then(data => {
        if (data == null) { next(new Error("gender is not defined")) }
        else {
          return response.status(200).json(data)
        }
      })
      .catch(error => {
        next(error);
      })
  }


  if (maxiPrice && !minuPrice && !genderFilter && !petAllowedFilter && !estateFilter) {
    Unit.find({ dailyPrice: { $lte: maxiPrice } })
      .then(data => {
        if (data == null) { next(new Error("gender is not defined")) }
        else {
          return response.status(200).json(data)
        }
      })
      .catch(error => {
        next(error);
      })
  }


  if (petAllowedFilter && !maxiPrice && !genderFilter && !minuPrice && !estateFilter) {
    Unit.find({ isPetsAllowed: petAllowedFilter })
      .then(data => {
        if (data == null) { next(new Error("gender is not defined")) }
        else {
          return response.status(200).json(data)
        }
      })
      .catch(error => {
        next(error);
      })
  }


  if (genderFilter && !maxiPrice && !petAllowedFilter && !minuPrice && !estateFilter) {
    Unit.find({ allowedGender: genderFilter })
      .then(data => {
        if (data == null) { next(new Error("gender is not defined")) }
        else {
          return response.status(200).json(data)
        }
      })
      .catch(error => {
        next(error);
      })
  }

  if (estateFilter && !maxiPrice && !petAllowedFilter && !minuPrice && !genderFilter) {
    Unit.find({ estateType: estateFilter })
      .then(data => {
        if (data == null) { next(new Error("gender is not defined")) }
        else {
          return response.status(200).json(data)
        }
      })
      .catch(error => {
        next(error);
      })
  }




}

























































































































  // looking for another solution

//   if (genderFilter) {
//     if (genderFilter && estateFilter) {
//       if (genderFilter && estateFilter && petAllowedFilter) {
//         if (genderFilter && estateFilter && petAllowedFilter && maxiPrice) {
//           if (
//             genderFilter &&
//             estateFilter &&
//             petAllowedFilter &&
//             maxiPrice &&
//             minuPrice
//           ) {
//             Unit.find({
//               $and: [
//                 { allowedGender: genderFilter },
//                 { estateType: estateFilter },
//                 { isPetsAllowed: petAllowedFilter },
//                 {
//                   $and: [
//                     { dailyPrice: { $lte: maxiPrice } },
//                     { dailyPrice: { $gt: minuPrice } },
//                   ],
//                 },
//               ],
//             })
//               .then((data) => {
//                 if (data == null) {
//                   next(new Error("gender is not defined"));
//                 } else {
//                   response.status(200).json(data);
//                 }
//               })
//               .catch((error) => {
//                 next(error);
//               });
//           } else {
//             Unit.find({
//               $and: [
//                 { allowedGender: genderFilter },
//                 { estateType: estateFilter },
//                 { isPetsAllowed: petAllowedFilter },
//                 { dailyPrice: { $lte: maxiPrice } },
//               ],
//             })
//               .then((data) => {
//                 if (data == null) {
//                   next(new Error("gender is not defined"));
//                 } else {
//                   response.status(200).json(data);
//                 }
//               })
//               .catch((error) => {
//                 next(error);
//               });
//           }
//         } else if (
//           genderFilter &&
//           estateFilter &&
//           petAllowedFilter &&
//           minuPrice
//         ) {
//           Unit.find({
//             $and: [
//               { allowedGender: genderFilter },
//               { estateType: estateFilter },
//               { isPetsAllowed: petAllowedFilter },
//               { dailyPrice: { $gte: minuPrice } },
//             ],
//           })
//             .then((data) => {
//               if (data == null) {
//                 next(new Error("gender is not defined"));
//               } else {
//                 response.status(200).json(data);
//               }
//             })
//             .catch((error) => {
//               next(error);
//             });
//         } else {
//           Unit.find({
//             $and: [
//               { allowedGender: genderFilter },
//               { estateType: estateFilter },
//               { isPetsAllowed: petAllowedFilter },
//             ],
//           })
//             .then((data) => {
//               if (data == null) {
//                 next(new Error("gender is not defined"));
//               } else {
//                 response.status(200).json(data);
//               }
//             })
//             .catch((error) => {
//               next(error);
//             });
//         }
//       } else if (genderFilter && estateFilter && maxiPrice) {
//         Unit.find({
//           $and: [
//             { allowedGender: genderFilter },
//             { estateType: estateFilter },
//             { dailyPrice: { $lte: maxiPrice } },
//           ],
//         })
//           .then((data) => {
//             if (data == null) {
//               next(new Error("gender is not defined"));
//             } else {
//               response.status(200).json(data);
//             }
//           })
//           .catch((error) => {
//             next(error);
//           });
//       } else if (genderFilter && estateFilter && minuPrice) {
//         Unit.find({
//           $and: [
//             { allowedGender: genderFilter },
//             { estateType: estateFilter },
//             { dailyPrice: { $gte: minuPrice } },
//           ],
//         })
//           .then((data) => {
//             if (data == null) {
//               next(new Error("gender is not defined"));
//             } else {
//               response.status(200).json(data);
//             }
//           })
//           .catch((error) => {
//             next(error);
//           });
//       }
//     } else if (genderFilter && petAllowedFilter) {
//       Unit.find({
//         $and: [
//           { allowedGender: genderFilter },
//           { isPetsAllowed: petAllowedFilter },
//         ],
//       })
//         .then((data) => {
//           if (data == null) {
//             next(new Error("gender is not defined"));
//           } else {
//             response.status(200).json(data);
//           }
//         })
//         .catch((error) => {
//           next(error);
//         });
//     } else if (genderFilter && minuPrice) {
//       Unit.find({
//         $and: [
//           { allowedGender: genderFilter },
//           { dailyPrice: { $gte: minuPrice } },
//         ],
//       })
//         .then((data) => {
//           if (data == null) {
//             next(new Error("gender is not defined"));
//           } else {
//             response.status(200).json(data);
//           }
//         })
//         .catch((error) => {
//           next(error);
//         });
//     } else if (genderFilter && maxiPrice) {
//       Unit.find({
//         $and: [
//           { allowedGender: genderFilter },
//           { dailyPrice: { $lte: maxiPrice } },
//         ],
//       })
//         .then((data) => {
//           if (data == null) {
//             next(new Error("gender is not defined"));
//           } else {
//             response.status(200).json(data);
//           }
//         })
//         .catch((error) => {
//           next(error);
//         });
//     } else {
//       Unit.find({ allowedGender: genderFilter })
//         .then((data) => {
//           if (data == null) {
//             next(new Error("estateType is not defined"));
//           } else {
//             response.status(200).json(data);
//           }
//         })
//         .catch((error) => {
//           next(error);
//         });
//     }
//   }
// };

// /Dummmmmmmmmmyy but don't remove it

// // module.exports.filteredUnit = ((request, response, next) => {

// //     filterQuery = request.query

// //     let genderFilter = request.query.gender
// //     let estateFilter = request.query.estateType
// //     let petAllowedFilter = request.query.petAllowed
// //     let minuPrice = request.query.minPrice
// //     let maxiPrice = request.query.maxPrice

//     // ****************Check for one thing

//     // Homie?gender=male&gender=female
//     // Homie?gender=male
//     // Homie?gender=female
//     // if (genderFilter) {
//     //     Unit.find({ allowedGender: genderFilter })
//     //         .then(data => {
//     //             if (data == null) { next(new Error("estateType is not defined")) }
//     //             else {
//     //                 response.status(200).json(data)
//     //             }
//     //         })
//     //         .catch(error => {
//     //             next(error);
//     //         })
//     // }
//     // else if (estateFilter) {
//     //     Unit.find({ estateType: estateFilter })
//     //         .then(data => {
//     //             if (data == null) { next(new Error("estateType is not defined")) }
//     //             else {
//     //                 response.status(200).json(data)
//     //             }
//     //         })
//     //         .catch(error => {
//     //             next(error);
//     //         })

//     // } else if (petAllowedFilter) {
//     //     Unit.find({ isPetsAllowed: petAllowedFilter })
//     //         .then(data => {
//     //             if (data == null) { next(new Error("petAlowed is not defined")) }
//     //             else {
//     //                 response.status(200).json(data)
//     //             }
//     //         })
//     //         .catch(error => {
//     //             next(error);
//     //         })

//     // } else if (minuPrice) {
//     //     Unit.find({ dailyPrice: { $gte: minuPrice } })
//     //         .then(data => {
//     //             if (data == null) { next(new Error("filter MinPrice is not defined")) }
//     //             else {
//     //                 response.status(200).json(data)
//     //             }
//     //         })
//     //         .catch(error => {
//     //             next(error);
//     //         })
//     // } else if (maxiPrice) {
//     //     Unit.find({ dailyPrice: { $lte: maxiPrice } })
//     //         .then(data => {
//     //             if (data == null) { next(new Error("fiter maxPrice is not defined")) }
//     //             else {
//     //                 response.status(200).json(data)
//     //             }
//     //         })
//     //         .catch(error => {
//     //             next(error);
//     //         })
//     // }

//     // if (genderFilter && estateFilter) {
//     //     Unit.find({ $and: [{ allowedGender: genderFilter }, { estateType: estateFilter }] })
//     //         .then(data => {
//     //             if (data == null) { next(new Error("gender is not defined")) }
//     //             else {
//     //                 response.status(200).json(data)
//     //             }
//     //         })
//     //         .catch(error => {
//     //             next(error);
//     //         })
//     // }

//     // else if (genderFilter && petAllowedFilter) {
//     //     Unit.find({ $and: [{ allowedGender: genderFilter }, { isPetsAllowed: petAllowedFilter }] })
//     //         .then(data => {
//     //             if (data == null) { next(new Error("gender is not defined")) }
//     //             else {
//     //                 response.status(200).json(data)
//     //             }
//     //         })
//     //         .catch(error => {
//     //             next(error);
//     //         })
//     // }

//     // else if (genderFilter && minuPrice) {
//     //     Unit.find({ $and: [{ allowedGender: genderFilter }, { dailyPrice: { $gte: minuPrice } }] })
//     //         .then(data => {
//     //             if (data == null) { next(new Error("gender is not defined")) }
//     //             else {
//     //                 response.status(200).json(data)
//     //             }
//     //         })
//     //         .catch(error => {
//     //             next(error);
//     //         })
//     // }

//     // else if (genderFilter && maxiPrice) {
//     //     Unit.find({ $and: [{ allowedGender: genderFilter }, { dailyPrice: { $lte: maxiPrice } }] })
//     //         .then(data => {
//     //             if (data == null) { next(new Error("gender is not defined")) }
//     //             else {
//     //                 response.status(200).json(data)
//     //             }
//     //         })
//     //         .catch(error => {
//     //             next(error);
//     //         })
//     // }

//     // if (genderFilter && estateFilter && petAllowedFilter) {
//     //     Unit.find({ $and: [{ allowedGender: genderFilter }, { estateType: estateFilter }, { isPetsAllowed: petAllowedFilter }] })
//     //         .then(data => {
//     //             if (data == null) { next(new Error("gender is not defined")) }
//     //             else {
//     //                 response.status(200).json(data)
//     //             }
//     //         })
//     //         .catch(error => {
//     //             next(error);
//     //         })
//     // }

//     // if (genderFilter && estateFilter && maxiPrice) {
//     //     Unit.find({ $and: [{ allowedGender: genderFilter }, { estateType: estateFilter }, { dailyPrice: { $lte: maxiPrice } }] })
//     //         .then(data => {
//     //             if (data == null) { next(new Error("gender is not defined")) }
//     //             else {
//     //                 response.status(200).json(data)
//     //             }
//     //         })
//     //         .catch(error => {
//     //             next(error);
//     //         })
//     // }

//     // if (genderFilter && estateFilter && minuPrice) {
//     //     Unit.find({ $and: [{ allowedGender: genderFilter }, { estateType: estateFilter }, { dailyPrice: { $gte: minuPrice } }] })
//     //         .then(data => {
//     //             if (data == null) { next(new Error("gender is not defined")) }
//     //             else {
//     //                 response.status(200).json(data)
//     //             }
//     //         })
//     //         .catch(error => {
//     //             next(error);
//     //         })
//     // }

//     // if (genderFilter && estateFilter && petAllowedFilter && maxiPrice) {
//     //     Unit.find({ $and: [{ allowedGender: genderFilter }, { estateType: estateFilter }, { isPetsAllowed: petAllowedFilter }, { dailyPrice: { $lte: maxiPrice } }] })
//     //         .then(data => {
//     //             if (data == null) { next(new Error("gender is not defined")) }
//     //             else {
//     //                 response.status(200).json(data)
//     //             }
//     //         })
//     //         .catch(error => {
//     //             next(error);
//     //         })
//     // }

//     // if (genderFilter && estateFilter && petAllowedFilter && minuPrice) {
//     //     Unit.find({ $and: [{ allowedGender: genderFilter }, { estateType: estateFilter }, { isPetsAllowed: petAllowedFilter }, { dailyPrice: { $gte: minuPrice } }] })
//     //         .then(data => {
//     //             if (data == null) { next(new Error("gender is not defined")) }
//     //             else {
//     //                 response.status(200).json(data)
//     //             }
//     //         })
//     //         .catch(error => {
//     //             next(error);
//     //         })
//     // }

// // });



  //     // ****************Check for one thing

  //     // Homie?gender=male&gender=female
  //     // Homie?gender=male
  //     // Homie?gender=female

  //     // Homie?gender=male&gender=female&maxPrice=500
  //     // Homie?gender=male&minPrice=500
  //     // Homie?gender=female&estateType=studio&estateType="small-room"

  //     // Homie?gender=male&gender=female&petAllowed=true
  //     // Homie?gender=male
  //     // Homie?gender=female

  // /     Homie?gender=female&maxPrice=500&estateType=studio
  // /     Homie?gender=female&maxPrice=500&estateType=studio&petAllowed=true
  // /     Homie?gender=female&maxPrice=500&estateType=studio&petAllowed=true&&maxPrice=900