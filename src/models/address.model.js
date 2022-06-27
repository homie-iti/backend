const mongoose = require("mongoose");

const schema = new mongoose.Schema(
	{
		city: { type: String, required: true },
		streetName: { type: String, required: true },
		buildingNumber: { type: Number, required: true },
	},
	{ _id: false }
);

module.exports = schema;
