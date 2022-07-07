/* mySeedScript.js */

// require the necessary libraries
const { faker } = require("@faker-js/faker");
const mongoose = require("mongoose");
require("dotenv").config();

const seedHelpQuestions = require("./seeders/helpQuestionsSeeder");
const seedAdmins = require("./seeders/adminsSeeder");
const seedUsers = require("./seeders/usersSeeder");
const seedCities = require("./seeders/citiesSeeder");
const { addUnitsToCities } = require("./seeders/citiesSeeder");
const seedUnits = require("./seeders/unitsSeeder");
const seedAgents = require("./seeders/agentsSeeder");
const seedLandlords = require("./seeders/landlordsSeeder");

require("../../models/addressModel");
require("../../models/adminModel");
require("../../models/agentModel");
require("../../models/cityModel");
require("../../models/contractModel");
require("../../models/helpQuestionModel");
require("../../models/landlordModel");
require("../../models/reviewModel");
require("../../models/unitModel");
require("../../models/userModel");

const collectionsIds = {
	adminsIds: [],
	usersIds: [],
	helpQuestionsIds: [],
	citiesIds: [],
	unitsIds: [],
	landlordsIds: [],
};

async function seedDB() {
	console.log("Don't close DB connection while seeding.");
	console.log("----------------------");
	try {
		console.log("- started admins seeding");
		collectionsIds.adminsIds = [...(await seedAdmins(10))];
		console.log("+ admins seeded");

		console.log("..");

		console.log("- started users seeding");
		collectionsIds.usersIds = [...(await seedUsers(1000))];
		console.log("+ users seeded");

		console.log("..");

		console.log("- started help questions seeding");
		collectionsIds.helpQuestionsIds = [
			...(await seedHelpQuestions(
				500,
				collectionsIds.adminsIds,
				collectionsIds.usersIds
			)),
		];
		console.log("+ help questions seeded");

		console.log("..");

		console.log("- started cities seeding");
		collectionsIds.citiesIds = [...(await seedCities(50))];
		console.log("+ cities seeded");

		console.log("..");

		console.log("- started units seeding");
		collectionsIds.unitsIds = [
			...(await seedUnits(
				800,
				collectionsIds.usersIds,
				collectionsIds.citiesIds
			)),
		];
		addUnitsToCities(collectionsIds.unitsIds);
		console.log("+ units seeded");

		console.log("..");

		console.log("- started agents seeding");
		collectionsIds.agentsIds = [
			...(await seedAgents(
				30,
				collectionsIds.usersIds,
				collectionsIds.unitsIds
			)),
		];
		console.log("+ agents seeded");

		console.log("..");

		console.log("- started landlords seeding");
		collectionsIds.landlordsIds = [
			...(await seedLandlords(
				30,
				collectionsIds.usersIds,
				collectionsIds.unitsIds
			)),
		];
		console.log("+ landlords seeded");

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
		// process.exit();
	} catch (error) {
		console.log("DB Connection Error", error);
	}
})();
