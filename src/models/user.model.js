const mongoose = require("mongoose");
const addressSchema = require("./address.model");
//some property lose
const schema = new mongoose.Schema(
	{
		_id: {
			type: mongoose.Types.ObjectId,
		},

		fullName: {
			type: String,
			required: [true, "Please add a name"],
		},
		age: {
			type: Number,
			min: 18,
			required: [true, "Please add an age"],
		},
		email: {
			type: String,
			unique: true,
			required: [true, "Please add an email"],
			// match:{}
		},
		gender: {
			type: String,
			enum: ["male", "female"],
			required: [true, "Please add a gender"],
		},
		password: {
			type: String,
			required: [true, "Please add a password"],
		},
		phone: { type: String, required: [true, "Please add a phone number"] },
		national_id: {
			type: Number,
			required: [true, "Please add a national id"],
			unique: true,
		},
		image: { type: String },

		address: addressSchema,
	},
	{ timestamps: true }
);
mongoose.model("users", schema);
