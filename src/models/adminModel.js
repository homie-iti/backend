const mongoose = require("mongoose");
//some property lose
const schema = new mongoose.Schema({
  _id: {
    type: mongoose.Types.ObjectId,
    auto: true,
  },
  fullName: {
    type: String,
    required: [true, "admin name is required"],
    match: [
      /^[A-Z][A-Za-z ]{3,}[A-Z][A-Za-z ]{3,}[A-Z][A-Za-z ]{3,}$/,
      "please enter fullName (three words)the first letter capital ",
    ],
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
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  password: {
    type: String,
    required: [true, "admin password is required"],
    // match: [
    // 	/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/,
    // 	"password must be than 8 characters , contains at least one lowercase  one uppercase  at least one digit and special character",
    // ],
  },
  phone: {
    type: String,
    required: [true, "admin phone number is required"],
    match: [/^(002)?^01[1205][0-9]{8}$/, "Please fill a valid phone number"],
  },
  national_id: {
    type: Number,
    unique: true,
    required: [true, "admin national id number is required"],
  },
  image: {
    type: String,
    match: [
      /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)$/,
      "Please fill a valid url address image",
    ],
  },
});

module.exports = mongoose.model("admins", schema);
