const express = require("express");
const agentController = require("../controllers/agent.controller");
const router = express.Router();

router
  .route("/Agent")
  .get(agentController.getAllAgents)
  .post(agentController.createAgent)
  .put(agentController.updateAgent);

router
  .route("/Agent/:id")
  .get(agentController.getAgentByID)
  .delete(agentController.deleteAgent);

module.exports = router;
