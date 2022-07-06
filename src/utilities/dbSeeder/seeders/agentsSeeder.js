const { faker } = require("@faker-js/faker");
const mongoose = require("mongoose");

require("../../../models/agentModel");

function randomIntFromInterval(min, max) {
	// min and max included
	return Math.floor(Math.random() * (max - min + 1) + min);
}

async function seedAgent(numberOfDocuments, unitsIds) {
	const collection = mongoose.model("agents");
	await mongoose.connection.db.dropCollection("agents");
	// collection.drop();

	let data = [];
	const ids = [];
	for (let i = 0; i < numberOfDocuments; i++) {
		const _id = mongoose.Types.ObjectId(
			faker.unique(faker.database.mongodbObjectId)
		);

		const agentUnitsRandomNumber = randomIntFromInterval(1, 10);
		const agentUnits = [];
		for (let i = 0; i <= agentUnitsRandomNumber; i++) {
			const selectedUnit =
				unitsIds[randomIntFromInterval(0, unitsIds.length - 1)];
			const rentingCounter = randomIntFromInterval(1, 5);
			agentUnits.push({
				unitId: selectedUnit,
				numberOfRenting: rentingCounter,
			});
		}

		const favoriteUnitsRandomNumber = randomIntFromInterval(0, 20);
		const favoriteUnits = [];
		for (let i = 0; i <= favoriteUnitsRandomNumber; i++) {
			const selectedUnit =
				unitsIds[randomIntFromInterval(0, unitsIds.length - 1)];
			favoriteUnits.push(selectedUnit);
		}

		ids.push(_id);
		data.push({
			_id,
			agentUnits,
			favoriteUnits,
		});
	}

	await collection.insertMany(data);
	return ids;
}

module.exports = seedAgent;
