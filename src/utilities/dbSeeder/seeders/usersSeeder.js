const { faker } = require('@faker-js/faker')
const mongoose = require('mongoose')

require('../../../models/userModel')

const { generateAvatarImage } = require('../apiDataGrabber')

function randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
}

async function getUsersImages(numberOfDocuments) {
    const apiImagesMaximum = 30
    const numberOfNeededRequests = Math.ceil(
        numberOfDocuments / apiImagesMaximum
    )
    const requestsArray = new Array(numberOfNeededRequests)
        .fill(1)
        .map((_, index) => generateAvatarImage(index + 1, 'human'))
    // console.log({ requestsArray })

    const response = await Promise.allSettled(requestsArray)
    // console.log({ response })

    const imagesArray = response
        .reduce((acc, curr, index) => {
            // if (!curr.value) console.log({ curr, index })
            acc = [...acc, ...curr.value]
            return acc
        }, [])
        .map((curr) => curr.urls.small_s3)

    // console.log(imagesArray)
    // console.log(imagesArray.length)

    return imagesArray
}

async function seedUsers(numberOfDocuments) {
    const collection = mongoose.model('users')
    // await mongoose.connection.db.dropCollection('users')
    // collection.drop();
    await collection.deleteMany({})

    const avatars = await getUsersImages(numberOfDocuments)

    const data = []
    const ids = []
    for (let i = 0; i < numberOfDocuments; i++) {
        const _id = mongoose.Types.ObjectId(
            faker.unique(faker.database.mongodbObjectId)
        )
        const firstName = faker.name.firstName()
        const lastName = faker.name.lastName()
        const fullName = `${faker.name.firstName()} ${faker.name.lastName()}`
        const age = faker.mersenne.rand(45, 20)
        const email = faker.internet.email(firstName, lastName)
        const gender = age % 2 === 0 ? 'male' : 'female'
        const password = '1234@aBcD'
        const phone = faker.phone.number('01#########')
        const national_id = faker.phone.number('##############')
        const image = avatars[i]
        const address = {
            city: faker.address.cityName(),
            streetName: faker.address.street(),
            buildingNumber: faker.address.buildingNumber(),
        }

        // const favoriteUnitsRandomNumber = randomIntFromInterval(0, 20);
        const favoriteUnits = []
        // for (let i = 0; i <= favoriteUnitsRandomNumber; i++) {
        // 	const selectedUnit =
        // 		unitsIds[randomIntFromInterval(0, unitsIds.length - 1)];
        // 	favoriteUnits.push(selectedUnit);
        // }

        ids.push(_id)
        data.push({
            _id,
            fullName,
            age,
            email,
            gender,
            password,
            phone,
            national_id,
            image,
            address,
            favoriteUnits,
        })
    }

    await collection.insertMany(data)
    return ids
}

async function addLandlordOrAgent(id, type) {
    const collection = mongoose.model('users')
    const user = await collection.findOne({ _id: id })

    user[type] = true
    await user.save()

    // cities.forEach(async (city) => {
    // 	const unitsStart = randomIntFromInterval(0, unitsIds.length - 101);
    // 	const unitsEnd = unitsStart + randomIntFromInterval(0, 100);

    // 	let slicedUnits = unitsIds.slice(unitsStart, unitsEnd);
    // 	slicedUnits = slicedUnits.map((unitId) => mongoose.Types.ObjectId(unitId));

    // 	city.units = slicedUnits;
    // 	await city.save();
    // });
}

async function addUserFavorites(unitsIds) {
    const collection = mongoose.model('users')
    const users = await collection.find({})

    users.forEach(async (user) => {
        const favoriteUnitsRandomNumber = randomIntFromInterval(0, 20)
        // const favoriteUnits = [];
        // user.favoriteUnits = favoriteUnits;
        for (let i = 0; i <= favoriteUnitsRandomNumber; i++) {
            const selectedUnit =
                unitsIds[randomIntFromInterval(0, unitsIds.length - 1)]
            user.favoriteUnits.push(selectedUnit)
            await user.save()
        }
    })

    // await mongoose.connection.db.dropCollection("users");
    // await collection.
}

module.exports = seedUsers
module.exports.addLandlordOrAgent = addLandlordOrAgent
module.exports.addUserFavorites = addUserFavorites
