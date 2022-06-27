const mongoose = require("mongoose");
//some property lose
const schema = new mongoose.Schema(
	{
		_id: {
			type: mongoose.Types.ObjectId,
		},
		userId: {
			type: mongoose.Types.ObjectId,
			ref: "users",
			required: true,
		},
		adminId: {
			type: mongoose.Types.ObjectId,
			ref: "users",
		},
		question: {
			type: String,
			required: true,
		},
		answer: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

mongoose.model("helpQuestions", schema);
