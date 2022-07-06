const express = require("express");
const router = express.Router();
const { body, param, query } = require("express-validator");

const helpController = require("./../controllers/helpQuestionController");

router.route("/helpQuestion")

.get(helpController.getAllQuestion)


 .post(helpController.createQuestion)

  .put(helpController.updateHelpQuestion)





router.route("/helpQuestion/:id")
.get(helpController.getQuestionById)

.delete(helpController.deleteQuestion)


module.exports = router;