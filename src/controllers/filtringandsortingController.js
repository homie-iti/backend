const mongoose = require('mongoose')
require('../models/unitModel')
let Unit = mongoose.model('units')
let city = mongoose.model('cities')

module.exports.filteredUnit = async (request, response, next) => {
    try {
        filterQuery = request.query
        let sortType = request.query.sorting
        let genderFilter = request.query.gender
        let estateFilter = request.query.estateType
        let petAllowedFilter = request.query.petAllowed
        let minuPrice = request.query.minPrice
        let maxiPrice = request.query.maxPrice
        let filter = {}
        let sort = {}
        filterGender = { allowedGender: genderFilter }
        filterEstate = { estateType: estateFilter }
        filterPets = { isPetsAllowed: petAllowedFilter }
        filterMinPri = { dailyPrice: { $gt: minuPrice } }
        filterMaxPri = { dailyPrice: { $lte: maxiPrice } }
        filterRangePrice = {
            $and: [
                { dailyPrice: { $lte: maxiPrice } },
                { dailyPrice: { $gt: minuPrice } },
            ],
        }

        if (genderFilter) {
            filter = { ...filter, ...filterGender }
        }
        if (estateFilter) {
            filter = { ...filter, ...filterEstate }
        }
        if (petAllowedFilter) {
            filter = { ...filter, ...filterPets }
        }
        if (minuPrice && !maxiPrice) {
            filter = { ...filter, ...filterMinPri }
        }
        if (maxiPrice && !minuPrice) {
            filter = { ...filter, ...filterMaxPri }
        }

        if (maxiPrice && minuPrice) {
            filter = { ...filter, ...filterRangePrice }
        }
        if (sortType == 'mostRecent') {
            sort = { createdAt: -1 }
        }
        if (sortType == 'lowToHigh') {
            sort = { dailyPrice: 'asc' }
        }
        if (sortType == 'highToLow') {
            sort = { dailyPrice: -1 }
        }

        const data = await city
            .findOne({ id: request.params.id })
            .populate({ path: 'units', match: filter })
            .sort(sort)
        response.status(200).json({ data })
    } catch (error) {
        next(error)
    }
}

// Route scenario(filter, sort, filter and sort)

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

// ?sorting=mostRecent
// ?sorting=lowToHigh
// ?sorting=highToLow
