const mongoose = require("mongoose");
// const addressSchema = require("../Model/address.model");
const schema = new mongoose.Schema(
	{
		_id: mongoose.Types.ObjectId,
		landlordId: {
			type: mongoose.Types.ObjectId,
			ref: "landlords",
			required: true,
		},
		agentId: { type: mongoose.Types.ObjectId, ref: "agents", required: true },

		unitId: {
			type: mongoose.Types.ObjectId,
			ref: "units",
			required: true,
		},

		rentalStart: {
			type: Date,
			required: true,
		},
		rentalEnd: {
			type: Date,
			required: true,
		},
		paymentAmount: {
			type: Number,
			required: true,
		},
		// contractType: {},
		paymentMethod: {
			type: String,
			required: true,
		},
		totalAmount: {
			type: Number,
			required: true,
		},
		offerPercentage: {
			type: Number,
			required: true,
		},
	},
	{ timestamps: true }
);
mongoose.model("contracts", schema);
