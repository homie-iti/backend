const { faker } = require('@faker-js/faker')
const mongoose = require('mongoose')

require('../../../models/adminModel')

const { generateAvatarImage } = require('../apiDataGrabber')

async function seedAdmin(numberOfDocuments) {
    const collection = mongoose.model('admins')
    // await mongoose.connection.db.dropCollection('admins')
    await collection.deleteMany({})

    const data = []
    const ids = []
    for (let i = 0; i < numberOfDocuments; i++) {
        const _id = mongoose.Types.ObjectId(
            faker.unique(faker.database.mongodbObjectId)
        )
        const firstName = faker.name.firstName()
        const lastName = faker.name.lastName()
        const fullName = `${faker.name.firstName()} ${faker.name.middleName()} ${faker.name.lastName()}`

        if (
            !fullName.match(
                /^[A-Z][A-Za-z ]{3,}[A-Z][A-Za-z ]{3,}[A-Z][A-Za-z ]{3,}$/
            )
        )
            continue

        const age = faker.mersenne.rand(45, 20)
        const email = faker.internet.email(firstName, lastName)
        const password = '1234@aBcD'
        const phone = faker.phone.number('012########')
        const national_id = parseInt(faker.phone.number('##############'))
        const image = await generateAvatarImage()

        ids.push(_id)
        data.push({
            _id,
            fullName,
            age,
            email,
            password,
            phone,
            national_id,
            image,
        })
    }

    await collection.insertMany(data)
    return ids
}

module.exports = seedAdmin
