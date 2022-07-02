/* mySeedScript.js */

// require the necessary libraries
const { faker } = require("@faker-js/faker");
const mongoose = require("mongoose");
require("dotenv").config();

const seedHelpQuestion = require("./seeders/helpQuestion.seeder");
const seedAdmin = require("./seeders/admin.seeder");

require("../../models/address.model");
// require("../../models/admin.model");
require("../../models/agent.model");
require("../../models/city.model");
require("../../models/contract.model");
// require("../../models/helpQuestion.model");
require("../../models/landlord.model");
require("../../models/review.model");
require("../../models/unit.model");
require("../../models/user.model");

const collectionsIds = {
	adminsIds: [],
	helpQuestionsIds: [],
};

async function seedDB() {
	console.log("Don't close DB connection while seeding.");
	console.log("----------------------");
	try {
		collectionsIds.adminsIds = [...(await seedAdmin(10))];
		console.log("+ admins seeded");

		collectionsIds.helpQuestionsIds = [
			...(await seedHelpQuestion(5000, collectionsIds.adminsIds)),
		];
		console.log("+ help questions seeded");

		console.log("----------------------");
		console.log("Database seeded! :)");
	} catch (error) {
		console.log("DB Seeding Error", error);
	}
}

const homieDB_URL = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

(async function () {
	try {
		await mongoose.connect(homieDB_URL);
		await seedDB();
		process.exit();
	} catch (error) {
		console.log("DB Connection Error", error);
	}
})();
