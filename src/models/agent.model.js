const mongoose = require("mongoose");

// console.log(mongoose.model())

//some property lose
// const addressschema = new mongoose.schema({

const schema = new mongoose.Schema({
	// const schema = new mongoose.schema({
	_id: {
		type: mongoose.Types.ObjectId,
		ref: "users",
	},

	//error===>see again
	agentUnits: {
		type: [
			{
				unitId: { type: mongoose.Types.ObjectId, ref: "units" },
				numberOfRenting: { type: Number },
			},
		],

		required: true,
	},

	favoriteUnits: [
		{
			type: mongoose.Types.ObjectId,
			ref: "units",
		},
	],
});

module.exports = mongoose.model("agents", schema);
