const mongoose = require("mongoose");
// const addressSchema = require("../Model/address.model");
const schema = new mongoose.Schema(
	{
		_id: mongoose.Types.ObjectId,
		landlordId: {
			type: mongoose.Types.ObjectId,
			ref: "landlords",
			required: [true, "contract landlordId is required"],
		},
		agentId: {
			type: mongoose.Types.ObjectId,
			ref: "agents",
			required: [true, "contract agentId is required"],
		},

		unitId: {
			type: mongoose.Types.ObjectId,
			ref: "units",
			required: [true, "contract unitId is required"],
		},

		rentalStart: {
			type: Date,
			required: [true, "contract rentalStart is required"],
		},
		rentalEnd: {
			type: Date,
			required: [true, "contract rentalEnd is required"],
		},
		paymentAmount: {
			type: Number,
			required: [true, "contract paymentAmount is required"],
		},
		// contractType: {},
		paymentMethod: {
			type: String,
			enum: ["paypal", "bank", "cash"],
			required: [true, "contract paymentMethod is required"],
		},
		totalAmount: {
			type: Number,
			required: [true, "contract totalAmount is required"],
		},
		offerPercentage: {
			type: Number,
			required: [true, "contract offerPercentage is required"],
		},
	},
	{ timestamps: true }
);
mongoose.model("contracts", schema);
