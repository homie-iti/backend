const mongoose = require("mongoose");
const addressSchema = require("./addressModel");
//some property lose
const schema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Types.ObjectId,
    },

    fullName: {
      type: String,
      required: [true, "user fullName is required"],
    },
    age: {
      type: Number,
      min: 18,
      required: [true, "user age is required"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "user email is required"],
      // match:{}
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: [true, "user gender is required"],
    },
    password: {
      type: String,
      required: [true, "user password is required"],
    },
    phone: { type: String, required: [true, "user phone is required"] },
    national_id: {
      type: Number,
      required: [true, "user national_id is required"],
      unique: true,
    },
    image: { type: String },

    address: addressSchema,
  },
  { timestamps: true }
);
mongoose.model("users", schema);