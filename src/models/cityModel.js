const mongoose = require("mongoose");

const schema = new mongoose.Schema({
	cover: {
		type: String,
	},

<<<<<<< HEAD
  cover: {
    type: String,
  },
  name: {
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
=======
	name: {
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
>>>>>>> origin/main
});

mongoose.model("cities", schema);
