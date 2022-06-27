const mongoose = require("mongoose");
const addressSchema = require("./address.model");
const schema = new mongoose.Schema(
	{
		_id: mongoose.Types.ObjectId,
		landlordId: {
			type: mongoose.Types.ObjectId,
			ref: "landlords",
			required: [true, "Please add the landlord id."],
		},
		agentId: { type: mongoose.Types.ObjectId, ref: "agents" },
		cities: {
			type: mongoose.Types.ObjectId,
			ref: "cities",
			required: [true, "Please add the unit city."],
		},
		estateType: {
			type: String,
			required: [true, "Please add the unit type."],
			enum: ["studio", "shared-room", "single-room", "apartment"], // TODO we need to check if these are all the
		},
		address: {
			type: addressSchema,
			required: [true, "Please add the unit address."],
		},
		dailyPrice: {
			type: Number,
			required: [true, "Please add the unit daily price."],
		},
		isAvailable: Boolean,
		images: [{ type: String, required: [true, "Please add the unit images."] }],
		isPetsAllowed: Boolean,
		numberOfResidents: {
			type: Number,
			required: [true, "Please add the allowed number of residents."],
		},
		unitInfo: {
			description: {
				type: String,
				required: [true, "Please add the unit description."],
			},
			rooms: { type: Number, required: [true, "Please add the unit rooms."] },
			bathrooms: {
				type: Number,
				required: [true, "Please add the unit bathrooms."],
			},
			floor: { type: Number, required: [true, "Please add the unit floor."] },
		},
	},
	{ timestamps: true }
);
mongoose.model("units", schema);
