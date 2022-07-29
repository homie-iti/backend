const Contract = require('../models/contractModel')
// let Unit = require("./../models/unitModel");

module.exports.getLandlordContracts = (request, response, next) => {
    Contract.findOne({ landlordId: request.params.id })
        .then((data) => {
            if (data == null) {
                next(new Error('No Contracts For Entered Landlord'))
            } else {
                response.status(200).json(data)
            }
        })
        .catch((error) => next(error))
}

module.exports.getUnitContracts = (request, response, next) => {
    Contract.findOne({ unitId: request.params.id })
        // .populate({
        //   path: "unitId",
        //   select: " cover estateType unitInfo dailyPrice numberOfResidents ",
        // })
        // .populate({ path: "landlordId", select: "fullName" })
        .then((data) => {
            console.log(data)
            if (data == null) next(new Error("Unit Doesn't Exist"))
            else {
                response.status(200).json(data)
            }
        })
        .catch((error) => next(error))
}

module.exports.getContractsByPage = (request, response, next) => {
    Contract.paginate(
        {},
        {
            page: request.query.page || 1,
            // select: '',
            populate: { path: 'landlordId agentId unitId' },
        }
    )
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
    const newContract = new Contract(request.body)
    newContract
        .save()
        .then((data) => {
            response.status(200).json(data)
        })
        .catch((error) => next(error))
}

module.exports.deleteUnitContract = (request, resposne, next) => {
    Contract.deleteOne({ unitId: request.params.id })
        .then((data) => {
            if (data.deletedCount === 0) next(new Error('Contract Not Found'))
            else {
                resposne.status(200).json(data)
            }
        })
        .catch((error) => next(error))
}

module.exports.updateContractData = (request, response, next) => {
    Contract.findOne({ unitId: request.body.id })
        .then((data) => {
            // console.log(data);
            if (data == null) {
                next(new Error('There is No Contract For This Unit'))
            } else {
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
                data.save().then((data) => {
                    console.log(data)
                    response.status(201).json({ data: 'Unit Data Updated' })
                })
            }
        })
        .catch((error) => next(error))
}
