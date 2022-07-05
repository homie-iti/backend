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
			required: [true, "help question userId is required"],
		},
		adminId: {
			type: mongoose.Types.ObjectId,
			ref: "users",
		},
		question: {
			type: String,
			required: [true, "help question question is required"],
		},
		answer: {
			type: String,
			required: [true, "help question answer is required"],
		},
	},
	{ timestamps: true }
);

mongoose.model("helpQuestions", schema);
