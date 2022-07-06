const mongoose = require("mongoose");

const schema = new mongoose.Schema({
	_id: {
		type: mongoose.Types.ObjectId,
	},

	cityName: {
		type: String,
		required: [true, "city cityName is required"],
	},
	// you need sure
	//{
	units:
		// type:
		[{ type: mongoose.Types.ObjectId, ref: "units" }],
	// ,
	// required: [true, "city units is required"], TODO ask the team for their opinion
	// },
});

mongoose.model("cities", schema);