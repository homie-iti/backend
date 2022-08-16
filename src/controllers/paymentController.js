/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
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

const getDatesRange = (startDate, endDate, steps = 1) => {
    const currentDate = new Date(startDate)
    const unavailableDates = []
    while (currentDate <= new Date(endDate)) {
        unavailableDates.push(
            new Date(currentDate).toISOString().substring(0, 10)
        )
        currentDate.setDate(currentDate.getDate() + steps)
    }

    return unavailableDates
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
            contract.state = 'active'
            contractData = contract
            // console.log(contractData)
            contract.save()

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
            contract.state = 'canceled'
            contractData = contract
            contract.save()
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


// TODO edit book unit (code flow isn't work as expected)
// module.exports.bookUnit = (request, response, next) => {
//     let unitData
//     let userData
//     let contractData
//     let unitContracts
//     const daysOfReserve = request.body.days
//     UnitModel.findOne({ _id: request.params.id })
//         .then((unit) => {
//             // console.log(unit)
//             if (!unit) throw new Error(`Unit is not found in units' collection`)
//             if (!unit.isAvailable)
//                 throw new Error(`Unit is not available now,choose another one.`)
//             unitData = unit
//             return UserModel.findOne({
//                 _id: request.body.id,
//             })
//         })
//         .then((user) => {
//             if (!user)
//                 throw new Error(`User is not found in the users' collection`)

//             userData = user
//             //! after finding the unit isAvailable and the user present in users collection.We get unit contracts to see if the required user dates conflicts with other contract dates
//             return ContractModel.find(
//                 { unitId: unitData._id },
//                 { rentalStart: 1, rentalEnd: 1, state: 1 }
//             )
//         })
//         .then((contracts) => {
//             unitContracts = contracts
//             // console.log(contracts.length === 0)
//             //! If the unit has no contracts, we check if the user balance is enough for the days he wants to rent.
//             if (
//                 unitContracts.length === 0 &&
//                 userData.balance < unitData.dailyPrice * daysOfReserve
//             )
//                 throw new Error(
//                     `Sorry, you can't reserve this unit as your balance is not enough.`
//                 )
//             //! There are no unit contracts, and the current balance is sufficient.so we create the contract
//             else if (
//                 unitContracts.length === 0 &&
//                 userData.balance >= unitData.dailyPrice * daysOfReserve
//             ) {
//                 const newContract = new ContractModel({
//                     unitId: unitData._id,
//                     agentId: userData._id,
//                     landlordId: unitData.landlordId,
//                     rentalStart: request.body.rentalStart,
//                     rentalEnd: request.body.rentalEnd,
//                     totalAmount: unitData.dailyPrice * daysOfReserve,
//                     paymentMethod: request.body.paymentMethod,
//                     // state: request.body.state,
//                     //! is not necessary to be send as its by default proposed in the first,user doesn't need to enter that.
//                 })
//                 return newContract.save()
//             }
//         })
//         .then(() => {
//             if (userData.balance < unitData.dailyPrice * daysOfReserve) {
//                 throw new Error(
//                     `Sorry, you can't reserve this unit as your balance is not enough.`
//                 )
//             }

//             console.log(unitContracts)
//             //! when we find that unit have contracts, we put its all unavailable dates in array so later we can check if the agent required date is available or not

//             let unavailableUnitDates = []
//             unitContracts.forEach((contract) => {
//                 unavailableUnitDates = getDatesRange(
//                     contract.rentalStart,
//                     contract.rentalEnd
//                 )
//             })

//             console.log(unavailableUnitDates)
//             if (unavailableUnitDates.includes(request.body.rentalStart)) {
//                 throw new Error(
//                     `Please choose another start date as this is already unavailable.`
//                 )
//             }
//             if (unavailableUnitDates.includes(request.body.rentalEnd)) {
//                 throw new Error(
//                     `Please choose another end date as this is already unavailable.`
//                 )
//             }

//             //! if the two start and date doesn't exist in the array of unavailableUnitDates, then we create the contract and send it to the landlord
//             const startEndDates = [
//                 request.body.rentalStart,
//                 request.body.rentalEnd,
//             ]
//             const unavailableDates = startEndDates.every((value) =>
//                 unavailableUnitDates.includes(value)
//             )
//             console.log(unavailableDates)
//             if (!unavailableDates) {
//                 const newContract = new ContractModel({
//                     unitId: unitData._id,
//                     agentId: userData._id,
//                     landlordId: unitData.landlordId,
//                     rentalStart: request.body.rentalStart,
//                     rentalEnd: request.body.rentalEnd,
//                     totalAmount: unitData.dailyPrice * daysOfReserve,
//                     paymentMethod: request.body.paymentMethod,
//                 })
//                 return newContract.save()
//             }
//         })
//         .then(() => {
//             console.log(unitData)
//             LandlordModel.findOne({
//                 _id: unitData.landlordId._id,
//             }).populate({
//                 path: '_id',
//                 select: 'fullName phone email',
//             })
//         })
//         .then((landlord) => {
//             if (!landlord)
//                 throw new Error(
//                     `Landlord is not found in the landlords' collection`
//                 )
//             console.log(landlord)
//             const contractDetails = {
//                 contractData,
//                 agentName: userData.fullName,
//                 agentPhoneNumber: userData.phone,
//                 agentEmail: userData.email,
//                 landlordName: landlord._id.fullName,
//                 landlordPhoneNumber: landlord._id.phone,
//                 landlordEmail: landlord._id.email,
//             }
//             console.log(contractDetails)
//             notifyLandlord('book_unit', contractDetails)
//             response
//                 .status(200)
//                 .json(
//                     'An email has been sent successfully to the landlord to confirm the booking.'
//                 )
//         })

//         .catch((error) => next(error))
// }

// TODO still not completed
// module.exports.confirmBookingUnit = (request, response, next) => {
//     let contractData
//     let agentData
//     let landlordData

//     ContractModel.findOne({ _id: request.params.id })
//         .then((contract) => {
//             // console.log(contract)
//             if (!contract) throw new Error(`Contract not found`)
//             // contract.state = 'active'
//             contractData = contract
//             console.log(contractData)
//             // contract.save()

//             return ContractModel.find(
//                 { unitId: contractData.unitId, state: 'active' },
//                 { rentalStart: 1, rentalEnd: 1 },
//                 { new: true }
//             )
//         })
//         .then((unitContracts) => {
//             console.log(unitContracts)
//             if (unitContracts.length === 0) {
//                 contractData.state = 'active'
//                 contractData.save()
//             }

//             let unavailableUnitDates = []
//             unitContracts.forEach((contract) => {
//                 unavailableUnitDates = getDatesRange(
//                     contract.rentalStart,
//                     contract.rentalEnd
//                 )
//             })
//             console.log(unavailableUnitDates)
//             // console.log(
//             //     new Date(contractData.rentalStart)
//             //         .toISOString()
//             //         .substring(0, 10)
//             // )
//             if (
//                 unavailableUnitDates.includes(
//                     new Date(contractData.rentalStart)
//                         .toISOString()
//                         .substring(0, 10)
//                 )
//             ) {
//                 throw new Error(`There is another contract have that start day`)
//             }

//             if (
//                 unavailableUnitDates.includes(
//                     new Date(contractData.rentalEnd)
//                         .toISOString()
//                         .substring(0, 10)
//                 )
//             ) {
//                 throw new Error(`There is another contract have that end day`)
//             }
//             if (
//                 unavailableUnitDates.includes(
//                     new Date(contractData.rentalEnd)
//                         .toISOString()
//                         .substring(0, 10)
//                 ) &&
//                 unavailableUnitDates.includes(
//                     new Date(contractData.rentalStart)
//                         .toISOString()
//                         .substring(0, 10)
//                 )
//             ) {
//                 throw new Error(
//                     `You can't confirm this contract as its start& end dates aren't available`
//                 )
//             }
//             //! check if the unavailable dates of unit contains any of the dates of new contract range dates
//             let newContractRange = []
//             newContractRange = getDatesRange(
//                 contractData.rentalStart,
//                 contractData.rentalEnd
//             )
//             console.log(newContractRange)
//         })

//         .catch((error) => next(error))
// }
