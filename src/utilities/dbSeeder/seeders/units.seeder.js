const { faker } = require("@faker-js/faker");
const mongoose = require("mongoose");

require("../../../models/unit.model");

function randomIntFromInterval(min, max) {
	// min and max included
	return Math.floor(Math.random() * (max - min + 1) + min);
}

async function seedUnits(numberOfDocuments, usersIds, citiesIds) {
	const collection = mongoose.model("units");
	await mongoose.connection.db.dropCollection("units");
	// collection.drop();

	let data = [];
	const ids = [];
	for (let i = 0; i < numberOfDocuments; i++) {
		const _id = mongoose.Types.ObjectId(
			faker.unique(faker.database.mongodbObjectId)
		);
		const landlordId = mongoose.Types.ObjectId(
			usersIds[randomIntFromInterval(0, usersIds.length)]
		);
		const cities = mongoose.Types.ObjectId(
			citiesIds[randomIntFromInterval(0, citiesIds.length)]
		);
		const estateType = ["studio", "shared-room", "single-room", "apartment"][
			randomIntFromInterval(0, 3)
		];
		const address = {
			city: faker.address.cityName(),
			streetName: faker.address.street(),
			buildingNumber: faker.address.buildingNumber(),
		};

		const dailyPrice = faker.commerce.price();
		const isAvailable = faker.datatype.boolean();
		const images = new Array(randomIntFromInterval(2, 14)).fill(
			faker.internet.avatar()
		);
		const isPetsAllowed = faker.datatype.boolean();
		const numberOfResidents = randomIntFromInterval(1, 5);

		const unitInfo = {
			description: faker.lorem.paragraphs(randomIntFromInterval(1, 3)),
			rooms: randomIntFromInterval(1, 4),
			bathrooms: randomIntFromInterval(1, 3),
			floor: randomIntFromInterval(1, 15),
		};

		ids.push(_id);
		data.push({
			_id,
			landlordId,
			cities,
			estateType,
			dailyPrice,
			isPetsAllowed,
			isAvailable,
			unitInfo,
			images,
			address,
			numberOfResidents,
		});
	}

	await collection.insertMany(data);
	return ids;
}

module.exports = seedUnits;
