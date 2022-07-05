const { faker } = require("@faker-js/faker");
const mongoose = require("mongoose");

require("../../../models/user.model");

async function seedUsers(numberOfDocuments) {
	const collection = mongoose.model("users");
	await mongoose.connection.db.dropCollection("users");
	// collection.drop();

	let data = [];
	const ids = [];
	for (let i = 0; i < numberOfDocuments; i++) {
		const _id = mongoose.Types.ObjectId(
			faker.unique(faker.database.mongodbObjectId)
		);
		const firstName = faker.name.firstName();
		const lastName = faker.name.lastName();
		const fullName = faker.name.firstName() + " " + faker.name.lastName();
		const age = faker.mersenne.rand(45, 20);
		const email = faker.internet.email(firstName, lastName);
		const gender = age % 2 >= 0 ? "male" : "female";
		const password = faker.internet.password();
		const phone = faker.phone.number("01#########");
		const national_id = faker.phone.number("##############");
		const image = faker.internet.avatar();
		const address = {
			city: faker.address.cityName(),
			streetName: faker.address.street(),
			buildingNumber: faker.address.buildingNumber(),
		};

		ids.push(_id);
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
		});
	}

	await collection.insertMany(data);
	return ids;
}

module.exports = seedUsers;
