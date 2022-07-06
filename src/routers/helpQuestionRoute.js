const express = require("express");
const router = express.Router();
const validationMW = require("../middlewares/validationMW");
const { helpQuestionPostValidtion, helpQuestionUpdateValidtion,helpQuestionDeleteValidtion } = require("../middlewares/validtion")
const helpController = require("./../controllers/helpQuestionController");

router.route("/helpQuestion")

    .get(helpController.getAllQuestion)


    .post(helpQuestionPostValidtion, validationMW, helpController.createQuestion)

    .put(helpQuestionUpdateValidtion, validationMW, helpController.updateHelpQuestion)





router.route("/helpQuestion/:id")
    .get(helpController.getQuestionById)

    .delete( helpQuestionDeleteValidtion, validationMW ,helpController.deleteQuestion)


module.exports = router;