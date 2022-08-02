const { faker } = require('@faker-js/faker')
const mongoose = require('mongoose')

require('../../../models/unitModel')

const { generateApartmentImage } = require('../apiDataGrabber')

function randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
}

async function getUnitsImages(numberOfDocuments, numberOfImagesPerUnit) {
    // console.log(await generateApartmentImage(1, 'apartment furniture inside'))

    const apiImagesMaximum = 80
    const numberOfNeededRequests = Math.ceil(
        (numberOfDocuments * numberOfImagesPerUnit) / apiImagesMaximum
    )
    const requestsArray = new Array(numberOfNeededRequests)
        .fill(1)
        .map((_, index) =>
            generateApartmentImage(index + 1, 'apartment furniture inside')
        )
    // console.log({ requestsArray })

    const response = await Promise.allSettled(requestsArray)
    // console.log({ response })

    const imagesArray = response
        .reduce((acc, curr, index) => {
            // if (!curr.value) console.log({ curr, index })
            acc = [...acc, ...curr.value]
            return acc
        }, [])
        .map((curr) => curr.src.landscape)

    // console.log(imagesArray.length)

    const apartmentsImagesArray = []

    for (let i = 0; i < imagesArray.length / numberOfImagesPerUnit; i++) {
        const apartment = {}
        apartment.cover = imagesArray[i * numberOfImagesPerUnit]
        apartment.images = [
            imagesArray[i * numberOfImagesPerUnit + 1],
            imagesArray[i * numberOfImagesPerUnit + 2],
            imagesArray[i * numberOfImagesPerUnit + 3],
            imagesArray[i * numberOfImagesPerUnit + 4],
        ]
        apartmentsImagesArray.push(apartment)
    }

    return apartmentsImagesArray
}

async function seedUnits(numberOfDocuments, usersIds, citiesIds) {
    const collection = mongoose.model('units')
    await mongoose.connection.db.dropCollection('units')
    // collection.drop();

    const unitsImages = await getUnitsImages(numberOfDocuments, 5)
    // console.log(unitsImages)
    // console.log(unitsImages.length)

    const data = []
    const ids = []
    for (let i = 0; i < numberOfDocuments; i++) {
        // console.log(i)
        // console.log(unitsImages[i])

        const _id = mongoose.Types.ObjectId(
            faker.unique(faker.database.mongodbObjectId)
        )
        const landlordId = mongoose.Types.ObjectId(
            usersIds[randomIntFromInterval(0, usersIds.length - 1)]
        )
        const cityId = mongoose.Types.ObjectId(
            citiesIds[randomIntFromInterval(0, citiesIds.length - 1)]
        )
        const estateType = [
            'studio',
            'shared-room',
            'single-room',
            'apartment',
        ][randomIntFromInterval(0, 3)]
        const allowedGender = ['male', 'female', 'any'][
            randomIntFromInterval(0, 2)
        ]
        const address = {
            city: faker.address.cityName(),
            streetName: faker.address.street(),
            buildingNumber: faker.address.buildingNumber(),
        }

        const dailyPrice = faker.commerce.price()
        const isAvailable = faker.datatype.boolean()
        const { cover } = unitsImages[i]
        const { images } = unitsImages[i]
        const isPetsAllowed = faker.datatype.boolean()
        const numberOfResidents = randomIntFromInterval(1, 5)

        const unitInfo = {
            description: faker.lorem.paragraphs(randomIntFromInterval(1, 3)),
            rooms: randomIntFromInterval(1, 4),
            bathrooms: randomIntFromInterval(1, 3),
            floor: randomIntFromInterval(1, 15),
        }

        const geoLocation = {
            type: 'Point',
            coordinates: [faker.address.latitude(), faker.address.longitude()],
        }

        ids.push(_id)
        data.push({
            _id,
            landlordId,
            cityId,
            estateType,
            dailyPrice,
            isPetsAllowed,
            isAvailable,
            unitInfo,
            cover,
            images,
            address,
            numberOfResidents,
            allowedGender,
            geoLocation,
        })
    }

    await collection.insertMany(data)
    return ids
}

module.exports = seedUnits
