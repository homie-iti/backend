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

require("../../models/addressModel");
// require("../../models/admin.model");
require("../../models/agentModel");
// require("../../models/city.model");
require("../../models/contractModel");
// require("../../models/helpQuestion.model");
require("../../models/landlordModel");
require("../../models/reviewModel");
// require("../../models/unit.model");
// require("../../models/user.model");

const collectionsIds = {
  adminsIds: [],
  usersIds: [],
  helpQuestionsIds: [],
  citiesIds: [],
  unitsIds: [],
};

async function seedDB() {
  console.log("Don't close DB connection while seeding.");
  console.log("----------------------");
  try {
    collectionsIds.adminsIds = [...(await seedAdmins(10))];
    console.log("+ admins seeded");

    collectionsIds.usersIds = [...(await seedUsers(1000))];
    console.log("+ users seeded");

    collectionsIds.helpQuestionsIds = [
      ...(await seedHelpQuestions(
        500,
        collectionsIds.adminsIds,
        collectionsIds.usersIds
      )),
    ];
    console.log("+ help questions seeded");

    collectionsIds.citiesIds = [...(await seedCities(50))];
    console.log("+ cities seeded");

    collectionsIds.unitsIds = [
      ...(await seedUnits(
        800,
        collectionsIds.usersIds,
        collectionsIds.citiesIds
      )),
    ];
    addUnitsToCities(collectionsIds.unitsIds);
    console.log("+ units seeded");

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
