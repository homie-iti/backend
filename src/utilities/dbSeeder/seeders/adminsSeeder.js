const { faker } = require('@faker-js/faker')
const mongoose = require('mongoose')

require('../../../models/adminModel')

async function seedAdmin(numberOfDocuments) {
    const collection = mongoose.model('admins')
    await mongoose.connection.db.dropCollection('admins')
    // collection.drop();

    const data = [];
    const ids = []
    for (let i = 0; i < numberOfDocuments; i++) {
        const _id = mongoose.Types.ObjectId(
            faker.unique(faker.database.mongodbObjectId)
        )
        const firstName = faker.name.firstName()
        const lastName = faker.name.lastName()
        const fullName = `${faker.name.firstName()} ${faker.name.middleName()} ${faker.name.lastName()}`;

        if (
            !fullName.match(
                /^[A-Z][A-Za-z ]{3,}[A-Z][A-Za-z ]{3,}[A-Z][A-Za-z ]{3,}$/
            )
        ) {
        { continue }

        const age = faker.mersenne.rand(45, 20)
        const email = faker.internet.email(firstName, lastName)
        const password = faker.internet.password()
        const phone = faker.phone.number('012########')
        const national_id = parseInt(faker.phone.number('##############'))
        const image = faker.internet.avatar()

        ids.push(_id)
        data.push({
            _id: _id,
            fullName: fullName,
            age: age,
            email: email,
            password: password,
            phone: phone,
            national_id: national_id,
            image: image,
        })
    }

    await collection.insertMany(data)
    return ids
}

module.exports = seedAdmin
