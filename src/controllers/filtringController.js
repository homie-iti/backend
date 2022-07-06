const mongoose = require("mongoose");
require("../models/unit.model");
let Unit = mongoose.model("units")







module.exports.filteredUnit = ((request, response, next) => {

    console.log(request.query)

    // let filterQuery = request.query.gender || request.query.estateType || request.query.petAllowed
    // let City = request.query.city
    // let minuPrice = request.query.minPrice
    // let maxiPrice = request.query.maxPrice

    // if (filterQuery == "male" || "female") {
    //     Unit.find({ gender: filterQuery })
    //         .then(data => {
    //             if (data == null) { next(new Error("gender is not defined")) }
    //             else {
    //                 response.status(200).json(data)
    //             }
    //         })
    //         .catch(error => {
    //             next(error);
    //         })


    // } else if (filterQuery == "studio" || "shared-room" || "single-room") {
    //     Unit.find({ estateType: filterQuery })
    //         .then(data => {
    //             if (data == null) { next(new Error("estateType is not defined")) }
    //             else {
    //                 response.status(200).json(data)
    //             }
    //         })
    //         .catch(error => {
    //             next(error);
    //         })

    // } else if (filterQuery == "petAllowed") {
    //     Unit.find({ isPetsAllowed: true })
    //         .then(data => {
    //             if (data == null) { next(new Error("petAlowed is not defined")) }
    //             else {
    //                 response.status(200).json(data)
    //             }
    //         })
    //         .catch(error => {
    //             next(error);
    //         })

    // } else if (filterQuery == "petNotAllowed") {
    //     Unit.find({ isPetsAllowed: false })
    //         .then(data => {
    //             if (data == null) { next(new Error("petNotAllowed is not defined")) }
    //             else {
    //                 response.status(200).json(data)
    //             }
    //         })
    //         .catch(error => {
    //             next(error);
    //         })
    // } else if (minuPrice > 0) {
    //     Unit.find({ dailyPrice: { $gte: minuPrice } })
    //         .then(data => {
    //             if (data == null) { next(new Error("filter MinPrice is not defined")) }
    //             else {
    //                 response.status(200).json(data)
    //             }
    //         })
    //         .catch(error => {
    //             next(error);
    //         })
    // } else if (maxiPrice > 0) {
    //     Unit.find({ dailyPrice: { $lte: maxiPrice } })
    //         .then(data => {
    //             if (data == null) { next(new Error("fiter maxPrice is not defined")) }
    //             else {
    //                 response.status(200).json(data)
    //             }
    //         })
    //         .catch(error => {
    //             next(error);
    //         })
    // } else {
    //     // CheckError
    //     Unit.find({ cityName: City })
    //         .then(data => {
    //             if (data == null) { next(new Error("fiter city is not defined")) }
    //             else {
    //                 response.status(200).json(data)
    //             }
    //         })
    //         .catch(error => {
    //             next(error);
    //         })
    // }



});

