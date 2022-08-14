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
        contractDetails,
        name: contractDetails.landlordName,
        email: contractDetails.landlordEmail,
    }
    return emailNotifier.sendMessage(event, configs).then((msgState) => {
        console.log(msgState)
        return {
            ...contractDetails._doc,
            isEmailSent: msgState,
        }
    })
}

function notifyAgent(event, agentDetails) {
    console.log(agentDetails)
    const configs = {
        agentDetails,
        name: agentDetails.agentName,
        email: agentDetails.agentEmail,
    }
    return emailNotifier.sendMessage(event, configs).then((msgState) => {
        console.log(msgState)
        return {
            ...agentDetails._doc,
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
                    `Sorry, you can't reserve this unit as your balance is not enough.`
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
                contractData,
                agentName: userData.fullName,
                agentPhoneNumber: userData.phone,
                agentEmail: userData.email,
                landlordName: landlord._id.fullName,
                landlordPhoneNumber: landlord._id.phone,
                landlordEmail: landlord._id.email,
            }
            console.log(contractDetails)
            notifyLandlord('book_unit', contractDetails)
            response
                .status(200)
                .json(
                    'An email has been sent successfully to the landlord to confirm the booking.'
                )
        })

        .catch((error) => next(error))
}

module.exports.confirmBookingUnit = (request, response, next) => {
    let contractData
    let agentData
    let landlordData

    ContractModel.findOne({ _id: request.params.id })
        .then((contract) => {
            // console.log(contract)
            if (!contract) throw new Error(`Contract not found`)
            contractData = contract
            contractData.state = 'active'
            // console.log(contractData)

            return UnitModel.findOneAndUpdate(
                { _id: contractData.unitId },
                {
                    $set: {
                        // isAvailable: false,
                        agentId: contractData.agentId,
                    },
                },
                { new: true }
            )
        })
        .then((unit) => {
            if (!unit) throw new Error(`Unit not found`)
            // console.log(unit)
            return UserModel.findOneAndUpdate(
                {
                    _id: contractData.landlordId,
                },
                {
                    $inc: { balance: contractData.totalAmount },
                },
                { new: true }
            )
        })
        .then((landlord) => {
            if (!landlord)
                throw new Error(
                    `Landlord is not found in the landlords' collection`
                )
            landlordData = landlord
            console.log(landlordData)

            return UserModel.findOneAndUpdate(
                {
                    _id: contractData.agentId,
                },
                {
                    $set: { isAgent: true },
                    $inc: { balance: -contractData.totalAmount },
                },
                { new: true }
            )
        })
        .then((userAgent) => {
            agentData = userAgent
            console.log(agentData)
            return AgentModel.findOne({
                _id: contractData.agentId,
            })
        })
        .then((agent) => {
            // console.log(agent)
            if (!agent) {
                const newAgent = new AgentModel({
                    _id: contractData.agentId,
                    agentUnits: [
                        { unitId: contractData.unitId, numberOfRenting: 1 },
                    ],
                })
                return newAgent.save()
            }
            const newAgentUnit = {
                unitId: contractData.unitId,
                numberOfRenting: 1,
            }

            agent.agentUnits.push(newAgentUnit)
            console.log(agent)
        })
        .then(() => {
            const agentDetails = {
                agentName: agentData.fullName,
                agentPhoneNumber: agentData.phone,
                agentEmail: agentData.email,
                landlordName: landlordData.fullName,
                landlordPhoneNumber: landlordData.phone,
                landlordEmail: landlordData.email,
            }
            console.log(agentDetails)
            notifyAgent('confirm_booking_unit', agentDetails)
            response
                .status(200)
                .json(
                    'An email has been sent to the agent to notify him that the landlord has been confirmed to book the unit.'
                )
        })

        .catch((error) => next(error))
}

module.exports.cancelBookingUnit = (request, response, next) => {
    let contractData
    ContractModel.findOne({ _id: request.params.id })
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
            const agentDetails = {
                agentName: user.fullName,
                agentPhoneNumber: user.phone,
                agentEmail: user.email,
            }
            notifyAgent('cancel_booking_unit', agentDetails)
            response
                .status(200)
                .json(
                    'An email has been sent to the agent to notify that the contract has been canceled.'
                )
        })
        .catch((error) => next(error))
}
