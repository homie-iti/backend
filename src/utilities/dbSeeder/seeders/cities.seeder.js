const { faker } = require("@faker-js/faker");
const mongoose = require("mongoose");

require("../../../models/city.model");

function randomIntFromInterval(min, max) {
	// min and max included
	return Math.floor(Math.random() * (max - min + 1) + min);
}

async function seedCities(numberOfDocuments) {
	const collection = mongoose.model("cities");
	await mongoose.connection.db.dropCollection("cities");
	// collection.drop();

	let data = [];
	const ids = [];
	for (let i = 0; i < numberOfDocuments; i++) {
		const _id = faker.database.mongodbObjectId();
		const cityName = faker.address.cityName();
		const units = [];

		ids.push(_id);
		data.push({
			_id,
			cityName,
			units,
		});
	}

	await collection.insertMany(data);
	return ids;
}

async function addUnitsToCities(unitsIds) {
	const collection = mongoose.model("cities");
	// await mongoose.connection.db.dropCollection("cities");
	// collection.drop();
	const cities = await collection.find({});

	const newCities = cities.map((city) => {
		const unitsStart = randomIntFromInterval(0, unitsIds.length - 25);
		const unitsEnd = unitsStart + randomIntFromInterval(0, 24);

		const slicedUnits = unitsIds
			.slice(unitsStart, unitsEnd)
			.map((unitId) => mongoose.Types.ObjectId(unitId));

		city.units.push([...slicedUnits]);
		return city;
	});

	// let data = [];
	// const ids = [];
	// for (let i = 0; i < numberOfDocuments; i++) {
	// 	const _id = faker.database.mongodbObjectId();
	// 	const cityName = faker.address.cityName();
	// 	const units = [];

	// 	ids.push(_id);
	// 	data.push({
	// 		_id,
	// 		cityName,
	// 		units,
	// 	});
	// }

	await collection.insertMany(newCities);
	// return ids;
}

module.exports = seedCities;
module.exports.addUnitsToCities = addUnitsToCities;
