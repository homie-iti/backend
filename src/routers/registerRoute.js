const express = require("express");
const router = express.Router();

const Register = require("./../controllers/registerController");

router.route("/register")

    .post(Register.userSignUp)

module.exports = router;
