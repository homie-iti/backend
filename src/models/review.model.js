const mongoose = require("mongoose");
//some property lose
const schema = new mongoose.Schema(
	{
		_id: {
			type: mongoose.Types.ObjectId,
		},
		agentId: {
			type: mongoose.Types.ObjectId,
			ref: "agents",
			required: true,
		},
		unitId: {
			type: mongoose.Types.ObjectId,
			ref: "units",
			required: true,
		},
		comment: {
			type: String,
			required: true,
		},
		rating: {
			type: Number,
			required: true,
			min: 1,
			max: 5,
		},
	},
	{ timestamps: true }
);

mongoose.model("reviews", schema);
