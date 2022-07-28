const { faker } = require('@faker-js/faker')
const mongoose = require('mongoose')
const { addLandlordOrAgent } = require('./usersSeeder.js')

require('../../../models/landlordModel')

function randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
}

async function seedLandlord(numberOfDocuments, usersIds, unitsIds) {
    const collection = mongoose.model('landlords')
    await mongoose.connection.db.dropCollection('landlords')
    // collection.drop();

    const data = []
    const ids = []
    for (let i = 0; i < numberOfDocuments; i++) {
        const _id = usersIds[randomIntFromInterval(0, usersIds.length - 1)]

        if (
            ids.some((id) => {
                return _id === id
            })
        )
            continue

        addLandlordOrAgent(_id, 'isLandlord')

        const landlordUnitsRandomNumber = randomIntFromInterval(0, 20)
        const landlordUnits = []
        for (let i = 0; i <= landlordUnitsRandomNumber; i++) {
            const selectedUnit =
                unitsIds[randomIntFromInterval(0, unitsIds.length - 1)]
            landlordUnits.push(selectedUnit)
        }

        ids.push(_id)
        data.push({
            _id,
            landlordUnits,
        })
    }

    await collection.insertMany(data)
    return ids
}

module.exports = seedLandlord
