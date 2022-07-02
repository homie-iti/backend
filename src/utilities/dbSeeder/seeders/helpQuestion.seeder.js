const { faker } = require("@faker-js/faker");
const mongoose = require("mongoose");

require("../../../models/helpQuestion.model");

function randomIntFromInterval(min, max) {
	// min and max included
	return Math.floor(Math.random() * (max - min + 1) + min);
}

async function seedHelpQuestion(numberOfDocuments, adminsIds) {
	const collection = mongoose.model("helpQuestions");
	mongoose.connection.db.dropCollection("helpquestions");
	// collection.drop();

	let data = [];
	const ids = [];

	for (let i = 0; i < numberOfDocuments; i++) {
		const _id = faker.database.mongodbObjectId();
		const userId = faker.database.mongodbObjectId();
		const adminId = adminsIds[randomIntFromInterval(0, adminsIds.length)];
		const question = faker.lorem.sentence().slice(0, -1) + "?";
		const answer = faker.lorem.paragraph(1);

		ids.push(_id);
		data.push({ _id, userId, adminId, question, answer });
	}

	collection.insertMany(data);
	return ids;
}

module.exports = seedHelpQuestion;
