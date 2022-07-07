const mongoose = require("mongoose");
require("../models/unitModel");
let Unit = mongoose.model("units")


module.exports.filteredUnit = ((request, response, next) => {


    filterQuery = request.query

    let genderFilter = request.query.gender
    let estateFilter = request.query.estateType
    let petAllowedFilter = request.query.petAllowed
    let minuPrice = request.query.minPrice
    let maxiPrice = request.query.maxPrice

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




    if (genderFilter) {
        if (genderFilter && estateFilter) {
            if (genderFilter && estateFilter && petAllowedFilter) {
                if (genderFilter && estateFilter && petAllowedFilter && maxiPrice) {
                    if (genderFilter && estateFilter && petAllowedFilter && maxiPrice && minuPrice) {
                        Unit.find({ $and: [{ allowedGender: genderFilter }, { estateType: estateFilter }, { isPetsAllowed: petAllowedFilter }, { $and: [{ dailyPrice: { $lte: maxiPrice } }, { dailyPrice: { $gt: minuPrice } }] }] })
                            .then(data => {
                                if (data == null) { next(new Error("gender is not defined")) }
                                else {
                                    response.status(200).json(data)
                                }
                            })
                            .catch(error => {
                                next(error);
                            })
                    } else {
                        Unit.find({ $and: [{ allowedGender: genderFilter }, { estateType: estateFilter }, { isPetsAllowed: petAllowedFilter }, { dailyPrice: { $lte: maxiPrice } }] })
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
                }

                else if (genderFilter && estateFilter && petAllowedFilter && minuPrice) {
                    Unit.find({ $and: [{ allowedGender: genderFilter }, { estateType: estateFilter }, { isPetsAllowed: petAllowedFilter }, { dailyPrice: { $gte: minuPrice } }] })
                        .then(data => {
                            if (data == null) { next(new Error("gender is not defined")) }
                            else {
                                response.status(200).json(data)
                            }
                        })
                        .catch(error => {
                            next(error);
                        })
                } else {
                    Unit.find({ $and: [{ allowedGender: genderFilter }, { estateType: estateFilter }, { isPetsAllowed: petAllowedFilter }] })
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



            }

            else if (genderFilter && estateFilter && maxiPrice) {
                Unit.find({ $and: [{ allowedGender: genderFilter }, { estateType: estateFilter }, { dailyPrice: { $lte: maxiPrice } }] })
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

            else if (genderFilter && estateFilter && minuPrice) {
                Unit.find({ $and: [{ allowedGender: genderFilter }, { estateType: estateFilter }, { dailyPrice: { $gte: minuPrice } }] })
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

        }

        else if (genderFilter && petAllowedFilter) {
            Unit.find({ $and: [{ allowedGender: genderFilter }, { isPetsAllowed: petAllowedFilter }] })
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

        else if (genderFilter && minuPrice) {
            Unit.find({ $and: [{ allowedGender: genderFilter }, { dailyPrice: { $gte: minuPrice } }] })
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

        else if (genderFilter && maxiPrice) {
            Unit.find({ $and: [{ allowedGender: genderFilter }, { dailyPrice: { $lte: maxiPrice } }] })
                .then(data => {
                    if (data == null) { next(new Error("gender is not defined")) }
                    else {
                        response.status(200).json(data)
                    }
                })
                .catch(error => {
                    next(error);
                })
        } else {
            Unit.find({ allowedGender: genderFilter })
                .then(data => {
                    if (data == null) { next(new Error("estateType is not defined")) }
                    else {
                        response.status(200).json(data)
                    }
                })
                .catch(error => {
                    next(error);
                })
        }

    }



});





















































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






























