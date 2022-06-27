const mongoose = require("mongoose");
//some property lose
const schema = new mongoose.Schema({
	_id: {
		type: mongoose.Types.ObjectId,
	},
	fullName: {
		type: String,
		required: [true, "admin name is required"],
	},
	age: {
		type: Number,
		min: 18,
		required: [true, "admin age is required"],
	},
	email: {
		type: String,
		unique: true,
		required: [true, "admin email is required"],
		// match:{}
	},
	password: {
		type: String,
		required: [true, "admin password is required"],
	},
	phone: { type: String, required: [true, "admin phone number is required"] },
	national_id: {
		type: Number,
		unique: true,
		required: [true, "admin national id number is required"],
	},
	image: { type: String },
});

module.exports = mongoose.model("admins", schema);
