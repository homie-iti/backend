const express = require('express')
const { param } = require('express-validator')

const router = express.Router()
const validationMW = require('../middlewares/validationMW')
const {
    helpQuestionPostValidation,
    helpQuestionUpdateValidation,
} = require('../middlewares/validations/helpQuestionsValidations')

const {
    validateId,
    pageValidations,
} = require('../middlewares/validations/generalValidations')
const helpController = require('../controllers/helpQuestionController')

router
    .route('/help-questions')

    .get(pageValidations, validationMW, helpController.getHelpQuestionsByPage)

    .post(
        helpQuestionPostValidation,
        validationMW,
        helpController.createQuestion
    )

// .put(
//     helpQuestionUpdateValidation,
//     validationMW,
//     helpController.updateHelpQuestion
// )

// router.route("/helpQuestion/all")
//     .delete(helpController.deleteAllQuestion)

router.route('/helpQuestion/many').delete(helpController.deleteManyQuestion)

router
    .route('/helpQuestion/:id')
    .get(
        validateId('HelpQuestion', param),
        validationMW,
        helpController.getQuestionById
    )
    .put(
        helpQuestionUpdateValidation,
        validationMW,
        helpController.updateHelpQuestion
    )

    .delete(
        validateId('HelpQuestion', param),
        validationMW,
        helpController.deleteQuestion
    )

module.exports = router
