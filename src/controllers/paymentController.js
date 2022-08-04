const UnitModel = require('../models/unitModel')
const ContractModel = require('../models/contractModel')
const UserModel = require('../models/userModel')
const LandlordModel = require('../models/landlordModel')
const AgentModel = require('../models/agentModel')
const EmailClient = require('../utilities/sendEmail')

const emailNotifier = new EmailClient()
function notifyLandlord(event, contractDetails) {
    console.log(contractDetails)
    const configs = {
        ...contractDetails,
    }
    return emailNotifier.sendMessage(event, configs).then((msgState) => {
        console.log(msgState)
        return {
            ...user._doc,
            isEmailSent: msgState,
        }
    })
}

module.exports.bookUnit = (request, response, next) => {
    let unitData
    let userData
    let contractData

    const daysOfReserve = request.body.days
    UnitModel.findOne({ _id: request.params.id })
        .then((unit) => {
            // console.log(unit)
            if (!unit) throw new Error(`Unit is not found in units' collection`)
            if (!unit.isAvailable)
                throw new Error(`Unit is not available now,choose another one.`)
            unitData = unit
            return UserModel.findOne({
                _id: request.body.id,
            })
        })
        .then((user) => {
            if (!user)
                throw new Error(`User is not found in the users' collection`)

            if (user.balance < unitData.dailyPrice * daysOfReserve)
                throw new Error(
                    `Sorry, you can't reserve this unit as your balance as not enough`
                )
            console.log(unitData.dailyPrice * daysOfReserve)
            // console.log(unitData)
            userData = user
            // console.log(userData)
            const newContract = new ContractModel({
                unitId: unitData._id,
                agentId: userData._id,
                landlordId: unitData.landlordId,
                rentalStart: request.body.rentalStart,
                rentalEnd: request.body.rentalEnd,
                totalAmount: unitData.dailyPrice * daysOfReserve,
                paymentMethod: request.body.paymentMethod,
                state: request.body.state,
            })
            return newContract.save()
        })
        .then((contract) => {
            console.log(contract)
            contractData = contract
            return LandlordModel.findOne({
                _id: contractData.landlordId,
            }).populate({
                path: '_id',
                select: 'fullName phone email',
            })
        })
        .then((landlord) => {
            if (!landlord)
                throw new Error(
                    `Landlord is not found in the landlords' collection`
                )
            console.log(landlord)
            const contractDetails = {
                ...contractData,
                agentName: userData.fullName,
                agentPhoneNumber: userData.phone,
                agentEmail: userData.email,
                landlordName: landlord._id.fullName,
                landlordPhoneNumber: landlord._id.phone,
                landlordEmail: landlord._id.email,
            }
            console.log(contractDetails)
            // notifyLandlord('unit_reserve', contractDetails)
            response
                .status(200)
                .json(
                    'Email has been send successfully to the landlord to confirm booking'
                )
        })

        .catch((error) => next(error))
}

module.exports.confirmBookingUnit = (request, response, next) => {
    let contractData
    ContractModel.findOne({ _id: request.body.id })
        .then((contract) => {
            // console.log(contract)
            if (!contract) throw new Error(`Contract not found`)
            contractData = contract
            contractData.state = 'active'
            console.log(contractData)
            return UnitModel.findOneAndUpdate(
                { _id: contractData.unitId._id },
                {
                    $set: {
                        isAvailable: false,
                        agentId: contractData.agentId._id,
                    },
                }
            )
        })
        .then((unit) => {
            if (!unit) throw new Error(`Unit not found`)
            console.log(unit)
            return UserModel.findOneAndUpdate(
                {
                    _id: contractData.agentId,
                },
                {
                    $set: { isAgent: true },
                    $inc: { balance: -contractData.totalAmount },
                }
            )
        })
        .then((agent) => {
            console.log(agent)
            if (!agent) throw new Error(`Agent not found`)

            const newAgent = new AgentModel({
                _id: agent._id,
                agentUnits: [
                    { unitId: contractData.unitId, numberOfRenting: 1 },
                ],
            })
            return newAgent.save()
        })
        .then((data) => {
            console.log(data)
            response
                .status(200)
                .json(
                    'Email will send to the agent to notify that contract has been confirmed'
                )
            // TODO send email to agent to notify that landlord has confirmed
        })

        .catch((error) => next(error))
}

module.exports.cancelBookingUnit = (request, response, next) => {
    let contractData
    ContractModel.findOne({ _id: request.body.id })
        .then((contract) => {
            // console.log(contract)
            if (!contract) throw new Error(`Contract not found`)
            contractData = contract
            contractData.state = 'canceled'
            console.log(contractData)
            return UserModel.findOne(
                { _id: contractData.agentId },
                'fullName email phone'
            )
        })
        .then((user) => {
            console.log(user)
            if (!user) throw new Error(`User not found`)
            response
                .status(200)
                .json(
                    'Email will send to the agent to notify that contract has been canceled'
                )
        })
}
