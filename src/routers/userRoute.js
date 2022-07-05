const express = require("express");
const router = express.Router();
const { body, param, query } = require("express-validator");

const userController = require("./../controllers/userController");

router.route("/users").get(userController.getAllUsers);

module.exports = router;
