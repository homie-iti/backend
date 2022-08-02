const CityModel = require('../models/cityModel')
const UnitModel = require('../models/unitModel')
const LandlordModel = require('../models/landlordModel')
const AgentModel = require('../models/agentModel')
const ContractModel = require('../models/contractModel')

const helperFunctions = require('./_HelperFunctions')

module.exports.getAllCities = (request, response, next) => {
    CityModel.find({})
        .then((data) => {
            response.status(200).json(data)
        })
        .catch((error) => {
            next(error)
        })
}

module.exports.getCityById = (request, response, next) => {
    const { id: cityId } = request.params

    CityModel.findOne({ _id: cityId }, { _id: 0 })
        .populate({
            path: 'units',
            select: { dailyPrice: 1, estateType: 1, images: 1 },
        })
        .then((data) => {
            if (data == null) next(new Error('City not found'))
            response.status(200).json(data)
        })
        // console.log(data);
        .catch((error) => next(error))
}

exports.getCityProperty = async (request, response, next) => {
    const { id: cityId, prop } = request.params
    console.log(prop)

    CityModel.findOne({ _id: cityId }, { _id: 0, [prop]: 1 })
        .then((data) => {
            if (!data) throw new Error('City not found')

            console.log(data, prop)
            if (prop === 'units') {
                data.populate({
                    path: 'units',
                    select: { dailyPrice: 1, estateType: 1, images: 1 },
                })
            }
            response.status(200).json(data)
            console.log(data)

            if (data == null) next(new Error('City not found'))
        })

        .catch((error) => next(error))
}

exports.createCity = async (request, response, next) => {
    try {
        const cityObject = new CityModel({
            // _id: mongoose.Types.ObjectId("2bd1deeb363b3bbed3f342da"),
            name: request.body.name,
            cover: request.body.cover,
            units: [],
        })

        const data = await cityObject.save()

        response
            .status(201)
            .json({ data: 'city added', id: data._id.toString() })
    } catch (error) {
        next(error)
    }
}

exports.deleteCity = async (request, response, next) => {
    CityModel.findOneAndDelete({
        _id: request.params.id,
    })
        .populate({ path: 'units', select: { _id: 1, landlordId: 1 } })
        .select({ _id: 1, units: 1 })
        .then((data) => {
            if (!data) throw new Error('City not found')
            console.log(data)
            return data
        })
        .then((data) =>
            helperFunctions.deleteManyDocumentsByManyValues(
                UnitModel,
                '_id',
                data.units.map((obj) => obj._id.toString()),
                data
            )
        )
        .then((data) =>
            helperFunctions.deleteArrayFieldElementsByManyValues(
                LandlordModel,
                '_id',
                { $in: data.units.map((obj) => obj.landlordId.toString()) },
                'landlordUnits',
                data.units.map((obj) => obj._id.toString()),
                data
            )
        )
        .then((data) =>
            helperFunctions.deleteManyDocumentsByManyValues(
                ContractModel,
                'unitId',
                data.units.map((obj) => obj._id.toString()),
                data
            )
        )
        .then((data) =>
            helperFunctions.deleteArrayFieldElementsByManyValues(
                AgentModel,
                'agentUnits.unitId',
                { $in: data.units.map((obj) => obj.landlordId.toString()) },
                'agentUnits.unitId',
                data.units.map((obj) => obj._id.toString()),
                data
            )
        )
        .then((data) => {
            response.status(200).json({ message: 'deleted city' })
        })

        .catch((error) => next(error))
}

exports.addUnitToCity = (request, response, next) => {
    const uniqueUnits = [...new Set([...request.body.units])]

    UnitModel.find({
        _id: { $in: uniqueUnits },
    })
        .select({
            _id: 1,
        })
        .then((realIdsObjs) => {
            // console.log(realIdsObjs)
            const realIds = [...realIdsObjs].map((obj) => obj._id.toString())
            // console.log(realIds)
            const notRealIds = uniqueUnits.filter(
                (id) => !realIds.includes(id.toString())
            )
            // console.log(notRealIds)
            if (notRealIds.length > 0)
                throw new Error(
                    `unit with ${
                        notRealIds.length === 1 ? 'id' : 'ids'
                    } (${notRealIds.join('-')}) not found`
                )
        })
        .then(() =>
            CityModel.updateOne(
                { _id: request.params.id },
                {
                    $push: {
                        units: uniqueUnits,
                    },
                }
            )
        )
        .then((data) => {
            // console.log(data)

            if (data.matchedCount < 1) throw new Error('city  not found')
            if (data.modifiedCount < 1)
                throw new Error("units couldn't be added to city")

            response.status(200).json({
                data: `unit is added to city${
                    uniqueUnits.length !== request.body.units.length
                        ? ' - removed duplicates of your entry'
                        : ''
                }`,
            })
        })
        .catch((error) => next(error))
}

exports.deleteUnitFromCity = async (request, response, next) => {
    const uniqueUnits = [...new Set([...request.body.units])]

    CityModel.updateOne(
        { _id: request.params.id },
        {
            $pull: {
                units: { $in: uniqueUnits },
            },
        }
    )
        .then((data) => {
            // console.log(data);
            if (data.matchedCount < 1) throw new Error('city  not found')
            if (data.modifiedCount < 1)
                throw new Error("all of the entered units isn't in city")

            response.status(200).json({
                data: `units are deleted from city${
                    uniqueUnits.length !== request.body.units.length
                        ? ' - removed duplicates of your entry'
                        : ''
                }`,
            })
        })
        .catch((error) => next(error))
}

exports.updateCityProperties = async (request, response, next) => {
    const modificationsObject = request.body.reduce((acc, curr) => {
        acc[curr.prop] = curr.value
        return acc
    }, {})

    // console.log(modificationsObject);

    if (modificationsObject.units) {
        modificationsObject.units = [...new Set([...modificationsObject.units])]
        const realIds = await UnitModel.find({
            _id: { $in: modificationsObject.units },
        })
            .select({ _id: 1 })
            .transform((value) => {
                console.log({ value })
                return value.map((obj) => obj._id.toString())
            })
        // console.log({ x })
        const notRealIds = modificationsObject.units.filter(
            (id) => !realIds.includes(id.toString())
        )
        // console.log(notRealIds)
        if (notRealIds.length > 0)
            next(
                new Error(
                    `unit with ${
                        notRealIds.length === 1 ? 'id' : 'ids'
                    } (${notRealIds.join('-')}) not found`
                )
            )
        return
    }

    CityModel.updateOne({ _id: request.params.id }, modificationsObject)
        .then((data) => {
            // console.log(data);
            if (data.matchedCount < 1) throw new Error('city not found')
            if (data.modifiedCount < 1)
                throw new Error("props couldn't be modified")

            response.status(200).json({
                data: `props are modified ${Object.keys(modificationsObject)}`,
            })
        })

        .catch((error) => next(error))
}
