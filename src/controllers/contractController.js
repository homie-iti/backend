const ContractModel = require('../models/contractModel')
const AgentModel = require('../models/agentModel')
const LandlordModel = require('../models/landlordModel')
// let Unit = require("./../models/unitModel");

module.exports.getLandlordContracts = (request, response, next) => {
    ContractModel.findOne({ landlordId: request.params.id })
        .then((data) => {
            if (data == null) {
                throw new Error('No Contracts For Entered Landlord')
            }
            response.status(200).json(data)
        })
        .catch((error) => next(error))
}

module.exports.getUnitContracts = (request, response, next) => {
    ContractModel.findOne({ unitId: request.params.id })
        .then((data) => {
            console.log(data)
            if (data == null) throw new Error("Unit Doesn't Exist")
            else {
                response.status(200).json(data)
            }
        })
        .catch((error) => next(error))
}

module.exports.getContractsByPage = (request, response, next) => {
    ContractModel.paginate(
        {},
        {
            page: request.query.page || 1,
            // select: '',
            populate: { path: 'landlordId agentId unitId' },
        }
    )
        // ContractModel.find({})
        //     .populate({
        //         path: 'unitId',
        //         select: 'cover estateType unitInfo dailyPrice',
        //     })
        //     .populate({ path: 'agentId', select: 'fullName' })
        //     .populate({ path: 'landlordId', select: 'fullName' })

        .then((data) => {
            console.log(data)
            response.status(200).json({
                currentPage: data.page,
                previousPage: data.prevPage,
                nextPage: data.nextPage,
                totalPages: data.totalPages,
                totalContracts: data.totalDocs,
                contractsDisplayed: data.docs.length,
                remained: data.totalDocs - data.docs.length,
                results: data.docs,
            })
        })
        .catch((error) => {
            next(error)
        })
}

module.exports.addContract = (request, response, next) => {
    LandlordModel.exists({ _id: request.body._id })
        .then((data) => {
            if (!data)
                throw new Error(`_id isn't available in landlords collection`)
            return AgentModel.exists({ _id: request.body._id })
        })
        .then((data) => {
            // console.log(data)
            if (!data)
                throw new Error(`_id isn't available in agents collection`)

            const newContract = new ContractModel(request.body)
            return newContract.save()
        })

        .then((data) => {
            response.status(201).json({ data: `added ${data._id}` })
        })

        .catch((error) => next(error))
}

module.exports.getContract = (request, response, next) => {
    ContractModel.findOne({ _id: request.params.id })
        .then((data) => {
            if (data === null) throw new Error('Contract Not Found')
            response.status(200).json(data)
        })
        .catch((error) => next(error))
}

module.exports.deleteUnitContract = (request, response, next) => {
    ContractModel.deleteOne({ unitId: request.params.id })
        .then((data) => {
            if (data.deletedCount === 0) next(new Error('Contract Not Found'))
            else {
                response.status(200).json(data)
            }
        })
        .catch((error) => next(error))
}

module.exports.updateContractData = (request, response, next) => {
    // TODO shouldn't be available in api
    // FIX this update
    ContractModel.findOne({ unitId: request.body.id })
        .then((data) => {
            // console.log(data);
            if (!data) throw new Error('There is No contract For This Unit')

            const updates = request.body
            // console.log(updates);
            for (const property in updates) {
                data[property] = updates[property] || data[property]
                if (property in data === false) {
                    console.log(property, updates[property])
                    data.property = updates[property]
                    console.log(data)
                }
            }
            return data.save()
        })
        .then((data) => {
            console.log(data)
            response.status(201).json({ data: 'Unit Data Updated' })
        })
        .catch((error) => next(error))
}
