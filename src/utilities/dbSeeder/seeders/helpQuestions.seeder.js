const { faker } = require("@faker-js/faker");
const mongoose = require("mongoose");

require("../../../models/helpQuestion.model");

function randomIntFromInterval(min, max) {
	// min and max included
	return Math.floor(Math.random() * (max - min + 1) + min);
}

async function seedHelpQuestion(numberOfDocuments, adminsIds, usersIds) {
	const collection = mongoose.model("helpQuestions");
	await mongoose.connection.db.dropCollection("helpquestions");
	// collection.drop();

	let data = [];
	const ids = [];

	for (let i = 0; i < numberOfDocuments; i++) {
		const _id = mongoose.Types.ObjectId(
			faker.unique(faker.database.mongodbObjectId)
		);
		const userId = mongoose.Types.ObjectId(
			usersIds[randomIntFromInterval(0, usersIds.length)]
		);
		const adminId = mongoose.Types.ObjectId(
			adminsIds[randomIntFromInterval(0, adminsIds.length)]
		);
		const question = faker.lorem.sentence().slice(0, -1) + "?";
		const answer = faker.lorem.paragraph(1);

		ids.push(_id);
		data.push({ _id, userId, adminId, question, answer });
	}

	await collection.insertMany(data);
	return ids;
}

module.exports = seedHelpQuestion;
