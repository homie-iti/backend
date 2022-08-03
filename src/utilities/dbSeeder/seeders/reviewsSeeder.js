const { faker } = require('@faker-js/faker')
const mongoose = require('mongoose')

const { addReviewToUnit } = require('./unitsSeeder')

require('../../../models/reviewModel')

function randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
}

async function seedReview(numberOfDocuments, agentsIds, unitsIds) {
    const collection = mongoose.model('reviews')
    // await mongoose.connection.db.dropCollection('reviews')
    // collection.drop();
    await collection.deleteMany({})

    const data = []
    const ids = []

    for (let i = 0; i < numberOfDocuments; i++) {
        const _id = mongoose.Types.ObjectId(
            faker.unique(faker.database.mongodbObjectId)
        )

        const agentId =
            agentsIds[randomIntFromInterval(0, agentsIds.length - 1)]

        const unitId = unitsIds[randomIntFromInterval(0, unitsIds.length - 1)]

        if (
            data.some(
                (obj) => obj.agentId === agentId && obj.agentId === unitId
            )
        )
            continue

        const comment = faker.lorem.paragraph(1)
        const rating = randomIntFromInterval(1, 5)

        ids.push(_id)
        data.push({
            _id,
            agentId,
            unitId,
            comment,
            rating,
        })
    }

    addReviewToUnit(data)

    await collection.insertMany(data)
    return ids
}

module.exports = seedReview
