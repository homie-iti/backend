const { faker } = require("@faker-js/faker");
const mongoose = require("mongoose");

require("../../../models/contractModel");

function randomIntFromInterval(min, max) {
	// min and max included
	return Math.floor(Math.random() * (max - min + 1) + min);
}

async function seedContract(
	numberOfDocuments,
	landlordsIds,
	agentsIds,
	unitsIds
) {
	const collection = mongoose.model("contracts");
	await mongoose.connection.db.dropCollection("contracts");
	// collection.drop();

	let data = [];
	const ids = [];

	for (let i = 0; i < numberOfDocuments; i++) {
		const _id = mongoose.Types.ObjectId(
			faker.unique(faker.database.mongodbObjectId)
		);

		const landlordId =
			landlordsIds[randomIntFromInterval(0, landlordsIds.length - 1)];

		const agentId = agentsIds[randomIntFromInterval(0, agentsIds.length - 1)];

		const unitId = unitsIds[randomIntFromInterval(0, unitsIds.length - 1)];

		if (
			data.some(
				(obj) =>
					obj.landlordId === landlordId &&
					obj.agentId === agentId &&
					obj.agentId === unitId
			)
		)
			continue;

		const randNum = randomIntFromInterval(0, 2);
		let rentalStart;
		let rentalEnd;
		let paymentMethod;
		if (randNum === 0) {
			rentalStart = faker.date.soon();
			rentalEnd = faker.date.future();
			paymentMethod = "bank";
		} else if (randNum === 1) {
			rentalStart = faker.date.past();
			rentalEnd = faker.date.recent();
			paymentMethod = "cash";
		} else {
			rentalStart = faker.date.recent();
			rentalEnd = faker.date.soon();
			paymentMethod = "paypal";
		}

		const totalAmount = randomIntFromInterval(100, 5000);
		const offerPercentage = randomIntFromInterval(1, 50);
		const paymentAmount = totalAmount - (offerPercentage / 100) * totalAmount;

		ids.push(_id);
		data.push({
			_id,
			landlordId,
			agentId,
			unitId,
			rentalStart,
			rentalEnd,
			paymentMethod,
			totalAmount,
			offerPercentage,
			paymentAmount,
		});
	}

	await collection.insertMany(data);
	return ids;
}

module.exports = seedContract;
