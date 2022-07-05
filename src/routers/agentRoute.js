const express = require("express");
const validationMW = require("../middlewares/validationMW");
const agentController = require("../controllers/agent.controller");
const { body, param, query } = require("express-validator");
const router = express.Router();

router
  .route("/agent")
  .get(agentController.getAllAgents)
  .post(
    [
      body("id").isMongoId().withMessage("agent id should be MongoId"),
      body("fullname")
        .isString()
        .withMessage("student name should be characters"),
      body("age").isNumeric().withMessage("age should be number"),
      body("password")
        .isString()
        .withMessage("agent password should be string"),
      body("gender").isString().withMessage("agent gender should be string"),
      body("phone").isNumeric().withMessage("agent phone should be number"),
      body("national_id")
        .isNumeric()
        .withMessage("agent national ID should be number"),
      body("image").isString().withMessage("agent image should be string"),
      body("email").isString().withMessage("agent email should be string"),
      body("address").isObject().withMessage("agent address should be object"),
    ],
    validationMW,
    agentController.createAgent
  )
  .put(
    [
      body("id").isMongoId().withMessage("agent id should be MongoId"),
      body("fullname")
        .isString()
        .withMessage("student name should be characters"),
      body("age").isNumeric().withMessage("age should be number"),
      body("password")
        .isString()
        .withMessage("agent password should be string"),
      body("gender").isString().withMessage("agent gender should be string"),
      body("phone").isNumeric().withMessage("agent phone should be number"),
      body("nationalID")
        .isNumeric()
        .withMessage("agent national ID should be number"),
      body("image").isString().withMessage("agent image should be string"),
      body("email").isString().withMessage("agent email should be string"),
      body("address").isObject().withMessage("agent address should be object"),
    ],
    validationMW,
    agentController.updateAgent
  );

router
  .route("/agent/:id")
  .get(
    [param("id").isMongoId().withMessage("agent id should be objectID")],
    validationMW,
    agentController.getAgentByID
  )
  .delete(
    [param("id").isMongoId().withMessage("agent id should be objectID")],
    validationMW,
    agentController.deleteAgent
  );

module.exports = router;
