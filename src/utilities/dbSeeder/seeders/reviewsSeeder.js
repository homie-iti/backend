const { faker } = require("@faker-js/faker");
const mongoose = require("mongoose");

require("../../../models/reviewModel");

function randomIntFromInterval(min, max) {
	// min and max included
	return Math.floor(Math.random() * (max - min + 1) + min);
}

async function seedReview(numberOfDocuments, usersIds, unitsIds) {
	const collection = mongoose.model("reviews");
	await mongoose.connection.db.dropCollection("reviews");
	// collection.drop();

	let data = [];
	const ids = [];

	for (let i = 0; i < numberOfDocuments; i++) {
		const _id = mongoose.Types.ObjectId(
			faker.unique(faker.database.mongodbObjectId)
		);

		const agentId = usersIds[randomIntFromInterval(0, usersIds.length - 1)];

		const unitId = unitsIds[randomIntFromInterval(0, unitsIds.length - 1)];

		if (data.some((obj) => obj.agentId === agentId && obj.agentId === unitId))
			continue;

		const comment = faker.lorem.paragraph(1);
		const rating = randomIntFromInterval(1, 5);

		ids.push(_id);
		data.push({ _id, agentId, unitId, comment, rating });
	}

	await collection.insertMany(data);
	return ids;
}

module.exports = seedReview;
