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
			required: [true, "review agentId is required"],
		},
		unitId: {
			type: mongoose.Types.ObjectId,
			ref: "units",
			required: [true, "review unitId is required"],
		},
		comment: {
			type: String,
			required: [true, "review comment is required"],
		},
		rating: {
			type: Number,
			required: [true, "review rating is required"],
			min: 1,
			max: 5,
		},
	},
	{ timestamps: true }
);

mongoose.model("reviews", schema);
