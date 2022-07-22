const express = require('express')
const router = express.Router()
const validationMW = require('../middlewares/validationMW')
const {
    helpQuestionPostValidation,
    helpQuestionUpdateValidation,
    helpQuestionDeleteValidation,
} = require('../middlewares/validtion')
const helpController = require('./../controllers/helpQuestionController')

router
    .route('/helpQuestion')

    .get(helpController.getAllQuestion)

    .post(
        helpQuestionPostValidation,
        validationMW,
        helpController.createQuestion
    )

    .put(
        helpQuestionUpdateValidation,
        validationMW,
        helpController.updateHelpQuestion
    )

// router.route("/helpQuestion/all")
//     .delete(helpController.deleteAllQuestion)

router.route('/helpQuestion/many').delete(helpController.deleteManyQuestion)

router
    .route('/helpQuestion/:id')
    .get(helpController.getQuestionById)

    .delete(
        helpQuestionDeleteValidation,
        validationMW,
        helpController.deleteQuestion
    )

module.exports = router
