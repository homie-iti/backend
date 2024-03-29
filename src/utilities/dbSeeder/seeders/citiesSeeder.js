const { faker } = require('@faker-js/faker')
const mongoose = require('mongoose')

require('../../../models/cityModel')

const { generateCityImage } = require('../apiDataGrabber')

function randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
}

async function seedCities(numberOfDocuments) {
    const collection = mongoose.model('cities')
    // await mongoose.connection.db.dropCollection('cities')
    await collection.deleteMany({})

    const data = []
    const ids = []
    for (let i = 0; i < numberOfDocuments; i++) {
        const _id = mongoose.Types.ObjectId(
            faker.unique(faker.database.mongodbObjectId)
        )
        const name = faker.address.state()
        const cover = (await generateCityImage(name))[0].src.large
        const units = []

        ids.push(_id)
        data.push({
            _id,
            name,
            cover,
            units,
        })
    }

    await collection.insertMany(data)
    return ids
}

async function addUnitsToCities(unitsIds) {
    const collection = mongoose.model('cities')
    const cities = await collection.find({})

    cities.forEach(async (city) => {
        const unitsStart = randomIntFromInterval(0, unitsIds.length - 101)
        const unitsEnd = unitsStart + randomIntFromInterval(0, 100)

        let slicedUnits = unitsIds.slice(unitsStart, unitsEnd)
        slicedUnits = slicedUnits.map((unitId) =>
            mongoose.Types.ObjectId(unitId)
        )

        city.units = slicedUnits
        await city.save()
    })
}

module.exports = seedCities
module.exports.addUnitsToCities = addUnitsToCities
