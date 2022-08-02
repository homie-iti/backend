const { faker } = require('@faker-js/faker')
const mongoose = require('mongoose')
const { addLandlordOrAgent } = require('./usersSeeder.js')

require('../../../models/agentModel')

function randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
}

async function seedAgent(numberOfDocuments, usersIds, unitsIds) {
    const collection = mongoose.model('agents')
    // await mongoose.connection.db.dropCollection('agents')
    // collection.drop();
    await collection.deleteMany({})

    const data = []
    const ids = []

    for (let i = 0; i < numberOfDocuments; i++) {
        const _id = usersIds[randomIntFromInterval(0, usersIds.length - 1)]

        if (ids.some((id) => _id === id)) continue

        // console.log(_id);

        addLandlordOrAgent(_id, 'isAgent')

        const agentUnitsRandomNumber = randomIntFromInterval(1, 10)
        const agentUnits = []
        for (let j = 0; j <= agentUnitsRandomNumber; j++) {
            const selectedUnit =
                unitsIds[randomIntFromInterval(0, unitsIds.length - 1)]
            const rentingCounter = randomIntFromInterval(1, 5)
            agentUnits.push({
                unitId: selectedUnit,
                numberOfRenting: rentingCounter,
            })
        }

        // const favoriteUnitsRandomNumber = randomIntFromInterval(0, 20);
        // const favoriteUnits = [];
        // for (let i = 0; i <= favoriteUnitsRandomNumber; i++) {
        // 	const selectedUnit =
        // 		unitsIds[randomIntFromInterval(0, unitsIds.length - 1)];
        // 	favoriteUnits.push(selectedUnit);
        // }

        ids.push(_id)
        data.push({
            _id,
            agentUnits,
            // favoriteUnits,
        })
    }

    await collection.insertMany(data)
    return ids
}

module.exports = seedAgent
