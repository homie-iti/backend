const mongoose = require("mongoose");
const addressSchema = require("./addressModel");
const schema = new mongoose.Schema(
  {
    _id: mongoose.Types.ObjectId,

    landlordId: {
      type: mongoose.Types.ObjectId,
      ref: "landlords",
      required: [true, "unit landlordId is required"],
    },

    agentId: { type: mongoose.Types.ObjectId, ref: "agents" },

    cityId: {
      type: mongoose.Types.ObjectId,
      ref: "cities",
      required: [true, "unit city is required"],
    },

    estateType: {
      type: String,
      required: [true, "unit estateType is required"],
      enum: ["studio", "shared-room", "single-room", "apartment"], // TODO we need to check if these are all the
    },

    address: {
      type: addressSchema,
      required: [true, "unit address is required"],
    },

    dailyPrice: {
      type: Number,
      required: [true, "unit dailyPrice is required"],
    },

    isAvailable: Boolean,

    images: [{ type: String, required: [true, "unit images is required"] }],

    isPetsAllowed: Boolean,

    numberOfResidents: {
      type: Number,
      required: [true, "unit numberOfResidents is required"],
    },

    unitInfo: {
      description: {
        type: String,
        required: [true, "unit unitInfo description is required"],
      },
      rooms: {
        type: Number,
        required: [true, "unit unitInfo rooms is required"],
      },
      bathrooms: {
        type: Number,
        required: [true, "unit unitInfo bathrooms is required"],
      },
      floor: {
        type: Number,
        required: [true, "unit unitInfo floor is required"],
      },
    },

    gender: {
      type: String,
      required: [true, "unit gender is required"],
      enum: ["male", "female", "any"],
    },

    geoLocation: {
      type: {
        type: String,
        enum: ["Point"], // 'location.type' must be 'Point'
        required: [true, "unit location is required"],
      },
      coordinates: {
        type: [Number],
        required: [true, "unit coordinates is required"],
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("units", schema);
